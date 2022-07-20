/* eslint-disable @typescript-eslint/no-magic-numbers */
export const splitWordToTerm = (word: string) => {
  let terms: string[] = [];

  if (word.length <= 4 ) {
    terms = word.split('');
  } else if (word.length <= 8) {
    terms = word.match(/.{1,2}/g) ?? [];
  } else {
    terms = word.match(/.{1,3}/g) ?? [];
  }

  return terms;
};