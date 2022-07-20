import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ReactCommentInput {
  @Field()
  emoji!: string;

  @Field()
  commentId!: string;
}
