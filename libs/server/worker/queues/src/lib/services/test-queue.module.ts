import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TestQueueService } from './test-queue.service';
import { TestQueueConsumer } from './test-queue.consumer';
import { TestQueueProducer } from './test-queue.producer';

@Module({
  imports: [
    // ScheduleModule,
    // AmqpModule,
    // TypeOrmModule.forFeature([ScheduleExecutionRepository, ScheduleRepository]),
    BullModule.registerQueue({
      name: 'els-queue',
    }),
  ],
  providers: [
    TestQueueService,
    TestQueueConsumer,
    TestQueueProducer,
  ],
  exports: [TestQueueService],
})
export class TestQueueModule {}
