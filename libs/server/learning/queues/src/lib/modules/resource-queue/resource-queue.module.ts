import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ResourceQueueProducer } from './resource-queue.producer';
import { ResourceQueueService } from './resource-queue.service';
import { ResourceQueueConsumer } from './resource-queue.consumer';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'resource-queue',
    }),
  ],
  providers: [
    ResourceQueueConsumer,
    ResourceQueueProducer,
    ResourceQueueService
  ],
  exports: [ResourceQueueService],
})
export class ResourceQueueModule {}