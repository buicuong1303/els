import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class AddWordInput {
  @Field()
  vocabularyId!: string;

  @Field()
  wordbookId!: string;
}
