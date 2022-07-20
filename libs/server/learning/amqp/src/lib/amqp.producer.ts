/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { PushNotificationDto, SubscribeTopicDto } from '@els/server/shared';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AmqpProducer {
  constructor(private readonly _amqpConnection: AmqpConnection) {}

  public async sendNotification(data: PushNotificationDto) {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'notification.cmd.notify.learning.notification',
      data
    );
  }
  public async subscribeToTopic(data:SubscribeTopicDto ) {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'notification.cmd.subscribe.learning.notification',
      data
    );
  }

  public async unsubscribeToTopic(data:SubscribeTopicDto ) {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'notification.cmd.unsubscribe.learning.notification',
      data
    );
  }
}
