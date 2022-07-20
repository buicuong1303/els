/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { Term } from '@els/server/dictionary/term/data-access/entities';
import { ExampleTranslation } from 'libs/server/dictionary/example-translation/data-access/entities/src';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Example extends BaseEntity implements BaseType {
  @Field()
  @Column()
  token!: string;

  @Field()
  @Column()
  sentence!: string;

  @Field(() => Definition, {nullable: true})
  @ManyToOne(() => Definition, (definition) => definition.examples)
  definition?: Definition;

  @Field(() => Phrase, {nullable: true})
  @ManyToOne(() => Phrase, (phrase) => phrase.examples)
  phrase!: Phrase;

  @Field(() => [Term], {nullable: true})
  @OneToMany(() => Term, (term) => term.example)
  terms!: Term[];

  @Field(() => [ExampleTranslation])
  @OneToMany(() => ExampleTranslation, (exampleTranslation) => exampleTranslation.example)
  exampleTranslations!: ExampleTranslation[];
};
