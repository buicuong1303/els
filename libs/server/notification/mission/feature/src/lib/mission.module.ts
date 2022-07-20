/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { MissionResolver } from './mission.resolver';
import { PubSubModule } from '@els/server/shared';
import { MissionService } from '@els/server/notification/mission/data-access/services';
@Module({
  imports: [PubSubModule],
  controllers: [],
  providers: [MissionService, MissionResolver],
  exports: [],
})
export class MissionModule {}
