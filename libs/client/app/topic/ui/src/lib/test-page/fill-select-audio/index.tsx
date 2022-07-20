import React, {
  FC,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';

import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';


import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';


import { useAudio } from '@els/client-shared-hooks';

import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom, QuestionIcon } from '@els/client/app/shared/ui';
import { AnswerButton } from '../answer-button';

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

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {},
  '& .MuiInput-underline:after': {},
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'unset',
    },
    '&:hover fieldset': {
      border: 'unset',
    },
    '&.Mui-focused fieldset': {
      border: 'unset',
    },
  },
});

export interface FillSelectAudioProps {
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

export const FillSelectAudio: FC<FillSelectAudioProps> = (props) => {
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
  const playAudioRef = useRef<any>();

  const { playAgain, playSpeakSlowlyAgain } = useAudio({ url: vocabulary.questions[0].prompt.audio || '' });

  const [isClicked, setIsClicked] = useState<any>({});
  const [answer, setAnswer] = useState<string>('');
  const [choices, setChoices] = useState<any[]>([]);

  const compareAnswer = (correctAnswer: string, answer: string) =>
    correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase();

  const handleAnswers = (indexChoices: number) => {
    const { correctAnswer } = vocabulary.questions[0];

    if (setIsAnswered) setIsAnswered(true);

    setAnswer(choices[indexChoices]);

    setIsClicked({ ...isClicked, [indexChoices]: true });

    handleAnswer(choices[indexChoices]);
    
    const isRightAnswer = compareAnswer(correctAnswer, choices[indexChoices]);
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
      });
    }

    setIsRightAnswer(isRightAnswer);
    handleOpenResultAnnouncement();
  };

  useEffect(() => {
    setAnswer('');
    setIsRightAnswer(false);
    setChoices(JSON.parse(vocabulary.questions[0].choices) ?? []);
  }, [vocabulary]);

  useEffect(() => {
    const newIsClicked: any = {};
    cloneDeep(choices).forEach(
      (item, index) => (newIsClicked[index] = false)
    );
    setIsClicked(newIsClicked);

    document.onkeydown = (event) => {
      if (isAnswered || event.ctrlKey || event.altKey) return;

      const options: { [key: string]: any } = {
        1: 0,
        a: 0,
        A: 0,
        2: 1,
        b: 1,
        B: 1,
        3: 2,
        c: 2,
        C: 2,
        4: 3,
        d: 3,
        D: 3,
      };

      const answer = options[event.key];

      if (answer) handleAnswers(answer);
    };
  }, [choices]);

  useEffect(() => {
    playAudioRef.current = setTimeout(() => playAgain(), 1000);

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
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h2"
            sx={{
              mx: 'auto',
              fontSize: {
                xs: '24px',
                md: '30px',
              },
              mt: theme.spacing(2),
              mb: {
                xs: theme.spacing(3),
                md: theme.spacing(8),
              },
            }}
            children={
              <Box sx={{ lineHeight: 1.5 }}>
                "
                {vocabulary.questions[0].prompt.text
                  ?.split(
                    cloneDeep(vocabulary)
                      .vocabulary.split('')
                      .map(() => '_')
                      .join('')
                  )
                  .map((item, index) => {
                    if (index === 0)
                      return (
                        <React.Fragment key={index}>
                          {item + ' '}
                          <CssTextField
                            InputProps={{
                              readOnly: true,
                            }}
                            value={answer}
                            sx={{
                              minWidth: '100px',
                              maxWidth: '200px',
                              width: 'fit-content !important',
                              background: theme.colors.alpha.black[10],
                              boxShadow:
                                'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
                              borderRadius: '6px',
                              mt: {
                                xs: '-5px',
                                md: '3px',
                              },
                              mr: '6px',
                              '.MuiInputBase-input': {
                                fontSize: '24px',
                                height: '35px',
                                p: theme.spacing(0.5, 1.5),
                                color: theme.colors.alpha.black[30],
                              },
                            }}
                          />
                        </React.Fragment>
                      );
                    else return item;
                  })}
                "
              </Box>
            }
          />
          <Box
            sx={{
              mx: 'auto',
              mb: {
                xs: theme.spacing(3),
                md: theme.spacing(8),
              },
            }}
          >
            <ButtonCustom
              color="primary"
              sx={{
                padding: theme.spacing(1),
                minWidth: '20px',
                mx: theme.spacing(1),
                p: theme.spacing(1),
              }}
              children={
                <img
                  alt=""
                  src={'/images/icon/speak-slowly.png'}
                  width="60px"
                />
              }
              onClick={() => playSpeakSlowlyAgain()}
            />
            <ButtonCustom
              color="primary"
              sx={{
                padding: theme.spacing(1),
                minWidth: '20px',
                mx: theme.spacing(1),
                p: theme.spacing(1),
              }}
              children={<VolumeUpIcon sx={{ fontSize: '60px' }} />}
              onClick={() => playAgain()}
            />
          </Box>
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
                      isAnswered ? undefined : () => handleAnswers(index)
                    }
                    rest={{ value: item }}
                    isClicked={isClicked[index]}
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
                      bgcolor: `${isClicked[index] ? theme.colors.primary.main : theme.palette.grey[300]} !important`,
                      color: isClicked[index] ? '#ffffff' : 'unset',
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

export default FillSelectAudio;
