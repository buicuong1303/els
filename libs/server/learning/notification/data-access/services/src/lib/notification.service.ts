/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AmqpNotificationService } from '@els/server/learning/amqp';
import { User } from '@els/server/learning/common';
import { ScheduleNotification, Notification } from '@els/server/learning/notification/data-access/entities';
import { CreateNotificationScheduleInput, ReadNotificationInput } from '@els/server/learning/notification/data-access/types';
import {
  exceptions,
  Identity
} from '@els/server/shared';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Connection, In } from 'typeorm';

@Injectable()
export class NotificationService {
  private readonly _logger = new Logger(NotificationService.name);
  constructor(
    private readonly _connection: Connection,
    @Inject(forwardRef(() => AmqpNotificationService))
    private readonly _amqpNotificationService: AmqpNotificationService
  ) {}
  async createScheduleNotification(
    createNotificationScheduleInput: CreateNotificationScheduleInput,
    identity: Identity
  ) {
    // const infoUser = await this.connection.getRepository(User).findOne({ identityId: identity.account?.id});
    const infoUser = await this._connection
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.setting', 'setting')
      .where('user.identityId = :identityId', {identityId: identity.account?.id})
      .getOne();

    if (!infoUser) throw new exceptions.NotFoundError('Not found user', this._logger);

    if(infoUser.setting && infoUser.setting?.notification) {
      const newScheduleNotification = this._connection
        .getRepository(ScheduleNotification)
        .create();
      newScheduleNotification.body = createNotificationScheduleInput.body;
      newScheduleNotification.title = createNotificationScheduleInput.title;
      newScheduleNotification.name = createNotificationScheduleInput.name;
      newScheduleNotification.persistent =
      createNotificationScheduleInput.persistent;
      newScheduleNotification.scheduleAt = new Date(
        createNotificationScheduleInput.scheduleAt
      );
      newScheduleNotification.type = createNotificationScheduleInput.type;
      newScheduleNotification.createdBy = infoUser.id;
      newScheduleNotification.updatedBy = infoUser.id;
      newScheduleNotification.metadata = {
        redirectUrl: createNotificationScheduleInput.redirectUrl,
      };

      return this._connection
        .getRepository(ScheduleNotification)
        .save(newScheduleNotification);
    } else {
      return null;
    }
  }

  async runScheduleNotification(scheduleNotificationId: string) {
    const infoScheduleNotification = await this._connection
      .getRepository(ScheduleNotification)
      .findOne(scheduleNotificationId);
    if (!infoScheduleNotification)
      throw new exceptions.NotFoundError(
        'Not found schedule notification',
        this._logger
      );
    this._amqpNotificationService.scheduleNotify(infoScheduleNotification);

  }

  async getNotifications(identity: Identity) {
    const infoUser = await this._connection.getRepository(User).findOne({identityId: identity.account?.id});

    if (!infoUser) throw new exceptions.NotFoundError('Not found user', this._logger);

    const notifications = await this._connection.getRepository(Notification).find({
      where: {
        notifierId: infoUser.id
      },
      relations: ['notificationObject', 'notificationObject.entityType']
    });
    return notifications.map((notification: Notification) => {
      switch (notification.notificationObject.entityType?.code) {
        case 'welcome':
          return {
            id: notification.id,
            actor: 'system',
            code: notification.notificationObject.entityType?.code,
            message: notification.body,
            status: notification.status,
            link: `${process.env.APP_URL}/learning`,
            createdAt: notification.createdAt
          };

        default:
          return {
            id: notification.id,
            actor: 'system',
            code: notification.notificationObject.entityType?.code,
            message: `<a class='notification' href=${process.env.APP_URL}/learning/topic/${notification.notificationObject.entityId}>${notification.body}</a>`,
            status: notification.status,
            link: `${process.env.APP_URL}/learning/topic/${notification.notificationObject.entityId}`,
            createdAt: notification.createdAt
          };
      }

    });
  }

  async readNotification(readNotificationInput: ReadNotificationInput) {
    if (readNotificationInput.ids && readNotificationInput.ids.length > 0) {
      await this._connection.getRepository(Notification).update({
        id: In(readNotificationInput.ids)
      }, { status: 'read'});
    } else {
      await this._connection.getRepository(Notification).update({}, { status: 'read'});
    }
    return 'success';
  }
}
