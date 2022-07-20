import { registerEnumType } from '@nestjs/graphql';
export enum QuestionAction {
  select = 'select',
  arrange = 'arrange',
  write = 'write',
  type = 'type',
  speak = 'speak',
  select_card = 'select_card'
}
registerEnumType(QuestionAction, {
  name: 'QuestionAction',
});
