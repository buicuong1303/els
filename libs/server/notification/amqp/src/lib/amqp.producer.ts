import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AmqpProducer {
  constructor(private readonly _amqpConnection: AmqpConnection) {}

  public async removeTokens(data) {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'notification.evt.notify.notification.learning',
      data,
    );
  }
}
