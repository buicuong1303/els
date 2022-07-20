import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class UpdateJSONInput {
  @Field()
  memoryAnalysisId!: string;

  @Field(() => String, { nullable : true})
  updateAt!: string;
}
