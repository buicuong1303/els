import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateWordInput {
  @Field()
  text!: string;

  @Field()
  langId!: string;

  @Field()
  posId!: string;

  @Field()
  explanation!: string;

  @Field()
  description!: string;

  @Field()
  phonetic!: string;

  // @Field()
  // mean!: string;

  // @Field()
  // meanCode!: string;

  @Field({nullable: true})
  audioUri?: string;
}
