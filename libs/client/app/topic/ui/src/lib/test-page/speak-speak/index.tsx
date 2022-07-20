import { FC, useEffect, useState, useRef, ReactNode } from 'react';

import { Box, Paper, Typography, useTheme, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';


import { useAudio } from '@els/client-shared-hooks';

import { useTranslation } from 'react-i18next';

import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom, QuestionIcon, VoiceRecording } from '@els/client/app/shared/ui';

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

export interface SpeakSpeakProps {
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

export const SpeakSpeak: FC<SpeakSpeakProps> = (props) => {
  const {
    vocabulary,
    isAnswered,
    setIsAnswered,
    setIsRightAnswer,
    handleScoreIncrease,
    handleOpenResultAnnouncement,
    handleAnswer,
  } = props;

  const { t }: { t: any } = useTranslation();

  const theme = useTheme();

  const nextTestRef = useRef<any>();
  const playAudioRef = useRef<any>();

  const { playAgain } = useAudio({ url: vocabulary.questions[0].prompt.audio || '' });

  const [textRecording, setTextRecording] = useState<string>('');

  const compareAnswer = (correctAnswer: string, answer: string) =>
    correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase();

  const handleAnswers = (textRecording: string) => {
    const { correctAnswer } = vocabulary.questions[0];

    setTextRecording(textRecording);

    handleAnswer(textRecording);

    const isRightAnswer = compareAnswer(correctAnswer, textRecording);
    if (isRightAnswer) {
      if (setIsAnswered) setIsAnswered(true);

      handleScoreIncrease();

      setIsRightAnswer(isRightAnswer);
      handleOpenResultAnnouncement();
    }
  };

  useEffect(() => {
    setIsRightAnswer(false);
    setTextRecording('');
  }, [vocabulary]);

  useEffect(() => {
    playAudioRef.current = setTimeout(() => playAgain(), 1000);

    return () => {
      if (nextTestRef.current) clearTimeout(nextTestRef.current);
      if (playAudioRef.current) clearTimeout(playAudioRef.current);
    };
  }, []);

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
          children={t('Pronounce the word')}
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              mx: 'auto',
              mt: {
                xs: theme.spacing(8),
                md: theme.spacing(16),
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
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
              }}
              children={
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <ButtonCustom
                    color="primary"
                    children={<VolumeUpIcon sx={{ fontSize: { xs: '40px', md: '50px' } }} />}
                    sx={{ padding: theme.spacing(0.5), minWidth: '20px', mr: '22px' }}
                    onClick={playAgain}
                  />
                  {vocabulary.questions[0].correctAnswer}
                  <Typography
                    variant="subtitle1"
                    children={vocabulary.pos}
                    sx={{
                      fontSize: '36px',
                      fontWeight: 400,
                      color: theme.colors.common.grey,
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      lineHeight: 1,
                      transform: { xs: 'translate(0%, -100%)', md: 'translate(50%, -100%)' }
                    }}
                  />
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
              <Typography
                variant="subtitle1"
                children={vocabulary.phonetic}
                sx={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: theme.colors.alpha.black[50],
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              mx: 'auto',
              mt: {
                xs: theme.spacing(6),
                md: theme.spacing(8),
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Tooltip
              arrow
              placement="top"
              title={
                isAnswered
                  ? t('You have completed this question')
                  : t('Press and hold to speak, release to complete')
              }
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VoiceRecording
                  setVoiceRecording={setTextRecording}
                  handleAnswers={handleAnswers}
                  isClicked={isAnswered}
                  lang="en-US"
                />
              </Box>
            </Tooltip>
            <Typography
              variant="subtitle1"
              children={textRecording}
              sx={{
                fontSize: '20px',
                fontWeight: 900,
                color:
                  textRecording.toLowerCase() === vocabulary.questions[0].correctAnswer?.toLowerCase()
                    ? theme.colors.success.main
                    : theme.colors.error.main,
              }}
            />
          </Box>
        </Box>
      </Paper>
    </BoxWrapper>
  );
};

export default SpeakSpeak;
