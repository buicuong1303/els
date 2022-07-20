import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreatePronunciationInput {
  @Field()
  phonetic!: string;

  @Field({nullable: true})
  audioUri?: string;
};
