import { Field, InputType, Int } from '@nestjs/graphql';
@InputType()
export class CreateLevelInput {
  @Field(() => Int)
  level!: number
}