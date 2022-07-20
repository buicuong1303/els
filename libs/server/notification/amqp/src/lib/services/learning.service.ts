import { AmqpProducer } from '../amqp.producer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LearningService {
  constructor(private readonly _amqpProducer: AmqpProducer) {}

  public removeTokens(token: string[]) {
    return this._amqpProducer.removeTokens( token);
  }
}
