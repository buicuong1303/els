/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import {
  ObjectType,
  Field,
} from '@nestjs/graphql';
import {
  Column,
  Entity,
} from 'typeorm';
import { BaseEntity, BaseType, JSONType, ScheduleNotificationType } from '@els/server/shared';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class ScheduleNotification extends BaseEntity implements BaseType {

  @Field()
  @Column()
  name!: string;

  @Field(() => ScheduleNotificationType)
  @Column({ type: 'varchar'})
  type!: ScheduleNotificationType;

  @Field()
  @Column()
  body!: string;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column({ type: 'timestamptz', nullable: true })
  scheduleAt!: Date;

  @Field(() => Boolean)
  @Column({ default: false })
  persistent!: boolean;

  // @Field(() => [String])
  // @Column({ type: 'simple-array'})
  // fields!: string[];

  @Field(() => JSONType)
  @Column('jsonb', { nullable: true })
  metadata?: any;
}
