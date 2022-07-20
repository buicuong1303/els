import { FC } from 'react';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { Box, SxProps } from '@mui/system';
import { cloneDeep } from 'lodash';
import { TermButton } from '../term-button';

export interface RenderCharactersProps {
  vocabulary: GraphqlTypes.LearningTypes.Vocabulary;
  answerTerms: { id: string, value: string}[];
  isAnswered: boolean;
  removeTerm: (indexRemove: number) => void
}

export const RenderCharacters: FC<RenderCharactersProps> = (props) => {
  const { vocabulary, answerTerms, isAnswered, removeTerm } = props;

  const words = vocabulary.vocabulary.split('');
  
  const wordMaxLength = Math.max(...(words.map(item => item.length)));

  const renderFrames = (answer: any, currentCharacter: string, termButtonStyle: any,  termIndexInVocabulary: number) => {
    if (answer) {
      if (answer.value !== ' ')
        return (
          <TermButton
            key={Math.random()}
            children={answerTerms[termIndexInVocabulary].value}
            color="primary"
            sx={{
              fontWeight: 900,
              ...termButtonStyle
            }}
            onClick={() => !isAnswered ? removeTerm(termIndexInVocabulary) : undefined}
          />
        );
      return (<div style={{width: 40}}></div>);
    } else {
      if (currentCharacter !== ' ') {
        return (
          <TermButton
            key={Math.random()}
            color="primary"
            sx={{
              fontWeight: 900,
              boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25) !important',
              ...termButtonStyle
            }}
            canSelect={false}
          />
        );
      } else {
        return (<div style={{width: 40}}></div>);
      }
    }
  };
  return (
    <Box sx={{
      display: 'flex'
    }}>
      {words.map((word, wordIndex) => {
        return (
          <Box
            key={word+wordIndex}
          >
            {
              cloneDeep(word).split('').map((item, termIndex) => {
                const termButtonStyle: SxProps = 
                  wordMaxLength <= 6
                    ? {
                      m: { xs: '4px', sm: '8px' },
                      p: { xs: '0px', sm: '0px' },
                      minWidth: { xs: '51px', sm: '51px' },
                      minHeight: { xs: '51px', sm: '51px' },
                    }
                    : wordMaxLength <= 8
                      ? {
                        m: { xs: '2px', sm: '8px' },
                        p: { xs: '0px', sm: '0px' },
                        minWidth: { xs: '40px', sm: '51px' },
                        minHeight: { xs: '40px', sm: '51px' },
                      }
                      : wordMaxLength <= 10
                        ? {
                          m: { xs: '1.5px', sm: '4px', md: '8px' },
                          p: { xs: '0px', sm: '0px', md: '0px' },
                          minWidth: { xs: '32px', sm: '48px', md: '51px' },
                          minHeight: { xs: '32px', sm: '48px', md: '51px' },
                        }
                        : wordMaxLength <= 12
                          ? {
                            m: { xs: '0.8px', sm: '2px', md: '8px' },
                            p: { xs: '0px', sm: '0px', md: '0px' },
                            minWidth: { xs: '28px', sm: '43px', md: '51px' },
                            minHeight: { xs: '28px', sm: '43px', md: '51px' },
                          }
                          : {
                            m: { xs: '0.8px', sm: '1.5px', md: '8px' },
                            p: { xs: '0px', sm: '0px', md: '0px' },
                            minWidth: { xs: '24px', sm: '38px', md: '51px' },
                            minHeight: { xs: '24px', sm: '38px', md: '51px' },
                          };

                const termIndexInVocabulary =
                  (!wordIndex
                    ? 0
                    : [...new Array(wordIndex)]
                      .map((item, index) => words[index]?.length)
                      .reduce((item1, item2) => item1 + item2, 0)
                  ) + termIndex;
                  
                return renderFrames(answerTerms[termIndexInVocabulary], item, termButtonStyle, termIndexInVocabulary);
               
              })
            }
          </Box>
        );
      })}
    </Box>
  );
};

export default RenderCharacters;
