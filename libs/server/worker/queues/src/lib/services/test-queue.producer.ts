import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
// import { Job, JobStatus } from 'bull';


@Injectable()
export class TestQueueProducer {
  constructor(
    @InjectQueue('els-queue')
    private readonly _elsQueue: Queue
  ){}

  //*Handle add jobs to queue
  public async addTestElsJobs(testData: any) {
    // await this._elsQueue.resume();
    await this._addTestElsJob(testData);
  }

  private async _addTestElsJob(testElsData: string) {
    console.log('Add job with data: ' + testElsData);
    try {
      await this._elsQueue.add(
        'test_els', //* name
        testElsData, //* job data
        {
          attempts: 0,
          removeOnComplete: false,
          removeOnFail: false,
        },
      );
    } catch(err) {
      console.log(err);
    }
  }
}