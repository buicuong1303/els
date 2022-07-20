import {
  createUnionType,
} from '@nestjs/graphql';
import { Phrase } from './phrase.entity';
import { Word } from './word.entity';
//* union
export const ReferenceUnion = createUnionType({
  name: 'ReferenceUnion',
  types: () => [Phrase, Word],
  resolveType(value) {
    if (value.type === 'phrase') {
      return Phrase;
    }
    if (value.type === 'word') {
      return Word;
    }
    return null;
  },
});