/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Term extends BaseEntity implements BaseType {
  @Field()
  @Column()
  term?: string;

  @Field()
  @Column({nullable: true})
  wordId?: string;

  @Field()
  @Column({nullable: true})
  phraseId?: string;

  @Field(() => Example)
  @ManyToOne(() => Example, (example) => example.terms)
  example!: Example;
};
