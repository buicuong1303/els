/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { StreakModule } from '@els/server/learning/streak/feature';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MissionQueueProducer } from './mission-queue.producer';
import { MissionQueueService } from './mission-queue.service';
import { MissionQueueConsumer } from './mission.queue.consumer';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mission-queue',
    }),
    StreakModule
  ],
  providers: [
    MissionQueueConsumer,
    MissionQueueProducer,
    MissionQueueService
  ],
  exports: [MissionQueueService],
})
export class MissionQueueModule {}