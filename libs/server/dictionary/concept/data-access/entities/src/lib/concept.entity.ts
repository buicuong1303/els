/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Join } from '@els/server/dictionary/join/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Concept extends BaseEntity implements BaseType {
  @Field()
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ default: '' })
  antonym?: string;

  @Field(() => [Join])
  @OneToMany(() => Join, (join) => join.concept)
  joins!: Join[];
}
