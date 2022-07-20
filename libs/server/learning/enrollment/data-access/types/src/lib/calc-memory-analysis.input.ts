import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CalcMemoryAnalysisInput {
  @Field()
  studentId!: string;

}
