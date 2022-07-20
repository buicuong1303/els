import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { Box, Grid, Paper, TextField, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom, QuestionIcon } from '@els/client/app/shared/ui';
import { AnswerButton } from '../answer-button';

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

export interface FillSelectVideoProps {
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

export const FillSelectVideo: FC<FillSelectVideoProps> = (props) => {
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
  const videoRef = useRef<any>();
  const buttonRef = useRef<any>();
  const iconRef = useRef<any>();

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
                  md: '300px'
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
    cloneDeep(choices).forEach((item, index) => (newIsClicked[index] = false));
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
    return () => {
      document.onkeydown = null;
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
        <Typography variant="h4" children={t('Choose the answer')} sx={{ fontSize: '20px' }} />
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
        <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Grid container spacing={2} alignItems="start">
            <Grid item xs={12} sx={{ marginX: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: {
                    xs: '24px',
                    md: '30px',
                  },
                  mt: theme.spacing(2),
                  mb: {
                    xs: theme.spacing(3),
                    md: theme.spacing(6),
                  }
                }}
                children={
                  <Box sx={{ lineHeight: 1.5 }}>
                    "
                    {
                      vocabulary.questions[0].prompt.text?.split(cloneDeep(vocabulary).vocabulary.split('').map(item => '_').join(''))
                        .map((item, index) => {
                          if (index === 0) return (
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
                                  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
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
                                    color: theme.colors.alpha.black[30]
                                  }
                                }}
                              />
                            </React.Fragment>
                          );
                          else return item;
                        })
                    }
                    "
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <video
                ref={videoRef} id={vocabulary.id} key={vocabulary.id}
                height="270" width="270" style={{ borderRadius: '6px' }}
                autoPlay={false} loop={false} muted={false} data-reactid=".0.1.0.0"
                onEnded={() => {
                  buttonRef.current.style.opacity = 1;
                  iconRef.current.style.fontSize = '60px';
                }}
              >
                <source type="video/mp4" data-reactid=".0.1.0.0.0" src={vocabulary.questions[0].prompt.video?.toString()} />
              </video>
              <ButtonCustom
                rest={{
                  ref: buttonRef
                }}
                children={
                  <PlayCircleFilledWhiteIcon
                    ref={iconRef}
                    sx={{
                      fontSize: '60px',
                      transition: 'fontSize 2s',
                      backgroundColor: '#ffffff',
                      borderRadius: '50%',
                      '> path': {
                        fill: 'rgba(0, 0, 0, 0.4)',
                        d: 'path("M 24 0 C 0 0 0 0 0 24 s 0 24 31 24 s 0 0 24 -29 S 0 0 0 4 Z m -4 26 V 15 l 12 9 l -12 9 Z")'
                      },
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  />
                }
                sx={{
                  position: 'absolute',
                  top: `calc(50% + ${theme.spacing(1)})`,
                  left: `calc(50% + ${theme.spacing(1)})`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'opacity 0.5s',
                  backgroundColor: 'unset !important',
                }}
                onClick={() => {
                  videoRef.current.play();
                  buttonRef.current.style.opacity = 0;
                  iconRef.current.style.fontSize = '150px';
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                mb: {
                  xs: theme.spacing(2),
                  md: theme.spacing(0),
                },
                mt: {
                  xs: theme.spacing(2),
                  md: theme.spacing(0),
                },
              }}
            >
              {choices.map((item, index) => {
                const choice =
                  index === 0
                    ? 'A'
                    : index === 1
                      ? 'B'
                      : index === 2
                        ? 'C'
                        : 'D';

                return (
                  <AnswerButton
                    key={item+index}
                    onClick={isAnswered ? undefined : () => handleAnswers(index)}
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
                      mt: theme.spacing(index !== 0 ? 2 : 0),
                      bgcolor: `${isClicked[index] ? theme.colors.primary.main : theme.palette.grey[300]} !important`,
                      color: isClicked[index] ? '#ffffff' : 'unset',
                      cursor: isAnswered ? 'inherit' : 'pointer',
                      width: '100%',
                      maxWidth: '350px',
                      ':hover': {
                        bgcolor: `${theme.colors.primary.main} !important`,
                        color: '#ffffff !important',
                      }
                    }}
                  />
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </BoxWrapper>
  );
};

export default FillSelectVideo;
