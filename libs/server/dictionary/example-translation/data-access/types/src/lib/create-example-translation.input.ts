import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateExampleTranslationInput {
  @Field()
  text!: string;

  @Field()
  lang!: string;

  @Field()
  exampleId!: string;
};
