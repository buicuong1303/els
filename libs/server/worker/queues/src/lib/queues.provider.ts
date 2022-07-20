import { InjectQueue } from '@nestjs/bull';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { setQueues, BullMQAdapter } from 'bull-board';
import { Queue as QueueMQ } from 'bullmq';

@Injectable()
export class QueuesProvider {
  // constructor(
  //   @InjectQueue('els-queue')
  //   private readonly _testElsQueue: QueueMQ,
  // ) {
  //   this._setupBullQueueMonitoring();
  // }

  // private _setupBullQueueMonitoring = () => {
  //   const bullMQAdapters: BullMQAdapter[] = [
  //     new BullMQAdapter(this._testElsQueue),
  //   ];

  //   setQueues(bullMQAdapters);
  // };
}
