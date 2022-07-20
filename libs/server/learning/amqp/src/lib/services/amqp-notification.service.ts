/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  MemoryAnalysis,
  NotificationType,
  systemNotificationConfig,
  Topic,
  User
} from '@els/server/learning/common';
import { Device } from '@els/server/learning/device/data-access/entities';
import {
  EntityType,
  Notification,
  NotificationChange,
  NotificationObject,
  ScheduleNotification
} from '@els/server/learning/notification/data-access/entities';
import { exceptions, PushMode, SubscribeTopicDto } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Connection, In, LessThan } from 'typeorm';
import { AmqpProducer } from '../amqp.producer';

@Injectable()
export class AmqpNotificationService {
  private readonly _logger = new Logger(AmqpNotificationService.name);
  constructor(
    private readonly _amqpProducer: AmqpProducer,
    private readonly _connection: Connection
  ) {}

  private async _storeNotifications (config: any, notifierIds: string[], notificationObject: NotificationObject = null) {
    const createNotificationPromise = notifierIds.map(
      (notifierId: string) => {
        const notification = this._connection
          .getRepository(Notification)
          .create();
        notification.title = config.title;
        notification.body = config.body;
        notification.notificationObject = notificationObject;
        notification.notifierId = notifierId;
        return this._connection.getRepository(Notification).save(notification);
       
      }
    );
    return await Promise.all(createNotificationPromise);
  }
  private async _notifyToReviewRequest(actorId: string, entityId: string) {
    if (!actorId)
      throw new exceptions.BadRequestError(
        'actor is required',
        this._logger
      );
    const config = {...systemNotificationConfig[NotificationType.REVIEW_REQUEST]};

    //* nguoi nhan thong bao
    const notifierIds = [actorId];
    const devices = await this._connection.getRepository(Device).find({
      where: {
        userId: In(notifierIds),
      },
    });
    const infoTopic = await this._connection
      .getRepository(Topic)
      .findOne({ id: entityId });
    if (!infoTopic)
      throw new exceptions.NotFoundError('Not found topic', this._logger);
    config.body = config.body.replace(
      '{{topic_name}}',
      `${infoTopic.name}`
    );
    const entityType = await this._connection
      .getRepository(EntityType)
      .findOne({ code: 'review-request' });
    if (!entityType)
      throw new exceptions.NotFoundError(
        'Not found entity type',
        this._logger
      );
      

    let infoNotificationObject = await this._connection.getRepository(NotificationObject).findOne({
      entityId,
      entityTypeId: entityType.id
    });

    if (!infoNotificationObject){
      const notificationObject = this._connection
        .getRepository(NotificationObject)
        .create();
      notificationObject.entityId = entityId;
      notificationObject.entityTypeId = entityType.id;
      infoNotificationObject = await this._connection.getRepository(NotificationObject).save(
        notificationObject
      );
      const notificationChange = this._connection
        .getRepository(NotificationChange)
        .create();
      notificationChange.actorId = actorId;
      await this._connection.getRepository(NotificationChange).save(notificationChange);
     
    }
    const isReceived = await this._connection.getRepository(Notification).findOne({
      where: {
        notificationObjectId: infoNotificationObject.id,
        notifierId: notifierIds[0]
      }
    });
    if (isReceived) return;
    //* store notification in db
    const createdNotifications: Notification[] = await this._storeNotifications(config, notifierIds, infoNotificationObject);
    this._amqpProducer.sendNotification({
      mode: PushMode.SEND_TO_DEVICE,
      payload: {
        title: config.title,
        body: config.body,
        tokens: devices.map((device: Device) => device.token),
        metadata: {
          id: createdNotifications[0].id,
          actor: 'system',
          code: infoNotificationObject.entityType?.code,
          message: `<a class='notification' href=${process.env.APP_URL}/learning/topic/${infoNotificationObject.entityId}>${createdNotifications[0].body}</a>`,
          status: createdNotifications[0].status,
          link: `${process.env.APP_URL}/learning/topic/${infoNotificationObject.entityId}`,
          createdAt: createdNotifications[0].createdAt
        },
      },
    });
  }

