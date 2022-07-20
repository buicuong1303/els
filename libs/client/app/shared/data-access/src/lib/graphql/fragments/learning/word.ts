import { gql } from '@apollo/client';

export const WordRelations = gql`
  fragment WordRelations on Word {
    id
    text
    meanings {
      pos {
        id
        name
      }
      definitions {
        id
        explanation
        translates(target: $target) {
          id
          text
          meanings {
            pos {
              id
              name
            }
            definitions {
              id
              explanation
              translates(target: $translatesTarget) {
                id
                text
              }
            }
          }
        }
        synonyms(source: $source) {
          id
          text
        }
        detail {
          id
          antonyms
        }
        examples {
          id
          sentence
          exampleTranslations {
            id
            text
          }
        }
      }
    }
  }
`;

export const PhraseRelations = gql`
  fragment PhraseRelations on Phrase {
    id
    text
    explanation
    lang
    phraseTranslations {
      id
      text
      lang
    }
    examples {
      id
      sentence
      exampleTranslations {
        id
        text
      }
    }
  }
`;