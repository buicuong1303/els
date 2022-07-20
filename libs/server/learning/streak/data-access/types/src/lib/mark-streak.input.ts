import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class MarkStreakInput {
  @Field({ nullable: true})
  streakListId?: string
}