  private async _notifyToCongratulateCompletedTopic(actorId: string, entityId: string) {
    if (!actorId)
      throw new exceptions.BadRequestError(
        'actor is required',
        this._logger
      );
    const entityType = await this._connection
      .getRepository(EntityType)
      .findOne({ code: 'congratulate-completing' });
    if (!entityType)
      throw new exceptions.NotFoundError(
        'Not found entity type',
        this._logger
      );
    const notificationObject = this._connection
      .getRepository(NotificationObject)
      .create();
    notificationObject.entityId = entityId;
    notificationObject.entityTypeId = entityType.id;
    const createdNotificationObject = await this._connection
      .getRepository(NotificationObject).save(
        notificationObject
      );

    const config = {...systemNotificationConfig[NotificationType.CONGRATULATE_COMPLETED_TOPIC]};


    const notifierIds = [actorId];
    const devices = await this._connection.getRepository(Device).find({
      where: {
        userId: In(notifierIds),
      },
    });
    const infoTopic = await this._connection
      .getRepository(Topic)
      .findOne({ id: entityId });
    if (!infoTopic)
      throw new exceptions.NotFoundError('Not found topic', this._logger);
    config.body = config.body.replace(
      '{{topic_name}}',
      `${infoTopic.name}`
    );
    const createdNotifications: Notification[] = await this._storeNotifications(config, notifierIds, createdNotificationObject);

    this._amqpProducer.sendNotification({
      mode: PushMode.SEND_TO_DEVICE,
      payload: {
        title: config.title,
        body: config.body,
        tokens: devices.map((device: Device) => device.token),
        metadata: {
          id: createdNotifications[0].id,
          actor: 'system',
          code: notificationObject.entityType?.code,
          message: `<a class='notification' href=${process.env.APP_URL}/learning/topic/${notificationObject.entityId}>${createdNotifications[0].body}</a>`,
          status: createdNotifications[0].status,
          link: `${process.env.APP_URL}/learning/topic/${notificationObject.entityId}`,
          createdAt: createdNotifications[0].createdAt
        },
      },
    });
  }

  private async _notifyToRemindPracticeMorning() {
    const config =
    systemNotificationConfig[NotificationType.REMIND_PRACTICE_MORNING];
    const users = await this._connection
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id'])
      .innerJoinAndSelect('user.enrollments', 'enrollment')
      .innerJoinAndSelect('user.setting', 'setting')
      .andWhere('setting.notification = :showNotification', { showNotification: true })
      .getMany();
    const notifierIds = users.map((user) => user.id);
    const devices = await this._connection.getRepository(Device).find({
      where: {
        userId: In(notifierIds),
      },
    });

    this._amqpProducer.sendNotification({
      mode: PushMode.SEND_TO_DEVICE,
      payload: {
        title: config.title,
        body: config.body,
        tokens: devices.map((device: Device) => device.token),
      },
    });
  }

  private async _notifyToRemindPracticeAfternoon() {
    const config =
    systemNotificationConfig[
      NotificationType.REMIND_PRACTICE_AFTERNOON
    ];

    const users = await this._connection
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id'])
      .innerJoinAndSelect('user.enrollments', 'enrollment')
      .innerJoinAndSelect('user.setting', 'setting')
      .andWhere('setting.notification = :showNotification', { showNotification: true })
      .getMany();
    const notifierIds = users.map((user) => user.id);
    const devices = await this._connection.getRepository(Device).find({
      where: {
        userId: In(notifierIds),
      },
    });

    this._amqpProducer.sendNotification({
      mode: PushMode.SEND_TO_DEVICE,
      payload: {
        title: config.title,
        body: config.body,
        tokens: devices.map((device: Device) => device.token),
      },
    });
  }

  private async _notifyToRemindPracticeEventing() {
    const config =
    systemNotificationConfig[NotificationType.REMIND_PRACTICE_EVENING];

    const users = await this._connection
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id'])
      .innerJoinAndSelect('user.enrollments', 'enrollment')
      .innerJoinAndSelect('user.setting', 'setting')
      .andWhere('setting.notification = :showNotification', { showNotification: true })
      .getMany();
    const notifierIds = users.map((user) => user.id);
    const devices = await this._connection.getRepository(Device).find({
      where: {
        userId: In(notifierIds),
      },
    });
    this._amqpProducer.sendNotification({
      mode: PushMode.SEND_TO_DEVICE,
      payload: {
        title: config.title,
        body: config.body,
        tokens: devices.map((device: Device) => device.token),
      },
    });
  }

  private async _notifyToRemindPracticeMidnight() {
    const config =
    {...systemNotificationConfig[NotificationType.REMIND_PRACTICE_MIDNIGHT]};

    const users = await this._connection
      .getRepository(User)
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.enrollments', 'enrollment')
      .innerJoinAndSelect('user.setting', 'setting')
      .andWhere('setting.notification = :showNotification', { showNotification: true })
      .getMany();

    const messages = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < users.length; index++) {
      const notifier = users[index].id;
      const devices = await this._connection.getRepository(Device).find({
        where: {
          userId: notifier,
        },
      });
      const numberOfLearnedVocabulary = await this._connection
        .getRepository(MemoryAnalysis)
        .count({
          studentId: In(users[index].enrollments.map((e) => e.id)),
        });
      const message = {
        payload: {
          title: config.title,
          body: config.body.replace(
            '{{learned_words}}',
            `${numberOfLearnedVocabulary}`
          ),
          tokens: devices.map((device) => device.token),
        },
      };
      if (message.payload.tokens.length > 0) messages.push(message);
    }

