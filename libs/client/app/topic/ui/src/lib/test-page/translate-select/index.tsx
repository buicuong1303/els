import { FC, useEffect, useState, useRef, ReactNode } from 'react';

import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';


import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useAudio } from '@els/client-shared-hooks';

import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { AnswerButton } from '../answer-button';
import { ButtonCustom, QuestionIcon } from '@els/client/app/shared/ui';

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

export interface TranslateSelectProps {
  vocabulary: GraphqlTypes.LearningTypes.Vocabulary;
  isAnswered: boolean;
  setIsAnswered?: (e?: any) => void;
  setIsRightAnswer: (isRightAnswer: boolean) => void;
  handleScoreIncrease: () => void;
  setCorrectAnswer: (correctAnswer: ReactNode) => void;
  handleOpenResultAnnouncement: () => void;
  handleAddSkillsScore: (skillsName: Array<GraphqlTypes.LearningTypes.Skill['name']>) => void;
  handleAnswer: (answer: string) => void;
  autoPlayAudio: boolean;
}

export const TranslateSelect: FC<TranslateSelectProps> = (props) => {
  const {
    vocabulary,
    isAnswered,
    setIsAnswered,
    setIsRightAnswer,
    handleScoreIncrease,
    setCorrectAnswer,
    handleOpenResultAnnouncement,
    handleAnswer,
    autoPlayAudio,
  } = props;

  const { t }: { t: any } = useTranslation();

  const theme = useTheme();

  const nextTestRef = useRef<any>();
  const playAudioRef = useRef<any>();

  const { playAgain } = useAudio({ url: vocabulary.questions[0].prompt.audio || vocabulary.audio || '' });

  const [isClicked, setIsClicked] = useState<any>({});
  const [choices, setChoices] = useState<any[]>([]);

  const compareAnswer = (correctAnswer: string, answer: string) =>
    correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase();

  const handleAnswers = (key: string) => {
    const { correctAnswer } = vocabulary.questions[0];

    if (setIsAnswered) setIsAnswered(true);

    setIsClicked({ ...isClicked, [key]: true });

    const userAnswer = choices[choices.findIndex((item, index) => item + index === key)];
    handleAnswer(userAnswer);

    const isRightAnswer = compareAnswer(correctAnswer, userAnswer);
    if (isRightAnswer) handleScoreIncrease();
    else {
      cloneDeep(choices).forEach((item, index) => {
        const choice =
          index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : 'D';

        const isRightAnswer = compareAnswer(correctAnswer, item);
        if (isRightAnswer) {
          setCorrectAnswer(
            <AnswerButton
              rest={{ value: item }}
              children={
                <Box display="flex" alignItems="start">
                  <Typography
                    sx={{ fontSize: '20px' }}
                    variant="h4"
                    color="unset"
                    children={`${choice}.`}
                  />
                  &nbsp;
                  <Typography
                    sx={{ flex: 1, fontSize: '20px' }}
                    variant="h4"
                    color="unset"
                    children={item}
                  />
                </Box>
              }
              color="primary"
              variant="contained"
              sx={{
                textAlign: 'left',
                width: '100%',
                maxWidth: '350px',
                minWidth: {
                  xs: '200px',
                  md: '300px',
                },
                cursor: 'default',
                backgroundColor: `${theme.colors.primary.main} !important`,
              }}
            />
          );
        }

        return item;
      });
    }

    setIsRightAnswer(isRightAnswer);
    handleOpenResultAnnouncement();
  };

  useEffect(() => {
    setIsRightAnswer(false);
    setChoices(JSON.parse(vocabulary.questions[0].choices) ?? []);
  }, [vocabulary]);

  useEffect(() => {
    const newIsClicked: any = {};
    cloneDeep(choices).forEach(
      (item, index) => (newIsClicked[item + index] = false)
    );
    setIsClicked(newIsClicked);

    document.onkeydown = (event) => {
      if (isAnswered || event.ctrlKey || event.altKey) return;

      const options: { [key: string]: any } = {
        1: choices[0] + 0,
        a: choices[0] + 0,
        A: choices[0] + 0,
        2: choices[1] + 1,
        b: choices[1] + 1,
        B: choices[1] + 1,
        3: choices[2] + 2,
        c: choices[2] + 2,
        C: choices[2] + 2,
        4: choices[3] + 3,
        d: choices[3] + 3,
        D: choices[3] + 3,
      };

      const answer = options[event.key];

      if (answer) handleAnswers(answer);
    };
  }, [choices]);

  useEffect(() => {
    if (autoPlayAudio && vocabulary.questions[0].sourceLang === 'en') {
      playAudioRef.current = setTimeout(() => playAgain(), 1000);
    }

    return () => {
      document.onkeydown = null;
      if (nextTestRef.current) clearTimeout(nextTestRef.current);
      if (playAudioRef.current) clearTimeout(playAudioRef.current);
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
      <BoxSession
        sx={{
          p: 0,
          mb: theme.spacing(4),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
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
              color: theme.colors.warning.main,
            },
          }}
        />
        <Typography
          variant="h4"
          children={t('Choose the answer')}
          sx={{ fontSize: '20px' }}
        />
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
          minHeight: '560px',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Grid container spacing={2} alignItems="start">
            <Grid
              item
              xs={12}
              md={vocabulary.questions[0].prompt.image ? 6 : undefined}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                alt=""
                src={vocabulary.questions[0].prompt.image?.toString()}
                width={'100%'}
                style={{ maxWidth: '350px' }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={vocabulary.questions[0].prompt.image ? 6 : 12}
              sx={{
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
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
                  mt: {
                    xs: theme.spacing(4),
                    md: theme.spacing(2),
                  },
                }}
                children={
                  <Box
                    sx={{
                      position: 'relative',
                      mr: 0,
                      width: 'fit-content',
                      display: 'flex',
                    }}
                  >
                    {vocabulary.questions[0].sourceLang === 'en' && (
                      <ButtonCustom
                        color="primary"
                        children={<VolumeUpIcon sx={{ fontSize: '50px' }} />}
                        sx={{ padding: 1, mr: 1.5, minWidth: '20px' }}
                        onClick={playAgain}
                      />
                    )}
                    <Box>
                      {vocabulary.questions[0].sourceLang === 'en'
                        ? vocabulary.vocabulary
                        : vocabulary.translation}
                    </Box>
                    {vocabulary.questions[0].sourceLang === 'en' && (
                      <Typography
                        variant="subtitle1"
                        children={vocabulary.pos}
                        sx={{
                          fontSize: '36px',
                          fontWeight: 400,
                          color: theme.colors.common.grey,
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          transform: 'translate(50%, -70%)',
                          // bottom: { xs: '40px', sm: '48px', md: '56px' },
                          height: 'fit-content',
                          lineHeight: 1,
                        }}
                      />
                    )}
                  </Box>
                }
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {vocabulary.questions[0].sourceLang === 'en' && (
                  <Typography
                    variant="subtitle1"
                    children={vocabulary.phonetic}
                    sx={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: theme.colors.alpha.black[50],
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            flex: 1,
            mt: {
              sm: theme.spacing(4),
              md: theme.spacing(7),
            },
          }}
        >
          <Grid container spacing={{ xs: 2, md: 4 }} alignItems="start">
            {choices.map((item, index) => {
              const choice =
                index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : 'D';

              return (
                <Grid
                  key={item + index}
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AnswerButton
                    onClick={
                      isAnswered ? undefined : () => handleAnswers(item + index)
                    }
                    rest={{ value: item }}
                    isClicked={isClicked[item + index]}
                    children={
                      <Box display="flex" alignItems="start">
                        <Typography
                          sx={{ fontSize: '20px' }}
                          variant="h4"
                          color="unset"
                          children={`${choice}.`}
                        />
                        &nbsp;
                        <Typography
                          sx={{ flex: 1, fontSize: '20px' }}
                          variant="h4"
                          color="unset"
                          children={item}
                        />
                      </Box>
                    }
                    color="primary"
                    variant="text"
                    sx={{
                      textAlign: 'left',
                      bgcolor: `${isClicked[item + index] ? theme.colors.primary.main : theme.palette.grey[300]} !important`,
                      color: isClicked[item + index] ? '#ffffff' : 'unset',
                      cursor: isAnswered ? 'inherit' : 'pointer',
                      width: '100%',
                      maxWidth: '350px',
                      ':hover': {
                        bgcolor: `${theme.colors.primary.main} !important`,
                        color: '#ffffff !important',
                      },
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>
    </BoxWrapper>
  );
};

export default TranslateSelect;
