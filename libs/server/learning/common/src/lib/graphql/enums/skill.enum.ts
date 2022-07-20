import { registerEnumType } from '@nestjs/graphql';
export enum LearningSkill {
  reading = 'reading',
  speaking = 'speaking',
  writing = 'writing',
  listening = 'listening',
}
registerEnumType(LearningSkill, {
  name: 'LearningSkill',
});