    messages.forEach((message) => {
      this._amqpProducer.sendNotification({
        mode: PushMode.SEND_TO_DEVICE,
        payload: message.payload,
      });
    });
  }

  private async _notifyComplain1() {
    const config = systemNotificationConfig[NotificationType.COMPLAIN_1];

    const users = await this._connection
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id'])
      .innerJoinAndSelect('user.enrollments', 'enrollment')
      .innerJoinAndSelect('user.setting', 'setting')
      .andWhere('setting.notification = :showNotification', { showNotification: true })
      .getMany();
    const notifierIds = users.map((user) => user.id);
    const devices = await this._connection.getRepository(Device).find({
      where: {
        userId: In(notifierIds),
        updatedAt: LessThan(moment().subtract(3, 'weeks')),
      },
    });
    if (config.persistent) {
      await this._storeNotifications(config, notifierIds);
    }
    this._amqpProducer.sendNotification({
      mode: PushMode.SEND_TO_DEVICE,
      payload: {
        title: config.title,
        body: config.body,
        tokens: devices.map((device: Device) => device.token),
      },
    });
  }

  private async _notifyToRemindComeback() {
    const config =
    systemNotificationConfig[NotificationType.REMIND_COMEBACK];

    const users = await this._connection
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id'])
      .innerJoinAndSelect('user.enrollments', 'enrollment')
      .innerJoinAndSelect('user.setting', 'setting')
      .andWhere('setting.notification = :showNotification', { showNotification: true })
      .getMany();
    const notifierIds = users.map((user) => user.id);
    const devices = await this._connection.getRepository(Device).find({
      where: {
        userId: In(notifierIds),
        updatedAt: LessThan(moment().subtract(2, 'weeks')),
      },
    });
    this._amqpProducer.sendNotification({
      mode: PushMode.SEND_TO_DEVICE,
      payload: {
        title: config.title,
        body: config.body,
        tokens: devices.map((device: Device) => device.token),
      },
    });
  }

  private async _notifyToWelcome(actorId: string, entityId: string) {
    if (!actorId)
      throw new exceptions.BadRequestError(
        'actor is required',
        this._logger
      );
    const config =
    systemNotificationConfig[NotificationType.WELCOME];

    const notifierIds = [actorId];
 
    const entityType = await this._connection
      .getRepository(EntityType)
      .findOne({ code: 'welcome' });
    if (!entityType)
      throw new exceptions.NotFoundError(
        'Not found entity type',
        this._logger
      );
    const notificationObject = this._connection
      .getRepository(NotificationObject)
      .create();
    notificationObject.entityId = entityId;
    notificationObject.entityTypeId = entityType.id;
    const createdNotificationObject = await this._connection.getRepository(NotificationObject).save(
      notificationObject
    );

    const notificationChange = this._connection
      .getRepository(NotificationChange)
      .create();
    notificationChange.actorId = actorId;
    await this._connection.getRepository(NotificationChange).save(notificationChange);

    await this._storeNotifications(config, notifierIds, createdNotificationObject);
  }

  async notify(
    type: NotificationType,
    actorId: string = null,
    entityId: string = null
  ) {
    try {
      switch (type) {
        case NotificationType.REVIEW_REQUEST: {
          await this._notifyToReviewRequest(actorId, entityId);
          break;
        }
        case NotificationType.CONGRATULATE_COMPLETED_TOPIC: {
          await this._notifyToCongratulateCompletedTopic(actorId, entityId);
          break;
        }
        case NotificationType.REMIND_PRACTICE_MORNING: {
          await this._notifyToRemindPracticeMorning();
          break;
        }
        case NotificationType.REMIND_PRACTICE_AFTERNOON: {
          await this._notifyToRemindPracticeAfternoon();
          break;
        }
        case NotificationType.REMIND_PRACTICE_EVENING: {
          await this._notifyToRemindPracticeEventing();
          break;
        }
        case NotificationType.REMIND_PRACTICE_MIDNIGHT: {
          await this._notifyToRemindPracticeMidnight();
          break;
        }
        case NotificationType.COMPLAIN_1: {
          await this._notifyComplain1();
          break;
        }
        case NotificationType.REMIND_COMEBACK: {
          await this._notifyToRemindComeback();
          break;
        }
        case NotificationType.WELCOME: {
          await  this._notifyToWelcome(actorId, entityId);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      this._logger.error(error);
    } 
  }

  async scheduleNotify(scheduleNotification: ScheduleNotification) {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (scheduleNotification.persistent) {
        const users = await this._connection
          .getRepository(User)
          .createQueryBuilder('user')
          .getMany();

        const createNotificationPromises = users.map((user: User) => {
          const notification = this._connection
            .getRepository(Notification)
            .create();
          notification.body = scheduleNotification.body;
          notification.title = scheduleNotification.title;
          notification.notifier = user;
          return this._connection
            .getRepository(Notification)
            .save(notification);
        });
        await Promise.all(createNotificationPromises);
      }
      this._amqpProducer.sendNotification({
        mode: PushMode.SEND_TO_TOPIC,
        payload: {
          title: scheduleNotification.title,
          body: scheduleNotification.body,
          topic: 'els',
          metadata: scheduleNotification.metadata,
        },
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      this._logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async subscribeToTopic(subscribeTopicDto: SubscribeTopicDto) {
    return this._amqpProducer.subscribeToTopic(subscribeTopicDto);
  }

  async unsubscribeToTopic(subscribeTopicDto: SubscribeTopicDto) {
    return this._amqpProducer.unsubscribeToTopic(subscribeTopicDto);
  }
}

