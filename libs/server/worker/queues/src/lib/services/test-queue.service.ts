import { Injectable } from '@nestjs/common';
import { TestQueueProducer } from './test-queue.producer';

@Injectable()
export class TestQueueService {
  constructor(
    private readonly _elsProducer: TestQueueProducer,
  ) {}

  public async addTestElsJobs(testData: string){
    return await this._elsProducer.addTestElsJobs(testData);
  }
}