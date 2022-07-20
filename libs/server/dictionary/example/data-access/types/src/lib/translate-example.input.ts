import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class TranslateExampleInput {
  @Field()
  from!: string;

  @Field()
  to!: string;

};
