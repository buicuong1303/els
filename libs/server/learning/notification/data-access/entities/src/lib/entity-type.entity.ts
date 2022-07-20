/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { NotificationObject } from './notification-object.entity';

@Entity()
@Unique(['code'])
@ObjectType({
  implements: () => [BaseType],
})
export class EntityType extends BaseEntity implements BaseType {
  @Field()
  @Column()
  entity!: string;

  @Field()
  @Column()
  code!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => [NotificationObject])
  @OneToMany(() => NotificationObject, (notificationObject) => notificationObject.entityType)
  notificationObjects?:  NotificationObject[];

}
