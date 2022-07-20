/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react';

import { SxProps } from '@mui/system';
import { Box, Card, CardMedia, Typography, useTheme, Tooltip } from '@mui/material';

import { useTranslation } from 'react-i18next';

import { ToastifyContext } from '@els/client/app/shared/contexts';

import { GraphqlTypes, HandleLearningType, HandleTestType, HandleViewType } from '@els/client/app/shared/data-access';

import { ButtonCustom, JoinIcon, LearningIcon, LoadingData, StartRatingIcon, StudentIcon, TestIcon, ViewIcon } from '@els/client/app/shared/ui';
import { NumberToK } from '@els/client/shared/utils';
 
export interface TopicCardProps {
  itemData: GraphqlTypes.LearningTypes.Topic;
  vocabularies: GraphqlTypes.LearningTypes.Vocabulary[]
  isJoining: boolean;
  myTopicData?: GraphqlTypes.LearningTypes.Topic;
  getMyTopicsLoading?: boolean;
  firstLoadMyTopics?: boolean;
  handleJoinTopic: (topicId: string) => void;
  handleViewVocabularyList: (data: HandleViewType) => void;
  handleLearning: (data: HandleLearningType) => void;
  handleTest: (data: HandleTestType) => void;
  onGoToDetail?: (studentId: string) => void; // studentId = enrollmentId
  onGoToTopicOverview: (topicId: string) => void;
  sx?: SxProps;
}

