/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { DatabaseLogger, BaseLang } from '@els/server/shared';
import { Category } from '@els/server/learning/category/data-access/entities';
import { RewardUnit } from '@els/server/learning/reward-unit/data-access/entities';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { Level } from '@els/server/learning/level/data-access/entities';
import { ActualSkill, MemoryAnalysis, ActualSkillHistory, MemoryAnalysisEnrollment } from '@els/server/learning/memory-analysis/data-access/entities';
import { AssignedMission, Mission, Reward, AssignedMissionMission } from '@els/server/learning/mission/data-access/entities';
import { Prompt, Question } from '@els/server/learning/question/data-access/entities';
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities';
import { Specialization } from '@els/server/learning/specialization/data-access/entities';
import { Streak, StreakList } from '@els/server/learning/streak/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { MissionTarget, User } from '@els/server/learning/user/data-access/entities';
import { Resource, Vocabulary, Word } from '@els/server/learning/vocabulary/data-access/entities';
import { Wordbook } from '@els/server/learning/wordbook/data-access/entities';
import { Course } from '@els/server/learning/course/data/access/entities';
import { Language } from '@els/server/learning/language/data-access/entities';
import { AvailableMission } from '@els/server/learning/available-mission/data-access/entities';
import { Rank } from '@els/server/learning/rank/data-access/entities';
import { RankLog } from '@els/server/learning/rank-log/data-access/entities';
import { RankType } from '@els/server/learning/rank-type/data-access/entities';
import { Device } from '@els/server/learning/device/data-access/entities';
import { Setting } from '@els/server/learning/setting/data-access/entities';
import { EntityType, NotificationObject, Notification, NotificationChange, ScheduleNotification } from '@els/server/learning/notification/data-access/entities';

//* entities
// import * as entities from './entities-index';


export default class TypeOrmConfig {
  static getOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      // entities: Object.values(entities),
      entities: [
        BaseLang,
        Language,
        Category,
        RewardUnit,
        Enrollment,
        Lesson,
        Level,
        ActualSkill,
        MemoryAnalysis,
        MemoryAnalysisEnrollment,
        AssignedMission,
        AssignedMissionMission,
        Mission,
        Reward,
        Prompt,
        Question,
        Skill,
        SkillLevel,
        Specialization,
        AvailableMission,
        StreakList,
        Streak,
        Topic,
        MissionTarget,
        User,
        Resource,
        Vocabulary,
        Word,
        Wordbook,
        Course,
        Rank,
        RankLog,
        RankType,
        Device,
        ActualSkillHistory,
        EntityType,
        NotificationObject,
        Notification,
        NotificationChange,
        ScheduleNotification,
        Setting
      ],
      synchronize: true,
      logger: new DatabaseLogger(),
    };
  }
}
export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> =>
    TypeOrmConfig.getOrmConfig(),
};
