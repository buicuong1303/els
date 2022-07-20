import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetActualSkillHistoryArgs {
  @Field()
  skill!: string;
  
  @Field()
  period!: string;

  @Field()
  studentId!: string;
}
