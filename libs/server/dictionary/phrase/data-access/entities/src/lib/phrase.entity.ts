/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Contain } from '@els/server/dictionary/contain/data-access/entities';
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { PhraseTranslation } from '@els/server/dictionary/phrase-translation/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
@Directive('@key(fields: "id")')
@ObjectType({
  implements: () => [BaseType],
})
export class Phrase extends BaseEntity implements BaseType {
  @Field({nullable: true})
  @Column()
  explanation!: string;

  @Field({nullable: true})
  @Column()
  text?: string;

  @Field()
  @Column()
  lang!: string;

  @Field(() => [PhraseTranslation], {nullable: true})
  @OneToMany(() => PhraseTranslation, (phraseTranslations) => phraseTranslations.phrase)
  phraseTranslations?: PhraseTranslation[];

  @Field(() => [Example], {nullable: true})
  @OneToMany(() => Example, (example) => example.phrase)
  examples?: Example[];

  @Field(() => [Contain], {nullable: true})
  @OneToMany(() => Contain, (contains) => contains.phrase)
  contains?: Contain[];
};
