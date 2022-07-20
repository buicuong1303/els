import { registerEnumType } from '@nestjs/graphql';
export enum QuestionType {
  fill = 'fill',
  translate = 'translate',
  speak = 'speak',
  short_input = 'short_input'
}
registerEnumType(QuestionType, {
  name: 'QuestionType',
});
