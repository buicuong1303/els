// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { BaseLang } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { ChildEntity, OneToMany } from 'typeorm';

@ChildEntity()
@ObjectType()
export class Lang extends BaseLang {
  @Field(() => [Word])
  @OneToMany(() => Word, (word) => word.lang)
  words!: Word[];
}
