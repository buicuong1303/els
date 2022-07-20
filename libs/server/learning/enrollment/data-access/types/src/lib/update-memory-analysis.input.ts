import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class UpdateMemoryAnalysisInput {
  @Field()
  questionId!: string;

  @Field()
  answer!: string;
}
