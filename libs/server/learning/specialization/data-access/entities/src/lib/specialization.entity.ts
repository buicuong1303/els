/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Category } from '@els/server/learning/category/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Specialization extends BaseEntity implements BaseType {
  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ default: ''})
  description?: string;

  @Field(() => [Topic])
  @OneToMany(() => Topic, (topic) => topic.specialization)
  topics!: Topic[];

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.specializations)
  category!: Category;
  
  @HideField()
  @Column('uuid', { nullable: true })
  categoryId?: string;

  @Field({ defaultValue: 0 })
  vocabularyMemorized?: number;

  @Field({ defaultValue: 0 })
  totalVocabulary?: number;
}
