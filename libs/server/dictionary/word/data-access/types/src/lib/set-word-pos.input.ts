import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SetWordPosInput {
  @Field()
  wordId!: string;

  @Field()
  posId!: string;
}