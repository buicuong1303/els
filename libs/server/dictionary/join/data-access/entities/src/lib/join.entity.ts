/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Concept } from '@els/server/dictionary/concept/data-access/entities';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Join extends BaseEntity implements BaseType {

  @Field(() => Concept)
  @ManyToOne(() => Concept, (concept) => concept.joins)
  concept!: Concept;

  @Field(() => Definition)
  @ManyToOne(() => Definition, (definition) => definition.joins)
  definition!: Definition;
};
