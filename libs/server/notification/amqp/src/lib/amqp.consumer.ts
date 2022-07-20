/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Nack, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { FirebaseService } from '@els/server/notification/firebase/data-access/services';
import { PushMode, PushNotificationDto } from '@els/server/shared';

@Injectable()
export class AmqpConsumer {
  //* receive notify from learning
  constructor(private readonly _firebaseService: FirebaseService) {}
  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'notification.cmd.notify.learning.notification',
    queue: 'phpswteam.els-notification.cmd.notify.learning.notification',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  public sendNotification(data: PushNotificationDto) {
    switch (data.mode) {
      case PushMode.SEND_TO_TOPIC:
        this._firebaseService.sendToTopic(data.payload);
        break;
      case PushMode.SEND_TO_DEVICE:
        this._firebaseService.sendToDevice(data.payload);
        break;
      // case PushMode.SEND_ALL:
      //   this._firebaseService.sendAll(data.payload);
      default:
        break;
    }
  }
  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'notification.cmd.unsubscribe.learning.notification',
    queue: 'phpswteam.els-notification.cmd.unsubscribe.learning.notification',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  public unsubscribeFromTopic(data: any) {
    return this._firebaseService.unsubscribeFromTopic(
      data.tokens,
      data.topicName
    );
  }

  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'notification.cmd.subscribe.learning.notification',
    queue: 'phpswteam.els-notification.cmd.subscribe.learning.notification',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  public subscribeToTopic(data: any) {
    return this._firebaseService.subscribeToTopic(data.tokens, data.topicName);
  }
}
