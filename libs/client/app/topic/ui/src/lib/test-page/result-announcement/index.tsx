import { FC, ReactNode, useEffect, useRef } from 'react';

import { styled } from '@mui/system';
import { Typography, useTheme, Box, SwipeableDrawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useTranslation } from 'react-i18next';

import { useAudio } from '@els/client-shared-hooks';

import { GraphqlTypes } from '@els/client/app/shared/data-access';

import { ButtonCustom } from '@els/client/app/shared/ui';

const BoxWrapper = styled(Box)(
  () => `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 1100px;
  `
);

export interface ResultAnnouncementProps {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  vocabulary: GraphqlTypes.LearningTypes.Vocabulary;
  correctAnswer: ReactNode;
  isRightAnswer: boolean;
  isLastQuestion: boolean;
  autoPlayAudio: boolean;
}

export const ResultAnnouncement: FC<ResultAnnouncementProps> = (props) => {
  const {
    open,
    handleClose,
    handleOpen,
    vocabulary,
    correctAnswer,
    isRightAnswer,
    isLastQuestion,
    autoPlayAudio,
  } = props;
  const { t }: { t: any } = useTranslation();
  const buttonNextRef = useRef<any>();

  const theme = useTheme();

  const { playAgain } = useAudio({ url: vocabulary.questions[0].prompt.audio || vocabulary.audio || '' });

  useEffect(() => {
    if (autoPlayAudio) playAgain();

    const handleCloseResultAnnouncement = (event: any) => {
      if (event.key === 'Enter') buttonNextRef.current.click();
    };

    window.addEventListener('keydown', handleCloseResultAnnouncement);

    return () => {
      window.removeEventListener('keydown', handleCloseResultAnnouncement);
    };
  }, []);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => null}
      onOpen={handleOpen}
      sx={{
        zIndex: 10001,
        '.MuiPaper-root': {
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          alignItems: 'center',
          padding: {
            xs: theme.spacing(2, 1),
            md: theme.spacing(4),
          },
        },
      }}
    >
      {/* ui */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: {
            xs: 'center',
            md: 'end',
          },
        }}
      >
        <ButtonCustom
          startIcon={
            isRightAnswer ? (
              <CheckIcon sx={{ fontSize: `${theme.spacing(5)} !important` }} />
            ) : (
              <CloseIcon sx={{ fontSize: `${theme.spacing(5)} !important` }} />
            )
          }
          color={isRightAnswer ? 'success' : 'error'}
          variant="contained"
          sx={{
            borderRadius: '50%',
            padding: theme.spacing(1),
            minWidth: 'unset',
            width: theme.spacing(10),
            height: theme.spacing(10),
            ':hover': {
              cursor: 'unset',
            },
          }}
        />
      </Box>
      <BoxWrapper
        sx={{
          width: '100%',
          mt: {
            xs: theme.spacing(4),
            md: theme.spacing(0),
          },
          p: {
            xs: theme.spacing(2, 0, 4, 0),
            md: theme.spacing(4, 0, 6, 0),
          },
          display: 'flex',
          alignItems: 'start',
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: {
                xs: theme.spacing(0),
                md: theme.spacing(3),
                lg: theme.spacing(7),
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: {
                  xs: 'center',
                  md: 'start',
                },
              }}
            >
              {isRightAnswer ? (
                <Box display="flex" flexDirection="column">
                  <Typography
                    variant="h4"
                    color="inherit"
                    children={t('Great')}
                    sx={{
                      mb: theme.spacing(1),
                      fontSize: {
                        xs: '30px',
                        md: '48px',
                      },
                      color: theme.colors.success.dark,
                    }}
                  />
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant="h4"
                    color="inherit"
                    children={t('Correct answer')}
                    sx={{
                      mb: theme.spacing(1),
                      fontSize: '18px',
                      color: theme.colors.error.main,
                    }}
                  />
                </Box>
              )}
            </Box>
            {!isRightAnswer && (
              <Box
                sx={{
                  // display: 'flex',
                  mb: theme.spacing(2),
                  mx: {
                    xs: 'auto',
                    md: 'unset',
                  },
                  justifyContent: {
                    xs: 'center',
                    md: 'start',
                  },
                }}
              >
                {correctAnswer}
              </Box>
            )}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: {
                  xs: 'center',
                  md: 'start',
                },
                ml: '-10px',
                mt: theme.spacing(2.5),
              }}
            >
              <Typography
                variant="h2"
                color="inherit"
                sx={{
                  fontSize: '28px',
                  mr: '35px',
                }}
                children={
                  <Box sx={{ position: 'relative' }}>
                    <ButtonCustom
                      color="primary"
                      children={<VolumeUpIcon style={{ fontSize: '30px' }} />}
                      sx={{
                        padding: theme.spacing(1),
                        minWidth: '20px',
                        color: theme.colors.alpha.black[50],
                        '&:active': {
                          bgcolor: `${theme.colors.primary.main} !important`,
                          color: '#ffffff !important',
                        },
                        mr: 2,
                      }}
                      onClick={playAgain}
                    />
                    {vocabulary.vocabulary}
                    <Typography
                      variant="subtitle1"
                      children={vocabulary.pos}
                      sx={{
                        fontSize: '20px',
                        fontWeight: 900,
                        color: theme.colors.alpha.black[30],
                        position: 'absolute',
                        right: '0',
                        bottom: '32px',
                        whiteSpace: 'nowrap',
                        transform: 'translate(50%, 0)',
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      children={vocabulary.phonetic}
                      sx={{
                        fontSize: '20px',
                        fontWeight: 900,
                        color: theme.colors.alpha.black[50],
                        position: 'absolute',
                        left: '50%',
                        bottom: '-28px',
                        transform: 'translate(-50%, 0)',
                        whiteSpace: 'nowrap',
                      }}
                    />
                  </Box>
                }
              />
              <Typography
                variant="h2"
                children={vocabulary.translation}
                sx={{
                  ml: '28px',
                  fontSize: '28px',
                  fontWeight: 900,
                  color: theme.colors.secondary.main,
                }}
              />
            </Box>
          </Box>
        </Box>
      </BoxWrapper>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: {
            xs: 'center',
            md: 'start',
          },
          mt: {
            xs: theme.spacing(4),
            md: theme.spacing(0),
          },
        }}
      >
        <ButtonCustom
          color={isRightAnswer ? 'success' : 'error'}
          variant="contained"
          onClick={handleClose}
          children={isLastQuestion ? t('Completed') : t('Next')}
          endIcon={<ArrowForwardIcon />}
          sx={{
            bottom: 0,
            padding: theme.spacing(1.5, 4),
            minWidth: 'unset',
            fontSize: '18px',
            whiteSpace: 'nowrap',
          }}
          rest={{
            ref: buttonNextRef,
          }}
        />
      </Box>
    </SwipeableDrawer>
  );
};

export default ResultAnnouncement;
