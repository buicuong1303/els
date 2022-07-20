import { registerEnumType } from '@nestjs/graphql';

export enum ScheduleNotificationType {
  DISCOUNT = 'discount',
  NEW_TOPIC = 'new_topic',
}

registerEnumType(ScheduleNotificationType, {
  name: 'ScheduleNotificationType',
});