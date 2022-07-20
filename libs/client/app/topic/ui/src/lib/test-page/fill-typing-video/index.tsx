import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { Box, Grid, Paper, TextField, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { SxProps } from '@mui/system';

import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';


import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom, QuestionIcon } from '@els/client/app/shared/ui';
import { createVirtualKeyboard } from '@els/client/shared/utils';
import RenderCharacters from '../render-characters';
import { TermButton } from '../term-button';

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

const CssQuestionField = styled(TextField)({
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

export interface FillTypeVideoProps {
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

export const FillTypeVideo: FC<FillTypeVideoProps> = (props) => {
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
  const videoRef = useRef<any>();
  const buttonRef = useRef<any>();
  const iconRef = useRef<any>();

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
    
    if (setIsAnswered) setIsAnswered(true);

    const userAnswer = answer.map((item) => item.value).join('');
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

    setIsRightAnswer(isCorrectAnswer);
    handleOpenResultAnnouncement();
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
                    // md: theme.spacing(6),
                  },
                  px: theme.spacing(2),
                }}
                children={
                  <Box sx={{ lineHeight: 1.5 }}>
                    "
                    {
                      vocabulary.questions[0].prompt.text?.split(cloneDeep(vocabulary).vocabulary.split('').map(() => '_').join(''))
                        .map((item, index) => {
                          if (index === 0) return (
                            <React.Fragment key={index}>
                              {item + ' '}
                              <CssQuestionField
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={cloneDeep(answerTerms).map(item => item.value).join('')}
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
            <Grid item xs={12} sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
              sx={{
                mt: {
                  xs: theme.spacing(2),
                  md: theme.spacing(0),
                },
                margin: 'auto'
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  mt: {
                    xs: theme.spacing(4),
                    md: theme.spacing(0),
                  }
                }}
              >
                <RenderCharacters
                  vocabulary={vocabulary}
                  answerTerms={cloneDeep(answerTerms).filter(item => item.value !== ' ')}
                  isAnswered={isAnswered}
                  removeTerm={removeTerm}
                />
              </Box>
              <Box
                sx={{
                  maxWidth: '1000px',
                  minWidth: '200px',
                  width: '100%',
                  margin: 'auto',
                  mt: {
                    xs: theme.spacing(6),
                    md: theme.spacing(5),
                  },
                  textAlign: 'center',
                }}
              >
                { cloneDeep(choicesTerms)
                  .filter(item => item.value.trim())
                  .map((item) => {
                    return (
                      <TermButton
                        key={Math.random()}
                        children={item.value}
                        color="primary"
                        sx={{
                          fontWeight: 900,
                          m: theme.spacing(1),
                        }}
                        onClick={() => !isAnswered ? selectTerm(item) : undefined}
                      />
                    );
                  })
                }
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </BoxWrapper>
  );
};

export default FillTypeVideo;
