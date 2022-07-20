/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { Mission } from '@els/server/learning/mission/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class AvailableMission extends BaseEntity implements BaseType {
  @Field()
  @Column({ type: 'timestamptz' })
  assignedAt!: Date;

  @Field()
  @Column({ type: 'timestamptz' })
  expiredAt!: Date;

  @Field(() => Mission)
  @ManyToOne(() => Mission, (mission) => mission.availableMissions)
  mission!: string;
}
