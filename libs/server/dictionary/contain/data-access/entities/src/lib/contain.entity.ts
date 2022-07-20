/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Contain extends BaseEntity implements BaseType {
  @Field(() => Word, {nullable: true})
  @ManyToOne(() => Word, (word) => word.contains)
  word!: Word;

  @Field(() => Phrase, {nullable: true})
  @ManyToOne(() => Phrase, (phrase) => phrase.contains)
  phrase!: Phrase;
};