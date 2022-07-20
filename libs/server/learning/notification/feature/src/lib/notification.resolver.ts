import { Notification } from '@els/server/learning/notification/data-access/entities';
import { NotificationService } from '@els/server/learning/notification/data-access/services';
import { NotificationData, NotificationMutations } from '@els/server/learning/notification/data-access/types';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query } from '@nestjs/graphql';
@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly _notificationService: NotificationService) {}

  @Mutation(() => NotificationMutations, { nullable: true, name: 'notification' })
  @UseGuards(AuthGuard)
  notificationMutations() {
    return {};
  }

  @Query(() => [NotificationData])
  @UseGuards(AuthGuard)
  notifications(@Auth() identity: Identity) {
    return this._notificationService.getNotifications(identity);
  }
}
