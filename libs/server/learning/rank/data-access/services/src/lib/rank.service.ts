/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { GqlContext, MemoryStatus } from '@els/server/learning/common';
import { MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { MissionQueueService } from '@els/server/learning/queues';
import { RankType } from '@els/server/learning/rank-type/data-access/entities';
import { Rank, RankElo, RankUserInfo } from '@els/server/learning/rank/data-access/entities';
import { AddUserToRank, GetRankOfUser, GetRanksWithType } from '@els/server/learning/rank/data-access/types';
import { User } from '@els/server/learning/user/data-access/entities';
import { exceptions, GuardianGrpcServiceClient, Identity, pagination, RankEnum, RedisCacheService } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from '@els/server/learning/common';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { nextLevel } from '@els/server/learning/utils';
import { BaseRedisCache } from 'apollo-server-cache-redis';

@Injectable()
export class RankService {
  private readonly _logger = new Logger(RankService.name);
  constructor(
    private readonly _connection: Connection,
    @InjectRepository(RankType)
    private readonly _rankTypeRepository: Repository<RankType>,
    @InjectRepository(Rank)
    private readonly _rankRepository: Repository<Rank>,
    private readonly _guardianGrpcServiceClient: GuardianGrpcServiceClient,
    private readonly _missionQueueService: MissionQueueService,
    private readonly _redisCacheService: RedisCacheService
  ) {};

  private async _getIdentity(user: User) {
    const identity = await  this._guardianGrpcServiceClient.getIdentity({
      id: user?.identityId || '',
    });
    return identity;
  };

  async getRanksWithType(getRanksWithType: GetRanksWithType, cache: BaseRedisCache) {
    const identities = await this._guardianGrpcServiceClient.getIdentities();
    const listIdentityId = identities.identities.map(item => {
      return item.id;
    });
    const rankType = await this._connection
      .getRepository(RankType)
      .createQueryBuilder('rankType')
      .where('rankType.name = :type', {type: getRanksWithType.name})
      .getOne();
    if(!rankType) throw new exceptions.NotFoundError(`Not found type: ${getRanksWithType.name}`, this._logger);

    const ranks = this._connection
      .getRepository(Rank)
      .createQueryBuilder('rank')
      .leftJoinAndSelect('rank.user', 'user')
      .leftJoinAndSelect('rank.rankType', 'rankType')
      .where('rank.rankTypeId = :rankTypeId', { rankTypeId: rankType.id })
      .andWhere('user.identityId is not null')
      .andWhere('user.identityId IN(:...listIdentityId)', { listIdentityId: listIdentityId })
      .select()
      .orderBy('rank.number', 'ASC');

    const listRankQuerySort : any[] = [];
    const cacheConditions = ['pageNumber', 'limit', 'name'];
    const listRankQuery = await pagination.offset.paginate(ranks, getRanksWithType, cache, 5 * 60, cacheConditions);
    for(let i = 0; i < listRankQuery.nodes.length; i++){
      const item = listRankQuery.nodes[i];
      if(item.user.identityId){
        const userCurrent = await this._getIdentity(item.user);
        item.name = `${userCurrent.firstName} ${userCurrent.lastName}`;
        listRankQuerySort.push(item);
      }
    };

    listRankQuerySort.sort((a: any, b: any) => {
      if(a.number === b.number) {
        if(b.name > a.name){
          return -1;
        } else {
          if(b.name < a.name){
            return 1;
          }
          return 0;
        }
      } else {
        return 0;
      };
    });
    listRankQuery.nodes = listRankQuerySort;

    return listRankQuery;
  };

  private async _detectRankForNewUser(rank: Rank, rankType: RankType, listIdentityId: string[]) {
    if(rankType.name === 'Topic'){
      const ranksExisted = await this._connection
        .createQueryBuilder(Rank, 'rank')
        .leftJoinAndSelect('rank.user', 'user')
        .where('rank.elo = :elo', {elo: {topic: 0}})
        .andWhere('user.identityId IN(:...listIdentityId)', { listIdentityId: listIdentityId })
        .getOne();

      if(ranksExisted){
        rank.number = ranksExisted.number;
      };

      rank.elo = {
        topic: 0
      };
    };
    if(rankType.name === 'Word'){
      const ranksExisted = await this._connection
        .createQueryBuilder(Rank, 'rank')
        .leftJoinAndSelect('rank.user', 'user')
        .where('rank.elo = :elo', {elo: {word: 0}})
        .andWhere('user.identityId IN(:...listIdentityId)', { listIdentityId: listIdentityId })
        .getOne();

      if(ranksExisted){
        rank.number = ranksExisted.number;
      };

      rank.elo = {
        word: 0
      };
    };
    if(rankType.name === 'Level'){
      const ranksExisted = await this._connection
        .createQueryBuilder(Rank, 'rank')
        .leftJoinAndSelect('rank.user', 'user')
        .where('rank.elo = :elo', {elo: {
          level: 1,
          nextExp: nextLevel(2),
          exp: 0
        }})
        .andWhere('user.identityId IN(:...listIdentityId)', { listIdentityId: listIdentityId })
        .getOne();

      if(ranksExisted){
        rank.number = ranksExisted.number;
      };

      rank.elo = {
        level: 1,
        nextExp: nextLevel(2),
        exp: 0
      };
    };
    return rank;
  }

  async addUserToRank(addUserToRank: AddUserToRank, queryRunnerArg: QueryRunner) {
    //* Get list Identity
    const identities = await this._guardianGrpcServiceClient.getIdentities();
    const listIdentityId = identities.identities.map(item => {
      return item.id;
    });
    //* Transaction
    const user = await queryRunnerArg.manager
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :userId', {userId: addUserToRank.userId})
      .getOne();
    if(!user) throw new exceptions.NotFoundError('Not found User for rank', this._logger);
    const rankType = await queryRunnerArg.manager
      .getRepository(RankType)
      .createQueryBuilder('rankType')
      .where('rankType.name = :type', {type: addUserToRank.rankType})
      .getOne();
    if(!rankType) throw new exceptions.NotFoundError(`Not found type: ${addUserToRank.rankType}`, this._logger);

    const listUser = await queryRunnerArg.manager
      .getRepository(User)
      .createQueryBuilder('user')
      .getMany();

    const rank = this._rankRepository.create();
    rank.user = user;
    rank.rankType = rankType;
    rank.number = listUser.length;
    const newRank = await this._detectRankForNewUser(rank, rankType, listIdentityId);
    const result = await queryRunnerArg.manager.save(newRank);

    //* Handle cache
    const pageNumber = result.number ? result.number / RankEnum.RANK_LIMIT : 3;
    if(pageNumber <= 2) {
      await this._redisCacheService.delete(`data-caching:rank:pageNumber_1:limit_${RankEnum.RANK_LIMIT}:name_${rankType.name}`);
      await this._redisCacheService.delete(`data-caching:rank:pageNumber_2:limit_${RankEnum.RANK_LIMIT}:name_${rankType.name}`);

      return result;
    }

    //TODO: ? what will return if the condition was failed
  };

  //* Update word rank number of user
  private async _updateWordRankNumber(listRankInWord: any[]) {
    listRankInWord = listRankInWord.map(async (item, index) => {
      if(index > 0 && item.elo.word === listRankInWord[index - 1].elo.word) {
        if(item.number){
          item.numberChange = item.number - listRankInWord[index - 1].number;
        }else {
          item.numberChange = listRankInWord.length - listRankInWord[index - 1].number;
        };

        item.number = listRankInWord[index - 1].number;
      } else {
        if(item.number){
          item.numberChange = item.number - (index + 1);
        } else {
          item.numberChange = listRankInWord.length - (index + 1);
        };

        item.number = index + 1;
      };

      await this._rankRepository.save(item);
    });
    await Promise.all(listRankInWord);
    return listRankInWord;
  }

  //* Update topic rank number of user
  private async _updateTopicRankNumber(listRankInTopic: any[]) {
    listRankInTopic = listRankInTopic.map(async (item, index) => {
      if(index > 0 && item.elo.topic === listRankInTopic[index - 1].elo.topic) {
        if(item.number) {
          item.numberChange =  item.number - listRankInTopic[index - 1].number;
        } else {
          item.numberChange =  listRankInTopic.length - listRankInTopic[index - 1].number;
        };

        item.number = listRankInTopic[index - 1].number;
      } else {
        if(item.number) {
          item.numberChange = item.number - (index + 1);
        } else {
          item.numberChange = listRankInTopic.length - (index + 1);
        };

        item.number = index + 1;
      };
      await this._rankRepository.save(item);
    });
    await Promise.all(listRankInTopic);
    return listRankInTopic;
  }

  //* Update level rank number of user
  private async _updateLevelRankNumber(listRankInLevel: any[]) {
    listRankInLevel = listRankInLevel.map(async (item, index) => {
      if(index > 0 &&
        item.elo.level === listRankInLevel[index - 1].elo.level &&
        item.elo.exp === listRankInLevel[index - 1].elo.exp){
        if(item.number){
          item.numberChange =  item.number - listRankInLevel[index - 1].number;
        } else {
          item.numberChange =  listRankInLevel.length - listRankInLevel[index - 1].number;
        };

        item.number = listRankInLevel[index - 1].number;
      } else {
        if(item.number) {
          item.numberChange = item.number - (index + 1);
        } else {
          item.numberChange = listRankInLevel.length - (index + 1);
        };

        item.number = index + 1;
      };

      await this._rankRepository.save(item);
    });
    await Promise.all(listRankInLevel);
    return listRankInLevel;
  }

  //* Update Word rank elo
  private async _updateWordRankElo(rankUser: Rank) {
    const memoryAnalysis = await this._connection
      .getRepository(MemoryAnalysis)
      .createQueryBuilder('memoryAnalysis')
      .leftJoinAndSelect('memoryAnalysis.student', 'enrollment')
      .leftJoinAndSelect('enrollment.user', 'user')
      .where('user.id = :userId', {userId: rankUser.user.id})
      .andWhere('memoryAnalysis.memoryStatus = :memoryStatus', {memoryStatus: MemoryStatus.memorized})
      .getCount();

    rankUser.elo = {
      word: memoryAnalysis
    };
    return await this._rankRepository.save(rankUser);
  }

  //* Update Topic rank elo
  private async _updateTopicRankElo(rankUser: Rank) {
    const completedTopics = await this._connection.getRepository(Enrollment).count({ userId: rankUser.user.id, isCompleted: true});
    rankUser.elo = {
      topic:completedTopics
    };
    return await this._rankRepository.save(rankUser);
  }

  //* Update Level rank elo
  private async _updateLevelRankElo(rankUser: Rank) {
    const user = await this._connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :userId', {userId: rankUser.user.id})
      .getOne();

    if(!user) throw new exceptions.NotFoundError(`Not found user: ${rankUser.user.id}`, this._logger);

    rankUser.elo = {
      level: user.level,
      exp: user.exp,
      nextExp: user.nextLevelExp
    };
    return await this._rankRepository.save(rankUser);
  }

  //* Sort rank number
  private _sortRankNumber(listRankInWord: any[], listRankInLevel: any[], listRankInTopic: any[]){
    listRankInWord.sort((a, b) => {
      if( a.elo.word || b.elo.word){
        return b.elo.word - a.elo.word;
      }
      return 0;
    });

    listRankInLevel.sort((a, b) => {
      if( a.elo.level || b.elo.level || a.elo.exp || b.elo.exp){
        const level = b.elo.level - a.elo.level;
        if(level !== 0){
          return level;
        }
        const exp = b.elo.exp - a.elo.exp;
        return exp;
      }
      return 0;
    });

    listRankInTopic.sort((a, b) => {
      if( a.elo.topic || b.elo.topic){
        return b.elo.topic - a.elo.topic;
      }
      return 0;
    });
    return {
      listRankInWord,
      listRankInLevel,
      listRankInTopic
    };
  }

  async updateRank(cache: BaseRedisCache) {
    const identities = await this._guardianGrpcServiceClient.getIdentities();
    const listIdentityId = identities.identities.map(item => {
      return item.id;
    });
    const ranks = await this._connection
      .getRepository(Rank)
      .createQueryBuilder('rank')
      .leftJoinAndSelect('rank.user', 'user')
      .leftJoinAndSelect('rank.rankType', 'rankType')
      .where('user.identityId is not null')
      .andWhere('user.identityId IN(:...listIdentityId)', { listIdentityId: listIdentityId })
      .getMany();

    let listRankInWord : any[] = [];
    let listRankInLevel: any[] = [];
    let listRankInTopic: any[] = [];

    //*Filter rank type
    for(let i = 0; i < ranks.length; i++) {
      const rankUser = ranks[i];
      //*Handle Word elo
      if(rankUser.rankType.name === 'Word'){
        //TODO : Need update elo
        const identity = await this._getIdentity(rankUser.user);
        if(identity){
          const newRankUser = await this._updateWordRankElo(rankUser);

          listRankInWord.push(newRankUser);
        }
      };

      //*Handle Level elo
      if(rankUser.rankType.name === 'Level'){
        //TODO : Need update elo
        const identity = await this._getIdentity(rankUser.user);
        if(identity){
          const newRankUser = await this._updateLevelRankElo(rankUser);

          listRankInLevel.push(newRankUser);
        }
      };

      //*Handle Topic elo
      if(rankUser.rankType.name === 'Topic'){
        //TODO : Need update elo
        const identity = await this._getIdentity(rankUser.user);
        if(identity){
          const newRankUser = await this._updateTopicRankElo(rankUser);

          listRankInTopic.push(newRankUser);
        }
      };
    };
    //* Sort Rank theo elo
    const rankAfterSort = this._sortRankNumber(listRankInWord, listRankInLevel, listRankInTopic);

    listRankInWord = rankAfterSort.listRankInWord;
    listRankInLevel = rankAfterSort.listRankInLevel;
    listRankInTopic = rankAfterSort.listRankInTopic;

    //* Update rank number
    listRankInWord = await this._updateWordRankNumber(listRankInWord);

    listRankInLevel = await this._updateLevelRankNumber(listRankInLevel);

    listRankInTopic = await this._updateTopicRankNumber(listRankInTopic);

    const top1rank = await this._rankRepository.query(
      `select rank."userId" from "rank"
      where rank."number" = 1
      group by rank."userId" `
    );
    if (top1rank && top1rank.length > 0)
      top1rank.forEach((user:any) => {
        this._missionQueueService.updateProgressTopRank(user.userId);
      });

    await this._redisCacheService.delete(`data-caching:rank:pageNumber_1:limit_${RankEnum.RANK_LIMIT}:name_Word`);
    await this._redisCacheService.delete(`data-caching:rank:pageNumber_2:limit_${RankEnum.RANK_LIMIT}:name_Word`);
    await this._redisCacheService.delete(`data-caching:rank:pageNumber_1:limit_${RankEnum.RANK_LIMIT}:name_Topic`);
    await this._redisCacheService.delete(`data-caching:rank:pageNumber_2:limit_${RankEnum.RANK_LIMIT}:name_Topic`);
    await this._redisCacheService.delete(`data-caching:rank:pageNumber_1:limit_${RankEnum.RANK_LIMIT}:name_Level`);
    await this._redisCacheService.delete(`data-caching:rank:pageNumber_2:limit_${RankEnum.RANK_LIMIT}:name_Level`);

    for(let i = 1; i < 3; i++) {
      await this.getRanksWithType({
        pageNumber: i,
        limit: RankEnum.RANK_LIMIT,
        name: 'Word'
      }, cache);

      await this.getRanksWithType({
        pageNumber: i,
        limit: RankEnum.RANK_LIMIT,
        name: 'Topic'
      }, cache);

      await this.getRanksWithType({
        pageNumber: i,
        limit: RankEnum.RANK_LIMIT,
        name: 'Level'
      }, cache);
    }
    return null;
  };

  async getRankOfUser(getRankOfUser: GetRankOfUser, identity: Identity) {
    const user = await this._connection
      .getRepository(User)
      .findOne({
        where:{
          identityId: identity.account?.id
        }
      });

    if(!user) throw new exceptions.NotFoundError('Not found User', this._logger);

    const rankOfUser = await this._connection
      .getRepository(Rank)
      .createQueryBuilder('rank')
      .leftJoinAndSelect('rank.user', 'user')
      .leftJoinAndSelect('rank.rankType', 'rankType')
      .where('user.id = :userId', {userId: user.id})
      .andWhere('rankType.name = :rankType', {rankType: getRankOfUser.rankType})
      .getOne();


    if(!rankOfUser) throw new exceptions.NotFoundError('Not found rank', this._logger);

    return rankOfUser;
  }

  async getRankType(ctx: GqlContext) {
    const rankTypes = await this._connection
      .getRepository(RankType)
      .createQueryBuilder('rankType')
      .getMany();
    ctx.cache.set('RANK_TYPE', JSON.stringify(rankTypes[0]), {ttl: null});

    return rankTypes;
  }

  async getRankTypeFromCache(ctx: GqlContext):Promise<any> {
    const data: any = await ctx.cache.get('RANK_TYPE');
    return JSON.parse(data);
  }

  async addUsersToRank(user: User, queryRunner: QueryRunner) {
    const rankTypes = await queryRunner.manager
      .createQueryBuilder(RankType, 'rankType')
      .getMany();
    for(let i = 0; i < rankTypes.length; i++) {
      const rankType = rankTypes[i];
      await this.addUserToRank({
        userId: user.id,
        rankType: rankType.name ? rankType.name : '',
      }, queryRunner);
    };
  }

  async getInfoRankUser(userId: string) {
    const user = await this._connection
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.setting', 'setting')
      .leftJoinAndSelect('user.assignedMissions', 'assignedMissions')
      .leftJoinAndSelect('assignedMissions.mission', 'mission')
      .leftJoinAndSelect('user.streakLists', 'streakLists')
      .leftJoinAndSelect('streakLists.streaks', 'streaks')
      .where('user.id = :userId', {userId})
      .getOne();

    if(!user) throw new exceptions.NotFoundError('Not found User', this._logger);

    const rankOfUser = await this._connection
      .getRepository(Rank)
      .createQueryBuilder('rank')
      .leftJoinAndSelect('rank.user', 'user')
      .leftJoinAndSelect('rank.rankType', 'rankType')
      .where('user.id = :userId', {userId: user.id})
      .getMany();

    if(rankOfUser.length === 0) throw new exceptions.NotFoundError('Not found rank', this._logger);

    const rankUserInfo = new RankUserInfo();
    rankUserInfo.rankInfo = new RankElo();

    rankOfUser.forEach(item => {
      if(item.rankType.name === 'Level'){
        rankUserInfo.rankInfo.exp = item.elo?.exp ?? 0;
        rankUserInfo.rankInfo.level = item.elo?.level ?? 0;
        rankUserInfo.rankInfo.nextExp = item.elo?.nextExp ?? 0;
      };

      if(item.rankType.name === 'Topic'){
        rankUserInfo.rankInfo.topic = item.elo?.topic ?? 0;
      };

      if(item.rankType.name === 'Word'){
        rankUserInfo.rankInfo.word = item.elo?.word ?? 0;
      };
    });

    const streakLists = user.streakLists;
    let attendances = 0;
    let streaksActive = 0;
    streakLists?.forEach(item => {
      if(item.status === 'active') {
        streaksActive = item.streaks.length;
      }
    });
    user.assignedMissions?.forEach(item => {
      if(item.mission.code === 'check_in' && item.status === 'done') {
        attendances ++;
      }
    });

    rankUserInfo.currentStreak = streaksActive;
    rankUserInfo.attendance = attendances;
    rankUserInfo.fromLang = user.setting?.fromLang;
    rankUserInfo.learningLang = user.setting?.learningLang;
    rankUserInfo.userInfo = user;

    return rankUserInfo;
  }
};
