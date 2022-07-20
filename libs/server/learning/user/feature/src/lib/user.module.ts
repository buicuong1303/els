/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from '@els/server/learning/user/data-access/services';
import { User } from '@els/server/learning/user/data-access/entities';
import { EnrollmentModule } from '@els/server/learning/enrollment/feature';
import { WordbookModule } from '@els/server/learning/wordbook/feature';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMutationsResolver } from './user-mutations.resolver';
import { MissionTargetResolver } from './mission-target.resolver';
import { MissionModule } from '@els/server/learning/mission/feature';
import { MissionQueueModule } from '@els/server/learning/queues';
import { AccountIdentityResolver } from './account-identity.resolver';
import { UserController } from './user.controller';
import { RankModule } from '@els/server/learning/rank/feature';
import { SettingModule } from '@els/server/learning/setting/feature';
import { StreakModule } from '@els/server/learning/streak/feature';
import { PubSubModule, RedisCacheModule } from '@els/server/shared';
import { AmqpModule } from '@els/server/learning/amqp';

@Module({
  imports: [
    forwardRef(() => AmqpModule),
    forwardRef(() => MissionQueueModule),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => EnrollmentModule),
    WordbookModule,
    MissionModule,
    RankModule,
    SettingModule,
    StreakModule,
    PubSubModule,
    RedisCacheModule
  ],
  controllers: [UserController],
  providers: [
    UserResolver,
    UserService,
    UserMutationsResolver,
    MissionTargetResolver,
    AccountIdentityResolver,
  ],
  exports: [UserService],
})
export class UserModule {}
