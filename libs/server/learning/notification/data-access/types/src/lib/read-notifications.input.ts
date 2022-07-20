import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class ReadNotificationInput {
  @Field(() => [String], { nullable: true })
  ids?: string[];
}
