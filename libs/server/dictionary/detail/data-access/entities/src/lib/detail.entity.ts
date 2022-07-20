import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Detail extends BaseEntity implements BaseType {

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  antonyms?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  typeOf?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  hasTypes?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  partOf?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  hasParts?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  instanceOf?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  hasInstances?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  similarTo?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  also?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  entails?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  memberOf?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  hasMembers?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  substanceOf?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  hasSubstances?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  inCategory?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  hasCategories?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  usageOf?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  hasUsages?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  inRegion?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  regionOf?: string[];

  @Field(() => [String], {nullable: true})
  @Column('simple-array', {default: ''})
  pertainsTo?: string[];
}
