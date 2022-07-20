import { BaseType } from '@els/server/shared';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({
  implements: () => [BaseType],
})
export class User extends BaseType {
  @Field(() => Int)
  level!: number;

  @Field(() => Int)
  exp!: number;

  @Field(() => Int)
  nextLevelExp!: number;

  @Field(() => Int)
  expDate!: number;

  @Field()
  identityId!: string;

  @Field()
  idSubscription!: string;

};
