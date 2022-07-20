import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePhraseInput {
  @Field()
  text!: string;

  @Field()
  lang!: string;

  @Field()
  explanation!: string;
};