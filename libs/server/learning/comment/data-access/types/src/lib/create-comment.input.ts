/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CategoryComment } from '@els/server/learning/common';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  text!: string;

  @Field()
  entityName!: string;

  @Field()
  entityId!: string;

  @Field(() => Int, { nullable: true })
  rating?: number;

  @Field(() => CategoryComment, { nullable: true })
  category?: CategoryComment;
  
}
