import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateWordByExcelInput {
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

  @Field({nullable: true})
  phonetic!: string;

  @Field({nullable: true})
  audioUri?: string;
}
