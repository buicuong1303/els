import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class DoneAssignedMissionInput {
  @Field()
  assignedMissionId!: string;
}
