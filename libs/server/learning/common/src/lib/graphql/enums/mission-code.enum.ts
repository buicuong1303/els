import { registerEnumType } from '@nestjs/graphql';

export enum MissionCode {
  check_in = 'check_in',
  review_forgot = 'review_forgot',
  review_vague = 'review_vague',
  learn_new = 'learn_new',
  complete_1_topic = 'complete_1_topic',
  complete_2_topics = 'complete_2_topics',
  obtain_level_10 = 'obtain_level_10',
  top_1 = 'top_1',
  invite_5_persons = 'invite_5_persons',
  streaks_3 = 'streaks_3',
  streaks_5 = 'streaks_5',
};
registerEnumType(MissionCode, {
  name: 'MissionCode',
});