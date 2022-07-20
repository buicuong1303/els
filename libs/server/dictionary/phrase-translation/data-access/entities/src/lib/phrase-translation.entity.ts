/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class PhraseTranslation extends BaseEntity implements BaseType {
  @Field()
  @Column()
  text!: string;

  @Field()
  @Column()
  lang!: string;

  @Field(() => Phrase)
  @ManyToOne(() => Phrase, (phrase) => phrase.phraseTranslations)
  phrase!: Phrase;
};
