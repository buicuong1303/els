import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class SyncThumbnailTopicInput {
  @Field(() => String, { nullable: true })
  topicId?: string;
}
