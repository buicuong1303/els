import { Word } from '@els/server/dictionary/word/data-access/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'antonyms type' })
export class AntonymsType {
  @Field(() => [Word])
  words?: Word[];

  @Field()
  explanation?: string;
};