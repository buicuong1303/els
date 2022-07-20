import { FC, useEffect, useState, useRef, ReactNode } from 'react';

import { Box, Paper, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';



import { v4 as uuidv4 } from 'uuid';
import { cloneDeep, shuffle } from 'lodash';
import { useTranslation } from 'react-i18next';

import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom, QuestionIcon } from '@els/client/app/shared/ui';
import { TermButton } from '../term-button';
import { splitWordToTerm } from '@els/client/shared/utils';

const BoxWrapper = styled(Box)(
  ({ theme }) => `
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

export interface TranslateArrangeProps {
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

export const TranslateArrange: FC<TranslateArrangeProps> = (props) => {
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


  const nextTestRef = useRef<any>();

  const compareAnswer = (correctAnswer: string, answer: string) =>
    correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase();

  const [choicesTerms, setChoicesTerms] = useState<{ id: string, value: string}[]>([]);
  const [choices, setChoices] = useState<any[]>([]);
  const [answerTerms, setAnswerTerms] = useState<{ id: string, value: string}[]>([]);

  const selectTerm = (term: { id: string, value: string}) =>
    setAnswerTerms([...answerTerms, term]);

  const removeTerm = (key: string) => {
    const newAnswerTerms = cloneDeep(answerTerms).filter((item) => item.id !== key);
    setAnswerTerms(newAnswerTerms);
  };

  const handleAnswers = (answerTerms: { id: string, value: string}[]) => {
    if (setIsAnswered) setIsAnswered(true);

    const { correctAnswer } = vocabulary.questions[0];

    const userAnswer = answerTerms.map(item => item.value).join(vocabulary.questions[0].sourceLang === vocabulary.questions[0].targetLang ? '' : ' ');
    handleAnswer(userAnswer);
    
    const isCorrectAnswer = compareAnswer(correctAnswer, userAnswer);
    if (isCorrectAnswer) handleScoreIncrease();
    else
      setCorrectAnswer(
        <Box sx={{ ml: theme.spacing(-1) }}>
          {cloneDeep(splitWordToTerm(vocabulary.vocabulary)).map((item, index) => {
            return <TermButton
              key={Math.random()}
              children={item}
              color="primary"
              sx={{
                fontWeight: 900,
                m: theme.spacing(1),
              }}
            />;
          })}
        </Box>
      );

    setIsRightAnswer(isCorrectAnswer);
    handleOpenResultAnnouncement();
  };

  useEffect(() => {
    setAnswerTerms([]);

    setChoices(shuffle(splitWordToTerm(vocabulary.vocabulary)));
  }, [vocabulary]);

  useEffect(() => {
    setChoicesTerms(choices.map(item => {
      return { id: uuidv4(), value: item };
    }));
  }, [choices]);

  useEffect(() => {
    if (!!answerTerms.length && answerTerms.length >= choicesTerms.length)
      handleAnswers(answerTerms);
  }, [answerTerms]);

  useEffect(() => {
    return () => {
      if (nextTestRef.current) clearTimeout(nextTestRef.current);
    };
  }, []);
  
  useEffect(() => {
    document.onkeydown = (event) => {
      if (isAnswered) return;
    };
  }, [isAnswered]);

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
        <Typography variant="h4" children={vocabulary.questions[0].sourceLang === vocabulary.questions[0].targetLang ? t('Rearrange the word') : t('Rearrange sentences')} sx={{ fontSize: '20px' }} />
      </BoxSession>
      
      {/* answers */}
      <Paper
        elevation={1}
        variant="elevation"
        sx={{
          position: 'relative',
          px: {
            xs: theme.spacing(2),
            md: theme.spacing(8),
            lg: theme.spacing(12),
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
            children={
              vocabulary.questions[0].sourceLang === vocabulary.questions[0].targetLang
                ? vocabulary.translation
                : vocabulary.questions[0].prompt.text
            }
          />
        </Box>
        <Box sx={{ marginX: 'auto' }}>
          <Typography
            variant="body1"
            sx={{
              mt: theme.spacing(5),
              fontSize: '24px',
              color: theme.colors.alpha.black[30],
              minHeight: '44px',
              display: 'flex',
              alignItems: 'end',
            }}
            children={answerTerms.map(item => item.value).join(vocabulary.questions[0].sourceLang === vocabulary.questions[0].targetLang ? '' : ' ')}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(127, 141, 168, 0.1)',
            border: '1px dashed rgba(34, 51, 84, 0.5)',
            borderRadius: '6px',
            p: theme.spacing(0.5, 3),
            width: 'fit-content',
            minWidth: '300px',
            minHeight: '76px',
            marginX: 'auto',
            mt: theme.spacing(0),
            textAlign: 'center',
            // display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
          }}
        >
          { cloneDeep(answerTerms).map((item) => {
            return (
              <TermButton
                key={Math.random()}
                children={item.value}
                color="primary"
                sx={{
                  fontWeight: 900,
                  m: theme.spacing(1),
                }}
                onClick={() => !isAnswered ? removeTerm(item.id) : null}
              />
            );
          })
          }
        </Box>
        <Box
          sx={{
            p: theme.spacing(1, 3),
            maxWidth: '400px',
            minWidth: '200px',
            width: '100%',
            margin: 'auto',
            mt: theme.spacing(6),
            textAlign: 'center',
          }}
        >
          { cloneDeep(choicesTerms).map(item => {
            const canSelect = cloneDeep(answerTerms).findIndex((answerTerm: any) => answerTerm.id === item.id) === -1;

            return (
              <TermButton
                key={Math.random()}
                children={item.value}
                color="primary"
                sx={{
                  fontWeight: 900,
                  m: theme.spacing(1),
                }}
                onClick={() => (canSelect && !isAnswered) ? selectTerm(item) : undefined}
                canSelect={canSelect}
              />
            );
          })
          }
        </Box>
      </Paper>
    </BoxWrapper>
  );
};

export default TranslateArrange;
