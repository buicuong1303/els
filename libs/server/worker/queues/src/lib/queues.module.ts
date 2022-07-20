import { forwardRef, Module } from '@nestjs/common';
import { QueuesProvider } from './queues.provider';
import { TestQueueModule } from './services/test-queue.module';

@Module({
  imports: [
    TestQueueModule
  ],
  providers: [],
})
export class QueuesModule {}
