import React, { FC, useEffect, useState, useRef, ReactNode, Dispatch, SetStateAction } from 'react';

import { Box, Grid, Paper, Typography, useTheme, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';

import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';


import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom, QuestionIcon } from '@els/client/app/shared/ui';
import { TermButton } from '../term-button';
import { createVirtualKeyboard } from '@els/client/shared/utils';

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

const CssWriteField = styled(TextField)({
  '& label.Mui-focused': {},
  '& .MuiInput-underline:after': {},
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '2px solid #BCC4FF',
    },
    '&:hover fieldset': {
      border: '2px solid #BCC4FF',
    },
    '&.Mui-focused fieldset': {
      border: '2px solid #BCC4FF',
    },
  },
});

export interface FillWriteVideoProps {
  vocabulary: GraphqlTypes.LearningTypes.Vocabulary;
  isAnswered: boolean;
  setIsAnswered?: (e?: any) => void;
  setIsRightAnswer: (isRightAnswer: boolean) => void;
  handleScoreIncrease: () => void;
  setCorrectAnswer: (correctAnswer: ReactNode) => void;
  handleOpenResultAnnouncement: () => void;
  handleAddSkillsScore: (skillsName: Array<GraphqlTypes.LearningTypes.Skill['name']>) => void;
  handleAnswer: (answer: string) => void;
  setInFocusInput: Dispatch<SetStateAction<boolean>>;
}

export const FillWriteVideo: FC<FillWriteVideoProps> = (props) => {
  const {
    vocabulary,
    isAnswered,
    setIsAnswered,
    setIsRightAnswer,
    handleScoreIncrease,
    setCorrectAnswer,
    handleOpenResultAnnouncement,
    handleAnswer,
    setInFocusInput,
  } = props;
  
  const { t }: { t: any } = useTranslation();

  const theme = useTheme();

  const nextTestRef = useRef<any>();
  const answerInputRef = useRef<any>();
  const answerInputFocusRef = useRef<boolean>(false);
  const videoRef = useRef<any>();
  const buttonRef = useRef<any>();
  const iconRef = useRef<any>();

  const compareAnswer = (correctAnswer: string, answer: string) =>
    correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase();

  const [choicesTerms, setChoicesTerms] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string>('');

  const selectTerm = (term: string) => setAnswer(answer + term);

  const handleAnswers = (answer: string) => {
    if (setIsAnswered) setIsAnswered(true);

    const { correctAnswer } = vocabulary.questions[0];

    answerInputRef?.current?.blur();

    handleAnswer(answer);

    const isCorrectAnswer = compareAnswer(correctAnswer, answer);
    if (isCorrectAnswer) handleScoreIncrease();
    else
      setCorrectAnswer(
        <CssWriteField
          InputProps={{
            readOnly: true
          }}
          value={correctAnswer}
          sx={{
            borderRadius: '6px',
            minWidth: '220px',
            minHeight: '40px',
            '.MuiOutlinedInput-input': {
              py: theme.spacing(1.3),
            }
          }}
        />
      );

    setIsRightAnswer(isCorrectAnswer);
    handleOpenResultAnnouncement();
  };

  const handleChangeAnswer = (e: any) => setAnswer(e.target.value);

  useEffect(() => {
    setAnswer('');
    const newChoices = cloneDeep(vocabulary).vocabulary.toLocaleLowerCase().split('');

    const newChoicesTransform = createVirtualKeyboard(newChoices, 3);
    
    setChoicesTerms(
      newChoicesTransform
        .sort((term1, term2) => {
          if (term1 > term2) return 1;
          if (term1 < term2) return -1;
          return 0;
        })
    );
  }, [vocabulary]);

  useEffect(() => {
    if (answer.length >= vocabulary.vocabulary.length) handleAnswers(answer);

    document.onkeydown = (event) => {
      if (answerInputFocusRef.current) return;

      if (isAnswered) return;

      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ?!\'- ';

      if (characters.indexOf(event.key) > -1) setAnswer(answer + event.key);

      if ((event.key === 'Backspace' || event.key === 'Delete') && answer.length > 0)
        setAnswer(answer.slice(0, -1));
    };
  }, [answer]);

  useEffect(() => {
    answerInputRef.current.focus();

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
                              <CssQuestionField
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
                mb: {
                  xs: theme.spacing(2),
                  md: theme.spacing(5),
                },
                mt: {
                  xs: theme.spacing(2),
                  md: theme.spacing(0),
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  margin: 'auto',
                  mt: {
                    xs: theme.spacing(4),
                    md: theme.spacing(0),
                  }
                }}
              >
                <CssWriteField
                  inputRef={answerInputRef}
                  InputProps={{
                    readOnly: isAnswered
                  }}
                  value={answer}
                  placeholder="Write here......."
                  sx={{
                    margin: 'auto',
                    borderRadius: '6px',
                    minWidth: '220px',
                    minHeight: '40px',
                    '.MuiOutlinedInput-input': {
                      py: theme.spacing(1.3),
                    }
                  }}
                  onChange={isAnswered ? undefined : handleChangeAnswer}
                  onKeyUp={(e) => {
                    if (isAnswered) return;
                    if (e.key === 'Enter' && answer !== '') handleAnswers(answer);
                  }}
                  onFocus={() => {
                    answerInputFocusRef.current = true;
                    setInFocusInput(true);
                  }}
                  onBlur={() => {
                    answerInputFocusRef.current = false;
                    setInFocusInput(false);  
                  }}
                />
              </Box>
              <Box
                sx={{
                  maxWidth: '1000px',
                  minWidth: '200px',
                  width: '100%',
                  margin: 'auto',
                  mt: {
                    xs: theme.spacing(3),
                    md: theme.spacing(5),
                  },
                  textAlign: 'center',
                }}
              >
                { cloneDeep(choicesTerms).map((item, index) => {
                  return (
                    <TermButton
                      key={Math.random()}
                      children={
                        item.trim()
                          ? item
                          : <SpaceBarIcon
                            sx={{
                              mt: 0,
                              position: 'absolute',
                              left: '50%',
                              bottom: 0,
                              transform: 'translate(-50%, -10%)',
                            }}
                          />
                      }
                      color="primary"
                      sx={{
                        fontWeight: 900,
                        m: theme.spacing(1),
                        width: '56px',
                        height: '50px',
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

export default FillWriteVideo;
