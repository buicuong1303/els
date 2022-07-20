/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { User } from '@els/server/learning/user/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Device extends BaseEntity implements BaseType {
  @Field()
  @Column()
  token!: string;

  @Field()
  @Column({ nullable: true })
  userAgent!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.devices)
  user!: User;

  @Field()
  @Column('uuid', { nullable: true})
  userId!: string;

  @Field()
  @Column({ default: 'active' })
  status!: string;
}
