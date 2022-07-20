import { FC, useEffect, useState, useRef, ReactNode } from 'react';

import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  Card,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import { styled } from '@mui/material/styles';


import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import htmlParser from 'html-react-parser';


import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom, QuestionIcon } from '@els/client/app/shared/ui';

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

const CardAnswer = styled(Box)(
  ({ theme }) => `
    width: 100%;
    height: 50px;
    // background-color: ${theme.colors.secondary.lighter};
    text-align: center;
    z-index: 7;
    display: flex;
    justify-content: center;
    align-items: center;
  `
);

const CardActionAreaWrapper = styled(CardActionArea)(
  () => `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .MuiTouchRipple-root {
      opacity: .3;
    }

    &:hover {
      .MuiCardActionArea-focusHighlight {
        opacity: .05;
      }
    }
  `
);

export interface TranslateSelectCardProps {
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

export const TranslateSelectCard: FC<TranslateSelectCardProps> = (props) => {
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

  const [isClicked, setIsClicked] = useState<any>({});
  const [choices, setChoices] = useState<any[]>([]);

  const compareAnswer = (correctAnswer: string, answer: string) =>
    correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase();

  const handleAnswers = (key: string) => {
    const { correctAnswer }: { correctAnswer: string } = vocabulary.questions[0];

    if (setIsAnswered) setIsAnswered(true);

    setIsClicked({ ...isClicked, [key]: true });

    const userAnswer = choices[choices.findIndex((item: any, index) => item.description + index === key)].description;
    handleAnswer(userAnswer);

    const isRightAnswer = compareAnswer(correctAnswer, userAnswer);
    if (isRightAnswer) handleScoreIncrease();
    else {
      cloneDeep(choices).forEach((item: any, index) => {
        const choice =
          index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : 'D';

        const isRightAnswer = compareAnswer(correctAnswer, item.description);
        if (isRightAnswer) {
          setCorrectAnswer(
            <Typography
              children={`${choice}. ${item.description}`}
              sx={{
                color: theme.colors.primary.main,
                fontSize: '25px',
                fontWeight: '600',
                backgroundColor: theme.colors.secondary.lighter,
                width: 'fit-content',
                p: theme.spacing(1, 4),
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
    setIsRightAnswer(false);
    setChoices(JSON.parse(vocabulary.questions[0].choices) ?? []);
  }, [vocabulary]);
  useEffect(() => {
    document.onkeydown = (event) => {
      if (isAnswered) return;
    };
  }, [isAnswered]);

  useEffect(() => {
    const newIsClicked: any = {};
    cloneDeep(choices).forEach(
      (item, index) => (newIsClicked[item + index] = false)
    );
    setIsClicked(newIsClicked);

    document.onkeydown = (event) => {
      if (isAnswered || event.ctrlKey || event.altKey) return;

      const options: { [key: string]: any } = {
        1: choices[0]?.description + 0,
        a: choices[0]?.description + 0,
        A: choices[0]?.description + 0,
        2: choices[1]?.description + 1,
        b: choices[1]?.description + 1,
        B: choices[1]?.description + 1,
        3: choices[2]?.description + 2,
        c: choices[2]?.description + 2,
        C: choices[2]?.description + 2,
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
        <Box sx={{ marginX: 'auto' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.8rem',
              mt: theme.spacing(2),
            }}
            children={
              htmlParser(
                `"${vocabulary.questions[0].prompt.text?.split('"').map(
                  (item, index) => {
                    if (index === 1) return `<span style="color: ${theme.colors.primary.main}">${item}</span>`;
                    return item;
                  }
                ).join('') ?? ''}"`
              )
            }
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            mt: {
              xs: theme.spacing(4),
              md: theme.spacing(7),
            },
          }}
        >
          <Grid
            container
            alignItems="start"
            justifyContent="center"
            rowSpacing={4}
            columnSpacing={{ xs: 2, sm: 10, md: 14 }}
          >
            {choices.map((item: any, index) => {
              const choice =
                index === 0 ? 'A' : index === 1 ? 'B' : 'C';

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  key={item.description + index}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      transition: `${theme.transitions.create([
                        'box-shadow',
                        'transform'
                      ])}`,
                      transform: 'translateY(0px)',
                      borderRadius: '20px',
                      boxShadow: 'unset',

                      '&:hover': {
                        transform: 'translateY(-10px)',
                      },
                    }}
                    onClick={isAnswered ? undefined : () => handleAnswers(item.description + index)}
                  >
                    <CardActionAreaWrapper>
                      <CardMedia
                        component="img"
                        sx={{
                          height: {
                            xs: '250px',
                            sm: '280px',
                            md: '300px',
                          }
                        }}
                        image={item.uri}
                        alt="..."
                      />
                      <CardAnswer>
                        <Typography
                          children={`${choice}. ${item.description}`}
                          sx={{
                            fontSize: '25px',
                            fontWeight: '600',
                          }}
                        />
                      </CardAnswer>
                    </CardActionAreaWrapper>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>
    </BoxWrapper>
  );
};

export default TranslateSelectCard;
