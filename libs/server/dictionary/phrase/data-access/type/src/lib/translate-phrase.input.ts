import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TranslatePhrase {
  @Field()
  text!: string;

  @Field()
  lang!: string;

  @Field()
  phraseId!: string;
};