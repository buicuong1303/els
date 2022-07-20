import { FC, useEffect, useState, useRef, ReactNode, Dispatch, SetStateAction } from 'react';

import { Box, Paper, Typography, useTheme, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

import SpaceBarIcon from '@mui/icons-material/SpaceBar';

import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { createVirtualKeyboard } from '@els/client/shared/utils';

import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom, QuestionIcon } from '@els/client/app/shared/ui';
import { TermButton } from '../term-button';

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

export interface TranslateTypingProps {
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

export const TranslateTyping: FC<TranslateTypingProps> = (props) => {
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
            readOnly: isAnswered
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
    const newChoices = cloneDeep(vocabulary).vocabulary?.toLocaleLowerCase().split('');

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
            children={answer}
          />
        </Box>
        <Box sx={{ marginX: 'auto' }}>
          <CssWriteField
            inputRef={answerInputRef}
            InputProps={{
              readOnly: isAnswered
            }}
            value={answer}
            placeholder="Write here......."
            sx={{
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
            p: theme.spacing(1, 3),
            maxWidth: '1000px',
            minWidth: '200px',
            width: '100%',
            margin: 'auto',
            mt: {
              xs: theme.spacing(7),
              md: theme.spacing(11),
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
      </Paper>
    </BoxWrapper>
  );
};

export default TranslateTyping;
