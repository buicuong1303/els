import { InputType, Field } from '@nestjs/graphql';
import { ScheduleNotificationType } from '@els/server/shared';
@InputType()
export class CreateNotificationScheduleInput {
  @Field()
  name!: string;

  @Field()
  title!: string;

  @Field()
  body!: string;


  @Field()
  scheduleAt!: string;

  @Field({ nullable: true })
  redirectUrl?: string;

  @Field(() => Boolean, { defaultValue: false })
  persistent!: boolean;

  @Field(() => ScheduleNotificationType)
  type!: ScheduleNotificationType;
}
