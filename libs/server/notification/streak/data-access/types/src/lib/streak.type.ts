import { BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  implements: () => [BaseType],
})
export class Streak {
  @Field({nullable: true})
  triggerString!: string;
};
