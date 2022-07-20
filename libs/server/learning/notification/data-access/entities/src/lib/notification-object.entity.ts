/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { EntityType } from './entity-type.entity';
import { Notification } from './notification.entity';

@Entity()
@Unique(['entityTypeId', 'entityId'])
@ObjectType({
  implements: () => [BaseType],
})
export class NotificationObject extends BaseEntity implements BaseType {
  @Field()
  @Column({ nullable: true })
  entityId!: string;


  @Field(() => EntityType)
  @ManyToOne(() => EntityType, (entityType) => entityType.notificationObjects)
  entityType?:  EntityType;

  @HideField()
  @Column('uuid', { nullable: true })
  entityTypeId?: string;

  @Field(() => [Notification])
  @OneToMany(() => Notification, (notification) => notification.notificationObject)
  notifications?:  Notification[];

}
