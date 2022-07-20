import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ReplyCommentInput {
  @Field()
  text!: string;

  @Field()
  entityName!: string;

  @Field()
  entityId!: string;

  @Field({ nullable: true })
  parentId?: string;


  
}
