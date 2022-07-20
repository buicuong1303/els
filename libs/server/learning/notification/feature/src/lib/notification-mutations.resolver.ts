import { Notification } from '@els/server/learning/notification/data-access/entities';
import { NotificationService } from '@els/server/learning/notification/data-access/services';
import { CreateNotificationScheduleInput, NotificationMutations, ReadNotificationInput } from '@els/server/learning/notification/data-access/types';
import { Auth, Identity } from '@els/server/shared';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';
@Resolver(() => NotificationMutations)
export class NotificationMutationsResolver {

  constructor(
    private readonly _notificationService: NotificationService
  ){}

  @ResolveField(() => Notification)
  create(
  @Args('createNotificationScheduleInput') createNotificationScheduleInput: CreateNotificationScheduleInput,
    @Auth() identity: Identity
  ) {
    return this._notificationService.createScheduleNotification(createNotificationScheduleInput, identity);
  }

  @ResolveField(() => Notification)
  runScheduleNotification(
  @Args('scheduleNotificationId') scheduleNotificationId: string
  ) {
    return this._notificationService.runScheduleNotification(scheduleNotificationId);
  }

  @ResolveField(() => String, { nullable: true })
  read(
  @Args('readNotificationInput') readNotificationInput: ReadNotificationInput,
  ) {
    return this._notificationService.readNotification(readNotificationInput);
  }

}