/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AmqpModule } from '@els/server/learning/amqp';
import { CategoryModule } from '@els/server/learning/category/feature';
import { CommentModule } from '@els/server/learning/comment/feature';
import { ComplexityPlugin, GqlConfigService, typeOrmConfig } from '@els/server/learning/common';
//* BL module
import { CourseModule } from '@els/server/learning/course/feature';
import { CronModule } from '@els/server/learning/cron/feature';
import { DeviceModule } from '@els/server/learning/device/feature';
import { EnrollmentModule } from '@els/server/learning/enrollment/feature';
import { LearningGrpcModule } from '@els/server/learning/grpc';
import { LanguageModule } from '@els/server/learning/language/feature';
import { LessonModule } from '@els/server/learning/lesson/feature';
import { LevelModule } from '@els/server/learning/level/feature';
import { MemoryAnalysisModule } from '@els/server/learning/memory-analysis/feature';
import { MissionModule } from '@els/server/learning/mission/feature';
import { NotificationModule } from '@els/server/learning/notification/feature';
import { QuestionModule } from '@els/server/learning/question/feature';
import { LearningQueuesModule, MissionQueueModule } from '@els/server/learning/queues';
import { RankLogModule } from '@els/server/learning/rank-log/feature';
import { RankTypeModule } from '@els/server/learning/rank-type/feature';
import { RankModule } from '@els/server/learning/rank/feature';
import { RewardUnitModule } from '@els/server/learning/reward-unit/feature';
import { SettingModule } from '@els/server/learning/setting/feature';
import { SkillModule } from '@els/server/learning/skill/feature';
import { SpecializationModule } from '@els/server/learning/specialization/feature';
import { StreakModule } from '@els/server/learning/streak/feature';
import { TopicModule } from '@els/server/learning/topic/feature';
import { UserModule } from '@els/server/learning/user/feature';
import { VocabularyModule } from '@els/server/learning/vocabulary/feature';
import { WordbookModule } from '@els/server/learning/wordbook/feature';
import { IPv4Scalar, JSONScalar, ObjectIDScalar, SharedServiceModule } from '@els/server/shared';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationModule } from 'libs/server/learning/invitation/feature/src';
//* GraphQL scalars
const graphQLScalars = [
  JSONScalar,
  // DateScalar,
  IPv4Scalar,
  ObjectIDScalar
  // TimeScalar
];

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    
    GraphQLFederationModule.forRootAsync({
      imports: [
        TopicModule,
        VocabularyModule,
        SpecializationModule,
        LanguageModule,
        LessonModule,
        SkillModule,
        MissionModule,
        UserModule,
        EnrollmentModule,
        CategoryModule,
        RewardUnitModule,
        MissionQueueModule,
        CommentModule,
        InvitationModule
      ],
      useClass: GqlConfigService,
    }),
    SharedServiceModule,
    TypeOrmModule.forRootAsync(typeOrmConfig),
    //TODO: still Redis, Bull, TypeORM, Prometheus, Shared...
    StreakModule,
    CourseModule,
    TopicModule,
    LessonModule,
    SpecializationModule,
    VocabularyModule,
    QuestionModule,
    EnrollmentModule,
    UserModule,
    LanguageModule,
    ScheduleModule.forRoot(),
    WordbookModule,
    MemoryAnalysisModule,
    SkillModule,
    LevelModule,
    MissionModule,
    CategoryModule,
    RewardUnitModule,
    LearningGrpcModule,
    LearningQueuesModule,
    CommentModule,
    MongooseModule.forRoot(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`, {
      dbName: `${process.env.MONGODB_DB}`
    }),
    RankModule,
    RankLogModule,
    RankTypeModule,
    DeviceModule,
    AmqpModule,
    NotificationModule,
    CronModule,
    SettingModule
  ],
  controllers: [],
  providers: [
    ComplexityPlugin,
    /**
     * current use graphql shield to replace this
     */
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpErrorFilter,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    ...graphQLScalars,
  ],
})

export class CoreModule {}

