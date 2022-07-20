import { FC, useEffect, useState, useRef, ReactNode } from 'react';

import { SxProps } from '@mui/system';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { createVirtualKeyboard } from '@els/client/shared/utils';

import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom, QuestionIcon } from '@els/client/app/shared/ui';
import { TermButton } from '../term-button';
import RenderCharacters from '../render-characters';

const BoxWrapper = styled(Box)(
  () => `
    display: flex;
    flex-direction: column;
    width: 100%;
  `
);

const BoxSession = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(2)};
    display: flex;
    align-items: center;
    justify-content: center;
  `
);


export interface TranslateWriteProps {
  vocabulary: GraphqlTypes.LearningTypes.Vocabulary;
  isAnswered: boolean;
  setIsAnswered?: (e?: any) => void;
  setIsRightAnswer: (isRightAnswer: boolean) => void;
  handleScoreIncrease: () => void;
  setCorrectAnswer: (correctAnswer: ReactNode) => void;
  handleOpenResultAnnouncement: () => void;
  handleAddSkillsScore: (skillsName: Array<GraphqlTypes.LearningTypes.Skill['name']>) => void;
  handleAnswer: (answer: string) => void;
}

export const TranslateWrite: FC<TranslateWriteProps> = (props) => {
  const {
    vocabulary,
    isAnswered,
    setIsAnswered,
    setIsRightAnswer,
    handleScoreIncrease,
    setCorrectAnswer,
    handleOpenResultAnnouncement,
    handleAnswer,
  } = props;
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const vocabularyLengthRef = useRef<number>(0);
  const nextTestRef = useRef<any>();
  const compareAnswer = (correctAnswer: string, answer: string) =>
    correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase();

  const [choicesTerms, setChoicesTerms] = useState<{ id: string, value: string}[]>([]);
  const [answerTerms, setAnswerTerms] = useState<{ id: string, value: string}[]>([]);
  const selectTerm = (term: { id: string, value: string}) => setAnswerTerms([...answerTerms, term]);
  const removeTerm = (indexRemove: number) => {
    const newAnswerTerms = cloneDeep(answerTerms).filter((item, index) => index !== indexRemove);
    setAnswerTerms(newAnswerTerms);
  };
  const handleAnswers = (answer: { id: string, value: string}[]) => {
    const { correctAnswer } = vocabulary.questions[0];

    const userAnswer = answer.map(item => item.value).join('');
    handleAnswer(userAnswer);
    
    const isCorrectAnswer = compareAnswer(correctAnswer, userAnswer);
    if (isCorrectAnswer) handleScoreIncrease();
    else
      setCorrectAnswer(
        <Box>
          { cloneDeep(correctAnswer).split('').map((item) => {
            const termButtonStyle: SxProps = 
              vocabularyLengthRef.current <= 6
                ? {
                  m: { xs: '4px', sm: '8px' },
                  p: { xs: '0px', sm: '0px' },
                  minWidth: { xs: '51px', sm: '51px' },
                  minHeight: { xs: '51px', sm: '51px' },
                }
                : vocabularyLengthRef.current <= 8
                  ? {
                    m: { xs: '2px', sm: '6px' },
                    p: { xs: '0px', sm: '0px' },
                    minWidth: { xs: '40px', sm: '51px' },
                    minHeight: { xs: '40px', sm: '51px' },
                  }
                  : vocabularyLengthRef.current <= 10
                    ? {
                      m: { xs: '1.5px', sm: '4px', md: '6px' },
                      p: { xs: '0px', sm: '0px', md: '0px' },
                      minWidth: { xs: '32px', sm: '48px', md: '51px' },
                      minHeight: { xs: '32px', sm: '48px', md: '51px' },
                    }
                    : vocabularyLengthRef.current <= 12
                      ? {
                        m: { xs: '0.8px', sm: '2px', md: '3px' },
                        p: { xs: '0px', sm: '0px', md: '0px' },
                        minWidth: { xs: '28px', sm: '43px', md: '40px' },
                        minHeight: { xs: '28px', sm: '43px', md: '40px' },
                      }
                      : {
                        m: { xs: '0.8px', sm: '1.5px', md: '3px' },
                        p: { xs: '0px', sm: '0px', md: '0px' },
                        minWidth: { xs: '24px', sm: '38px', md: '40px' },
                        minHeight: { xs: '24px', sm: '38px', md: '40px' },
                      };

            return (
              <TermButton
                key={Math.random()}
                children={item}
                color="primary"
                sx={{
                  fontWeight: 900,
                  visibility: item === ' ' ? 'hidden' : 'visible',
                  ...termButtonStyle,
                }}
              />
            );
          })}
        </Box>
      );

    handleOpenResultAnnouncement();
    setIsRightAnswer(isCorrectAnswer);
    if (setIsAnswered) setIsAnswered(true);

  };

  useEffect(() => {
    setAnswerTerms([]);
    const newChoices = cloneDeep(vocabulary).vocabulary.toLocaleLowerCase().split('');
    const newChoicesTransform = createVirtualKeyboard(newChoices, 3);
    
    setChoicesTerms(
      newChoicesTransform
        .sort((term1, term2) => {
          if (term1 > term2) return 1;
          if (term1 < term2) return -1;
          return 0;
        })
        .map(item => {
          return { id: uuidv4(), value: item };
        })
    );

    vocabularyLengthRef.current = vocabulary.vocabulary.length;
  }, [vocabulary]);

  useEffect(() => {
    if (answerTerms.length >= vocabulary.questions[0].correctAnswer.length)
      handleAnswers(answerTerms);

    document.onkeydown = (event) => {
      if (isAnswered) return;

      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ?!\'-';

      if (characters.indexOf(event.key) > -1) {
        const newAnswerTerms = cloneDeep(answerTerms);

        newAnswerTerms.push({ id: uuidv4(), value: event.key });

        if (vocabulary.questions[0].correctAnswer[answerTerms.length + 1] === ' ')
          newAnswerTerms.push({ id: uuidv4(), value: ' ' });

        setAnswerTerms(newAnswerTerms);
      }

      if ((event.key === 'Backspace' || event.key === 'Delete') && answerTerms.length > 0)
        removeTerm(answerTerms.length - 1);
    };
  }, [answerTerms]);
  useEffect(() => {
    document.onkeydown = (event) => {
      if (isAnswered) return;
    };
  }, [isAnswered]);
  useEffect(() => {
    return () => {
      document.onkeydown = null;
      if (nextTestRef.current) clearTimeout(nextTestRef.current);
    };
  }, []);

  return (
    <BoxWrapper>
      {/* question */}
      <BoxSession sx={{ p: 0, mb: theme.spacing(4), display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <ButtonCustom
          startIcon={<QuestionIcon />}
          color="warning"
          variant="contained"
          sx={{
            backgroundColor: '#ffffff !important',
            cursor: 'unset',
            borderRadius: '50%',
            mr: theme.spacing(1),
            p: 0,
            minWidth: 'unset',
            '.MuiButton-startIcon': {
              color: theme.colors.warning.main
            },
          }}
        />
        <Typography variant="h4" children={t('Insert your answer in the blank')} sx={{ fontSize: '20px' }} />
      </BoxSession>
      
      {/* answers */}
      <Paper
        elevation={1}
        variant="elevation"
        sx={{
          position: 'relative',
          px: {
            xs: theme.spacing(0),
            // md: theme.spacing(8),
            // lg: theme.spacing(12),
          },
          py: {
            xs: theme.spacing(3),
            md: theme.spacing(6),
          },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '560px'
        }}
      >
        <Box sx={{ marginX: 'auto' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: {
                xs: '40px',
                sm: '50px',
                md: '64px',
              },
              fontWeight: 700,
              lineHeight: 1,
              mt: theme.spacing(2),
            }}
            children={vocabulary.translation}
          />
        </Box>
        <Box sx={{ marginX: 'auto' }}>
          <Typography
            variant="body1"
            sx={{
              mt: {
                xs: theme.spacing(3),
                md: theme.spacing(5),
              },
              fontSize: '24px',
              color: theme.colors.alpha.black[30],
              minHeight: '44px',
              display: 'flex',
              alignItems: 'end',
            }}
            children={cloneDeep(answerTerms).map(item => item.value).join('')}
          />
        </Box>
        <Box
          sx={{
            marginX: 'auto',
            mt: theme.spacing(0),
            textAlign: 'center',
          }}
        >
          <RenderCharacters
            vocabulary={vocabulary}
            answerTerms={cloneDeep(answerTerms)}
            isAnswered={isAnswered}
            removeTerm={removeTerm}
          />
        </Box>
        <Box
          sx={{
            p: theme.spacing(1, 0),
            maxWidth: '1000px',
            minWidth: '200px',
            width: '100%',
            margin: 'auto',
            textAlign: 'center',
            mt: {
              xs: theme.spacing(6),
              md: theme.spacing(9),
            },
          }}
        >
          { cloneDeep(choicesTerms)
            .map((item) => {
              return (
                <TermButton
                  key={Math.random()}
                  children={
                    item.value.trim()
                      ? item.value
                      : <SpaceBarIcon
                        sx={{
                          
                          mt: 0,
                          position: 'absolute',
                          left: '50%',
                          bottom: 0,
                          transform: 'translate(-50%, -40%)',
                        }}
                      />
                  }
                  color="primary"
                  sx={{
                    fontWeight: 900,
                    // m: theme.spacing(1),
                    m: { xs: '4px', sm: '8px' },
                    p: { xs: '0px', sm: '0px' },
                    minWidth: { xs: '51px', sm: '51px' },
                    minHeight: { xs: '51px', sm: '51px' },
                  }}
                  onClick={() => !isAnswered ? selectTerm(item) : undefined}
                />
              );
            })
          }
        </Box>
      </Paper>
    </BoxWrapper>
  );
};

export default TranslateWrite;

