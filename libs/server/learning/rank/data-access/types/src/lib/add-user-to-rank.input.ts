import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddUserToRank {
  @Field()
  userId!: string;

  @Field()
  rankType!: string;
}
