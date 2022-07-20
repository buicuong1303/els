/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  OnQueueCompleted,
  OnQueueFailed, Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';

@Processor('els-queue')
export class TestQueueConsumer {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  @Process({ name: 'test_els', concurrency: 1 })
  async sendTestEls(job: Job<any>) {
    try {
      console.log('Consumer');
      console.log(job.data);
    } catch (error) {
      console.log(error);
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    console.log('Job complete');
    //TODO: update status message.messageStatus = 'sending'
    //TODO: schedule_set = 'done'
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log('Job fail');
    //TODO: update status message.messageStatus = 'error', schedule_set = 'error'
  }
}