const TopicCard = (props: TopicCardProps) => {
  const { itemData, isJoining, vocabularies, myTopicData, getMyTopicsLoading, firstLoadMyTopics, handleJoinTopic, handleViewVocabularyList, handleLearning, handleTest, onGoToDetail, onGoToTopicOverview, sx } = props;
  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  const [vocabularyNumbers, setVocabularyNumbers] = useState<number>(0);
  const [memorizedVocabularyNumber, setMemorizedVocabularyNumber] = useState<number>(0);
  const [vagueVocabularyNumber, setVagueVocabularyNumber] = useState<number>(0);
  const [forgotVocabularyNumber, setForgotVocabularyNumber] = useState<number>(0);
  useEffect(() => {
    const memorizedNumber = myTopicData?.students?.[0]?.summaryMemoryStatus?.memorizedVocabularies?.length ?? 0;
    setMemorizedVocabularyNumber(memorizedNumber);

    const vagueNumber = myTopicData?.students?.[0]?.summaryMemoryStatus?.vagueVocabularies?.length ?? 0;
    setVagueVocabularyNumber(vagueNumber);

    const forgotNumber = myTopicData?.students?.[0]?.summaryMemoryStatus?.forgotVocabularies?.length ?? 0;
    setForgotVocabularyNumber(forgotNumber);
  }, [myTopicData]);

  useEffect(() => {
    setVocabularyNumbers(vocabularies?.length ?? 0);
  }, [vocabularies]);

  return (
    <Card
      sx={{
        transition: `${theme.transitions.create([
          'box-shadow',
          'transform',
          'border-radius'
        ])}`,
        transform: 'translateY(0px)',
        width: '100%',
        boxShadow: theme.colors.shadows.card,

        '&:hover': {
          transform: `translateY(-${theme.spacing(1)})`,
        },
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Tooltip arrow placement="top" title={t('Click for overview')}>
          <CardMedia
            width="100%"
            component="img"
            image={(myTopicData || itemData).thumbnailUri ? (myTopicData || itemData).thumbnailUri : '/images/source/topic/image-not-available.png'}
            onError={(e: any) => e.target.src = '/images/source/topic/image-not-available.png'}
            onClick={() => onGoToTopicOverview((myTopicData || itemData).id)}
            sx={{
              cursor: 'pointer',
              backgroundColor: '#dddddd',
              maxHeight: '345px',
              minHeight: {
                xs: '150px',
                md: '300px',
              },
            }}
            alt="..."
          />
        </Tooltip>
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            right: !myTopicData ? 'unset' : '0',
            width: 'fit-content',
            p: theme.spacing(2),
            display: 'flex',
          }}
        >
          {
            // TODO need handle not show Join button when getMyTopicsLoading = true
            // if first loading my topic list => not show
            !myTopicData &&
            <Box sx={{ position: 'relative' }}>
              <ButtonCustom
                variant="contained"
                color="warning"
                children={isJoining ? t('In processing') : t('Join now')}
                startIcon={isJoining ? <LoadingData /> : <JoinIcon />}
                sx={{
                  minWidth: '116px',
                  p: '8px 12px',
                  fontSize: '15px',
                  fontWeight: 700,
                }}
                onClick={() => {
                  if (isJoining) return;

                  handleJoinTopic(itemData.id);
                }}
              />
            </Box>
          }
          {
            myTopicData &&
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ButtonCustom
                variant="contained" color="success" children={`${t('Memorized')} ${memorizedVocabularyNumber}/${vocabularyNumbers}`}
                onClick={() => {
                  if (memorizedVocabularyNumber > 0) {
                    handleViewVocabularyList({
                      title: (
                        <Box>
                          <Typography
                            children={t('Memorized words')}
                            variant="inherit"
                            sx={{
                              color: theme.colors.secondary.main,
                              fontSize: '14px',
                              fontWeight: 700,
                            }}
                          />
                          <Typography
                            children={myTopicData.name}
                            variant="h3"
                            sx={{ fontSize: '18px', fontWeight: 700 }}
                          />
                        </Box>
                      ),
                      titleLearning: (
                        <Box>
                          <Typography
                            children={t('Review already memorized words')}
                            variant="inherit"
                            sx={{
                              color: theme.colors.secondary.main,
                              fontSize: '14px',
                              fontWeight: 700,
                            }}
                          />
                          <Typography
                            children={myTopicData.name}
                            variant="h3"
                            sx={{ fontSize: '18px', fontWeight: 700 }}
                          />
                        </Box>
                      ),
                      titleTest: (
                        <Box>
                          <Typography
                            children={t('Vocabulary test')}
                            variant="inherit"
                            sx={{
                              color: theme.colors.secondary.main,
                              fontSize: '14px',
                              fontWeight: 700,
                            }}
                          />
                          <Typography
                            children={myTopicData.name}
                            variant="h3"
                            sx={{ fontSize: '18px', fontWeight: 700 }}
                          />
                        </Box>
                      ),
                      myTopic: myTopicData,
                      vocabularies: myTopicData?.students?.[0]?.summaryMemoryStatus?.memorizedVocabularies ?? [],
                      studentId: myTopicData?.students?.[0]?.id,
                      memoryAnalyses: myTopicData?.students?.[0]?.memoryAnalyses,
                      options: { memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.Memorized },
                      currentLessonId: ''
                    });
                  } else
                    toastify({ type: 'warning', message: t('No words have been memorized') });
                }}
                sx={{
                  minWidth: 'unset', width: 'fit-content', p: '4px 16px', borderRadius: '22px', fontSize: '12px', mb: theme.spacing(1),
                }}
              />
              <ButtonCustom
                variant="contained" color="warning" children={`${t('Vague')} ${vagueVocabularyNumber}/${vocabularyNumbers}`}
                onClick={() => {
                  if (vagueVocabularyNumber > 0) {
                    handleViewVocabularyList({
                      title: (
                        <Box>
                          <Typography
                            children={t('Vague words')}
                            variant="inherit"
                            sx={{
                              color: theme.colors.secondary.main,
                              fontSize: '14px',
                              fontWeight: 700,
                            }}
                          />
                          <Typography
                            children={myTopicData.name}
                            variant="h3"
                            sx={{ fontSize: '18px', fontWeight: 700 }}
                          />
                        </Box>
                      ),
                      titleLearning: (
                        <Box>
                          <Typography
                            children={t('Review about to forget words')}
                            variant="inherit"
                            sx={{
                              color: theme.colors.secondary.main,
                              fontSize: '14px',
                              fontWeight: 700,
                            }}
                          />
                          <Typography
                            children={myTopicData.name}
                            variant="h3"
                            sx={{ fontSize: '18px', fontWeight: 700 }}
                          />
                        </Box>
                      ),
                      titleTest: (
                        <Box>
                          <Typography
                            children={t('Vocabulary test')}
                            variant="inherit"
                            sx={{
                              color: theme.colors.secondary.main,
                              fontSize: '14px',
                              fontWeight: 700,
                            }}
                          />
                          <Typography
                            children={myTopicData.name}
                            variant="h3"
                            sx={{ fontSize: '18px', fontWeight: 700 }}
                          />
                        </Box>
                      ),
                      myTopic: myTopicData,
                      vocabularies: myTopicData?.students?.[0]?.summaryMemoryStatus?.vagueVocabularies ?? [],
                      studentId: myTopicData?.students?.[0]?.id,
                      memoryAnalyses: myTopicData?.students?.[0]?.memoryAnalyses,
                      options: { memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.Vague },
                      currentLessonId: 'fake'
                    });
                  } else
                    toastify({ type: 'warning', message: t('There are no words to forget') });
                }}
                sx={{
                  minWidth: 'unset', width: 'fit-content', p: '4px 16px', borderRadius: '22px', fontSize: '12px', mb: theme.spacing(1),
                }}
              />
              <ButtonCustom
                variant="contained" color="error" children={`${t('Forgotten')} ${forgotVocabularyNumber}/${vocabularyNumbers}`}
                onClick={() => {
                  if (forgotVocabularyNumber > 0) {
                    handleViewVocabularyList({
                      title: (
                        <Box>
                          <Typography
                            children={t('Forgotten words')}
                            variant="inherit"
                            sx={{
                              color: theme.colors.secondary.main,
                              fontSize: '14px',
                              fontWeight: 700,
                            }}
                          />
                          <Typography
                            children={myTopicData.name}
                            variant="h3"
                            sx={{ fontSize: '18px', fontWeight: 700 }}
                          />
                        </Box>
                      ),
                      titleLearning: (
                        <Box>
                          <Typography
                            children={t('Review forgotten words')}
                            variant="inherit"
                            sx={{
                              color: theme.colors.secondary.main,
                              fontSize: '14px',
                              fontWeight: 700,
                            }}
                          />
                          <Typography
                            children={myTopicData.name}
                            variant="h3"
                            sx={{ fontSize: '18px', fontWeight: 700 }}
                          />
                        </Box>
                      ),
                      titleTest: (
                        <Box>
                          <Typography
                            children={t('Vocabulary test')}
                            variant="inherit"
                            sx={{
                              color: theme.colors.secondary.main,
                              fontSize: '14px',
                              fontWeight: 700,
                            }}
                          />
                          <Typography
                            children={myTopicData.name}
                            variant="h3"
                            sx={{ fontSize: '18px', fontWeight: 700 }}
                          />
                        </Box>
                      ),
                      myTopic: myTopicData,
                      vocabularies: myTopicData?.students?.[0]?.summaryMemoryStatus?.forgotVocabularies ?? [],
                      studentId: myTopicData?.students?.[0]?.id,
                      memoryAnalyses: myTopicData?.students?.[0]?.memoryAnalyses,
                      options: { memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.Forgot },
                      currentLessonId: ''
                    });
                  } else
                    toastify({ type: 'warning', message: t('No words have been forgotten') });
                }}
                sx={{
                  minWidth: 'unset', width: 'fit-content', p: '4px 16px', borderRadius: '22px', fontSize: '12px', mb: theme.spacing(1),
                }}
              />
            </Box>
          }
        </Box>
      </Box>
      <Box
        sx={{
          position: 'relative',
          p: theme.spacing(2),
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
          alignItems: {
            xs: 'start',
            md: 'center',
          }
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
              md: 'column',
              lg: 'row',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mr: theme.spacing(2) }}>
            <StartRatingIcon color={theme.colors.warning.main} sx={{ mr: '6px' }} />
            <Typography children={(itemData).rating} sx={{ fontSize: '18px', fontWeight: 700, mr: '10px' }} />
            <StudentIcon sx={{ mr: '6px' }} />
            <Typography children={NumberToK((itemData).numberOfParticipants)} sx={{ fontSize: '18px', fontWeight: 700 }} />
          </Box>
          <Box
            sx={{
              minWidth: '50%',
              textAlign: 'left'
            }}>
            <Typography
              children={(myTopicData || itemData).name}
              sx={{
                fontSize: {
                  xs: '25px',
                  md: '32px',
                },
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>
        
        {
          myTopicData &&
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Tooltip arrow placement="top" title={t('Test')}>
              <Box>
                <ButtonCustom
                  variant="contained"
                  color="primary"
                  startIcon={<TestIcon />}
                  onClick={() => {
                    if (myTopicData && !!vocabularyNumbers)
                      handleTest({
                        title: (
                          <Box>
                            <Typography
                              children={t('Vocabulary test')}
                              variant="inherit"
                              sx={{
                                color: theme.colors.secondary.main,
                                fontSize: '14px',
                                fontWeight: 700,
                              }}
                            />
                            <Typography
                              children={myTopicData.name}
                              variant="h3"
                              sx={{ fontSize: '18px', fontWeight: 700 }}
                            />
                          </Box>
                        ),
                        vocabularies: vocabularies,
                        studentId: myTopicData?.students?.[0]?.id,
                        memoryAnalyses: myTopicData?.students?.[0]?.memoryAnalyses,
                        myTopic: myTopicData,
                      });
                    else
                      toastify({ type: 'warning', message: t('No words to test') });
                  }}
                  rest={{
                    disabled: !myTopicData
                  }}
                  sx={{
                    width: '44px',
                    height: '44px',
                    p: 0,
                    minWidth: 'unset',
                  }}
                />
              </Box>
            </Tooltip>
            <Tooltip arrow placement="top" title={t('Learn')}>
              <Box>
                <ButtonCustom
                  variant="contained"
                  color="primary"
                  startIcon={<LearningIcon />}
                  onClick={() => {
                    if (myTopicData && !!vocabularyNumbers)
                      handleLearning({
                        title: (
                          <Box>
                            <Typography
                              children={t('Learn vocabulary')}
                              variant="inherit"
                              sx={{
                                color: theme.colors.secondary.main,
                                fontSize: '14px',
                                fontWeight: 700,
                              }}
                            />
                            <Typography
                              children={myTopicData.name}
                              variant="h3"
                              sx={{ fontSize: '18px', fontWeight: 700 }}
                            />
                          </Box>
                        ),
                        myTopic: myTopicData,
                        studentId: myTopicData?.students?.[0]?.id,
                        memoryAnalyses: myTopicData?.students?.[0]?.memoryAnalyses,
                        showLessonList: true,
                      });
                    else
                      toastify({ type: 'warning', message: t('No words to learn') });
                  }}
                  rest={{
                    disabled: !myTopicData
                  }}
                  sx={{
                    width: '44px',
                    height: '44px',
                    ml: theme.spacing(1),
                    p: 0,
                    minWidth: 'unset',
                  }}
                />
              </Box>
            </Tooltip>
            <Tooltip arrow placement="top" title={t('Details')}>
              <Box>
                <ButtonCustom
                  variant="contained"
                  color="primary"
                  startIcon={<ViewIcon />  }
                  onClick={() => (onGoToDetail && myTopicData?.students?.[0]?.id) ? onGoToDetail(myTopicData?.students?.[0]?.id) : null}
                  rest={{
                    disabled: !myTopicData
                  }}
                  sx={{
                    width: '44px',
                    height: '44px',
                    ml: theme.spacing(1),
                    p: 0,
                    minWidth: 'unset',
                  }}
                />
              </Box>
            </Tooltip>
          </Box>
        }
      </Box>
    </Card>
  );
};

export { TopicCard };
