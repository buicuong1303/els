/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Comment,
  CommentDocument,
  Entity,
  EntityDocument,
  Reaction,
  ReactionDocument
} from '@els/server/learning/comment/data-access/schemas';
import {
  CreateCommentInput,
  ReactCommentInput,
  ReplyCommentInput
} from '@els/server/learning/comment/data-access/types';
import { Enrollment } from '@els/server/learning/common';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { User } from '@els/server/learning/user/data-access/entities';
import {
  exceptions, GuardianGrpcServiceClient,
  Identity
} from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection } from 'typeorm';

@Injectable()
export class CommentService {
  private readonly _logger = new Logger(CommentService.name);
  constructor(
    @InjectModel(Comment.name) private _commentModel: Model<CommentDocument>,
    @InjectModel(Entity.name) private _entityModel: Model<EntityDocument>,
    @InjectModel(Reaction.name) private _reactionModel: Model<ReactionDocument>,
    private readonly _connection: Connection,
    private readonly _guardianGrpcServiceClient: GuardianGrpcServiceClient
  ) {}
  //* get full info user reply and react
  async getUserInteract(comment: any) {
    if (comment.children && comment.children.length > 0) {
      comment.children = comment.children.sort(
        (a: any, b: any) => b.createdAt - a.createdAt
      );
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let index = 0; index < comment.children.length; index++) {
        const cmt: any = comment.children[index];
        const infoUser = await this._connection
          .getRepository(User)
          .findOne({ id: cmt.userId });
        if (!infoUser)
          throw new exceptions.NotFoundError('Not found user', this._logger);
        const identity = await this._guardianGrpcServiceClient.getIdentity({
          id: infoUser.identityId,
        });
        if (cmt.reactions && cmt.reactions.length > 0) {
          const newReactions = cmt.reactions.map(async (reaction: any) => {
            const user = await this._connection
              .getRepository(User)
              .findOne({ id: reaction.userId });
            const anotherIdentity = await  this._guardianGrpcServiceClient.getIdentity({
              id: user?.identityId || '',
            });
            reaction = {
              ...reaction,
              user: {
                id: user?.id,
                identity: {
                  traits: anotherIdentity,
                },
              },
            };
            return reaction;
          });
          cmt['reactions'] = await Promise.all(newReactions);
        }

        if (infoUser) {
          cmt['user'] = {
            id: infoUser.id,
            identity: {
              traits: identity,
            },
          };
        }

        await this.getUserInteract(cmt);
      }
    }
  }

  async create(createCommentInput: CreateCommentInput, identity: Identity) {
    const infoUser = await this._connection.getRepository(User).findOne({
      identityId: identity.account?.id,
    });
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
    let infoStudent;
    switch (createCommentInput.entityName) {
      case 'topic': {
        infoStudent = await this._connection
          .getRepository(Enrollment)
          .findOne({
            where:{
              userId: infoUser.id,
              topicId: createCommentInput.entityId,
            },
            relations: ['topic']
          });
        if (!infoStudent) {
          throw new exceptions.NotFoundError(
            'Not found enrollment',
            this._logger
          );
        }

        break;
      }

      default:
        break;
    }
    let infoEntity = await this._entityModel
      .findOne({
        entityId: createCommentInput.entityId,
        entityName: createCommentInput.entityName,
      })
      .exec();
    if (!infoEntity) {
      const createdEntity = new this._entityModel({
        entityId: createCommentInput.entityId,
        entityName: createCommentInput.entityName,
      });
      infoEntity = await createdEntity.save();
    }

    const createdComment = new this._commentModel({
      text: createCommentInput.text,
      entity: infoEntity,
      userId: infoUser.id,
      rating: createCommentInput.rating,
      category: createCommentInput.category,
    });
    await createdComment.save();
    //* if comment is evaluation, update rating
    if (createCommentInput.category === 'evaluation') {
      const averageRating = await this._commentModel
        .aggregate([
          { $match: { category: 'evaluation', entity: infoEntity?._id } },
          { $group: { _id: '$entity', average: { $avg: '$rating' } } },
        ])
        .exec();
      if (infoStudent) {
        infoStudent.topic.rating = averageRating[0]['average'];
        await this._connection.getRepository(Topic).save(infoStudent.topic);
      }
    }
  }

  async findAllCommentsByEntity(entityName: string, entityId: string) {
    const infoEntity = await this._entityModel
      .findOne({ entityId, entityName })
      .exec();
    if (!infoEntity) {
      return [];
    }

    const comments = await this._commentModel
      .find({
        entity: infoEntity.id,
        parentId: null,
        category: 'comment',
      })
      .sort({ createdAt: -1 })
      .exec();

    const newComments = comments.map(async (comment: any) => {
      comment = comment.toObject();
      //* because table user in other database
      await this.getUserInteract(comment);
      return comment;
    });
    return newComments;
  }

  async findAllEvaluationsByEntity(entityName: string, entityId: string) {
    const infoEntity = await this._entityModel
      .findOne({ entityId, entityName })
      .exec();
    if (!infoEntity) {
      return [];
    }

    const evaluations = await this._commentModel
      .find({
        entity: infoEntity.id,
        parentId: null,
        category: 'evaluation',
      })
      .sort({ createdAt: -1 })
      .exec();

    return evaluations;
  }

  async getEntityByIds(ids: any[]) {
    const entities = await this._entityModel
      .find({
        id: {
          $in: ids,
        },
      })
      .exec();
    return entities;
  }

  async react(reactCommentInput: ReactCommentInput, identity: Identity) {
    const infoUser = await this._connection.getRepository(User).findOne({
      identityId: identity.account?.id,
    });

    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
    const infoComment = await this._commentModel
      .findOne({
        _id: reactCommentInput.commentId,
      })
      .exec();

    if (!infoComment)
      throw new exceptions.NotFoundError('Not found comment', this._logger);

    const infoReaction = await this._reactionModel
      .findOne({
        comment: infoComment,
        userId: infoUser.id,
      })
      .exec();

    //* toggle reaction if the same usercios
    if (infoReaction) {
      await infoReaction.deleteOne();
      infoComment.reactionCount -= 1;
      if (infoReaction.emoji === reactCommentInput.emoji) {
        await infoComment.save();
        return infoComment;
      }
    }
    infoComment.reactionCount += 1;
    const createdReaction = new this._reactionModel({
      emoji: reactCommentInput.emoji,
      comment: infoComment,
      userId: infoUser.id,
    });
    await createdReaction.save();
    infoComment.reactions = [...infoComment.reactions, createdReaction];
    return infoComment.save();
  }

  async reply(replyCommentInput: ReplyCommentInput, identity: Identity) {
    const infoUser = await this._connection.getRepository(User).findOne({
      identityId: identity.account?.id,
    });
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
    const infoEntity = await this._entityModel
      .findOne({
        entityId: replyCommentInput.entityId,
      })
      .exec();
    if (!infoEntity)
      throw new exceptions.NotFoundError('Not found entity', this._logger);
    const infoParent = await this._commentModel
      .findById(replyCommentInput.parentId)
      .exec();
    if (!infoParent)
      throw new exceptions.NotFoundError(
        'Not found parent comment',
        this._logger
      );
    const createdComment = new this._commentModel({
      text: replyCommentInput.text,
      entity: infoEntity,
      userId: infoUser.id,
      parentId: infoParent.id,
    });
    await createdComment.save();
    if (infoParent.children) {
      infoParent.children = [...infoParent.children, createdComment.id];
      await infoParent.save();
    }
    return createdComment.save();
  }

  async getReactionsByCommentId(commentId: any) {
    return this._reactionModel.find({
      comment: commentId,
    });
  }
}
