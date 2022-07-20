import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class AssignMissionInput {
  @Field()
  userId!: string;

}
