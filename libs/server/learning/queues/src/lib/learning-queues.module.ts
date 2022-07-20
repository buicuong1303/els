import { Module } from '@nestjs/common';
import { MissionQueueModule } from './modules/mission-queue/mission-queue.module';
import { ResourceQueueModule  } from './modules/resource-queue/resource-queue.module';
@Module({
  imports: [MissionQueueModule, ResourceQueueModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class LearningQueuesModule { }
