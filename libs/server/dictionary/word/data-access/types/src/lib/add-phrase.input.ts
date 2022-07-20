import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddPhraseInput {
  @Field()
  wordId!: string;

  @Field()
  phraseId!: string;
}
