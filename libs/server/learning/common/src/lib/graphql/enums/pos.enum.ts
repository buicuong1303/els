import { registerEnumType } from '@nestjs/graphql';
export enum POS {
  adj = 'adjective',
  adv = 'adverb',
  n = 'noun',
  v = 'verb',
}
registerEnumType(POS, {
  name: 'POS',
});
