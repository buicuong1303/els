/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { User } from '@els/server/learning/common';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { NotificationObject } from './notification-object.entity';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class NotificationChange extends BaseEntity implements BaseType {

  @Field(() => NotificationObject)
  @ManyToOne(() => NotificationObject, (notificationObject) => notificationObject.notifications)
  notificationObject!:  NotificationObject;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.notifications)
  actor!:  User;

  @HideField() 
  @Column('uuid', { nullable: true })
  actorId?: string;

}
