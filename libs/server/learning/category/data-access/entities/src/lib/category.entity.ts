/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Specialization } from '@els/server/learning/specialization/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Category extends BaseEntity implements BaseType {
  @Field({ nullable: true })
  @Column()
  name!: string;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  index!: number;

  @Field({ nullable: true })
  @Column({ default: '' })
  description?: string;

  @Field(() => [Specialization], { nullable: true })
  @OneToMany(() => Specialization, (spec) => spec.category)
  specializations!: Specialization[];

  @Field(() => [Topic], { nullable: true })
  @OneToMany(() => Topic, (topic) => topic.category)
  topics!: Topic[];
}
