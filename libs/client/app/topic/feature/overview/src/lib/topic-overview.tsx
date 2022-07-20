/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useContext, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
import {
  useTheme,
  Box,
  Card,
  Typography,
  Divider,
  Tooltip,
  TextField,
  Avatar,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Rating from '@mui/material/Rating';

import { cloneDeep, shuffle } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useLazyQuery, useMutation } from '@apollo/client';
import jsCookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

import { ToastifyContext } from '@els/client/app/shared/contexts';

import { GraphqlMutations, GraphqlQueries, GraphqlTypes, HandleLearningType, HandleTestType } from '@els/client/app/shared/data-access';

import { BookIcon, BreadcrumbsCustom, BreadcrumbsItem, ButtonCustom, JoinIcon, LabelCustom, LearningIcon, Loading, LoadingData, NoteBookIcon, NoteBookQuestionIcon, StartRatingIcon, TestIcon, ViewIcon } from '@els/client/app/shared/ui';

import { ApolloClient } from '@els/client/shared/data-access';
import { addAlpha, fromNow } from '@els/client/shared/utils';
import { useRouter } from 'next/router';
import { LearningPage, TestPage } from '@els/client/app/topic/ui';

const TimelineWrapper = styled(Timeline)(
  ({ theme }) => `
    margin-left: ${theme.spacing(2)};
    height: 100%;
    overflow: auto;
    padding: 0 20px;

    .MuiTimelineDot-root {
      color: ${theme.colors.primary.main};
      background-color: ${theme.colors.primary.lighter};
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      left: -20px !important;
      top: unset;
    }

    .MuiTimelineItem-root {
      min-height: unset;
    }
    
    .MuiTimelineContent-root {
      padding-left: ${theme.spacing(4)};
      padding-right: ${theme.spacing(0)};
    }
    
    .MuiFormControlLabel-root {
      margin-left: -${theme.spacing(0.7)};
    }
    
    .MuiFormControlLabel-label {
      color: ${theme.colors.alpha.black[50]};
    }
  `
);

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

const randomEvaluations = shuffle([
  {
    id: uuidv4(),
    text: 'Tuyệt vời!!!',
  },
  {
    id: uuidv4(),
    text: 'Chủ đề này rất bổ ích.',
  },
  {
    id: uuidv4(),
    text: 'Nên có thêm nhiều từ vựng hơn nữa.',
  },
  {
    id: uuidv4(),
    text: 'Nó sẽ không làm bạn thất vọng.',
  },
  {
    id: uuidv4(),
    text: 'Rất sát thực tế.',
  }
]);

const TopicDetailWrapper = styled(Box)(
  ({ theme }) => `
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

const BoxWrapper = styled(Box)(
  ({ theme }) => `
    height: 0;
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

export interface TopicOverviewProps {}

export const TopicOverview: FC<TopicOverviewProps> = (props) => {
  const theme = useTheme();

  const router = useRouter();
  
  const { t }: { t: any } = useTranslation();

  const language = jsCookies.get('i18nextLng') ?? window?.localStorage?.getItem('i18nextLng') ?? 'vi';

  const { toastify } = useContext(ToastifyContext);

  // * page state
  const formStateInit = { message: '', rating: 0 };
  const [formState, setFormState] = useState(formStateInit);
  const [topic, setTopic] = useState<GraphqlTypes.LearningTypes.Topic>();
  const [enrollment, setEnrollment] = useState<GraphqlTypes.LearningTypes.Enrollment>();
  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();
  const [vocabularies, setVocabularies] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>([]);
  const [vocabulariesForLearning, setVocabulariesForLearning] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>([]);
  const [vocabulariesForTest, setVocabulariesForTest] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>([]);
  const [ignoredWords, setIgnoredWords] = useState<string[]>([]);
  const [lessons, setLessons] = useState<GraphqlTypes.LearningTypes.Lesson[]>([]);
  const [commentsData, setCommentsData] = useState<GraphqlTypes.LearningTypes.Comment[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [isJoining, setIsJoining] = useState<boolean>(false);

  // * learning page
  const [learningPageTitle, setLearningPageTitle] = useState<ReactNode>('');
  const [learningPageSubTitle, setLearningPageSubTitle] = useState<ReactNode>('');
  const [openLessonReview, setOpenLessonReview] = useState<boolean>(false);
  const handleLearning = (data: HandleLearningType) => {
    setLearningPageTitle(data.title);
    setLearningPageSubTitle(data.subtitle);
    setVocabulariesForLearning(data.vocabularies ?? []);
    setOpenLessonReview(true);
  };

  // * test page
  const [testPageTitle, setTestPageTitle] = useState<ReactNode>('');
  const [testPageSubTitle, setTestPageSubTitle] = useState<ReactNode>('');
  const [openTestPage, setOpenTestPage] = useState<boolean>(false);
  const handleTest = (data: HandleTestType) => {
    setTestPageTitle(data.title);
    setTestPageSubTitle(data.subtitle);
    setVocabulariesForTest(data.vocabularies ?? []);
    setOpenTestPage(true);
  };

  // * get data
  const [GetCurrentUser, { loading: getCurrentUserLoading }] = useLazyQuery<{ user: GraphqlTypes.LearningTypes.User }>(
    GraphqlQueries.LearningQueries.User.GetUser,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        setCurrentUser(data?.user);
      },
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
    },
  );

  const [GetTopic, { loading: getTopicLoading }] = useLazyQuery<{ topics: { nodes: GraphqlTypes.LearningTypes.Topic[] } }>(
    GraphqlQueries.LearningQueries.Topic.GetTopics,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      variables: {
        ids: [router.query.id],
        includeLessonInfo: true,
        includeVocabularyInfo: true,
      },
      onCompleted: (data) => {
        setTopic(data?.topics?.nodes?.[0]);
      },
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
    },
  );

  const [GetMyTopics] = useLazyQuery<{ myTopics: GraphqlTypes.LearningTypes.Topic[] }>(
    GraphqlQueries.LearningQueries.Topic.GetMyTopics,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
    },
  );

  const [GetEnrollment, { loading: getEnrollmentLoading }] = useLazyQuery<{ enrollment: GraphqlTypes.LearningTypes.Enrollment }>(
    GraphqlQueries.LearningQueries.Enrollment.GetEnrollment,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      variables: {
        topicId: '',
      },
      onCompleted: (data) => {
        setEnrollment(data?.enrollment);
      },
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
    },
  );

  const [GetVocabularies] = useLazyQuery(GraphqlQueries.LearningQueries.Vocabulary.GetVocabularies, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setVocabularies(data.vocabularies ?? []);
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
  });

  const [GetLessons] = useLazyQuery(GraphqlQueries.LearningQueries.Lesson.GetLessons, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setLessons(data.lessons ?? []);
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
  });

  const [GetEvaluations, { loading: getEvaluationsLoading }] = useLazyQuery<{ evaluations: GraphqlTypes.LearningTypes.Comment[] }>(GraphqlQueries.LearningQueries.Comment.GetEvaluations, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      const evaluationComment = data?.evaluations?.filter(item => item.category === GraphqlTypes.LearningTypes.CategoryComment.Evaluation) ?? [];
      setCommentsData(evaluationComment);
    },
    onError: (error) => {
      if (error.message !== 'Not found entity')
        toastify({
          message: error.message,
          type: 'error',
        });
    },
  });

  const [WriteCommentGql] = useMutation(GraphqlMutations.LearningMutations.Comment.WriteComment, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      GetEvaluations({
        variables: {
          entityId: topic?.id,
          entityName: 'topic',
        }
      });
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: [
      GraphqlQueries.LearningQueries.Comment.GetEvaluations,
    ],
  });

  // * mutation data
  const [JoinTopic] = useMutation(GraphqlMutations.LearningMutations.Enrollment.JoinTopic, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: [
      GraphqlQueries.LearningQueries.Topic.GetMyTopics,
      GraphqlQueries.LearningQueries.Enrollment.GetEnrollment,
      GraphqlQueries.LearningQueries.User.GetUser,
    ],
  });

  // * breadcrumb
  const breadcrumbsList: BreadcrumbsItem[] = [
    {
      title: topic?.specialization?.category?.name,
      onClick: () => handleGoToLearningPage(topic?.specialization?.category?.id, '')
    },
    {
      title: topic?.specialization?.name,
      onClick: () => handleGoToLearningPage(topic?.specialization?.category?.id, topic?.specialization?.name)
    },
    {
      title: topic?.name,
      color: theme.colors.primary.main,
    },
  ];

  // handle logic
  const handleGoToLearningPage = (categorySelectedId?: string, specializedName?: string) => {
    if (categorySelectedId)
      router.push({
        pathname: '/learning',
        query: {
          categoryId: categorySelectedId,
          specializedName: specializedName,
        },
      });
  };
  
  const onGoToDetail = (id: string) => router.push(`/learning/${id}`);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleRating = (rating: number) => {
    setFormState({
      ...formState,
      rating: rating,
    });
  };

  const handleComment = (topicId: string) => {
    if (!formState?.message?.trim()) return;

    WriteCommentGql({
      variables: {
        createCommentInput: {
          entityId: topicId,
          entityName: 'topic',
          category: GraphqlTypes.LearningTypes.CategoryComment.Evaluation,
          rating: formState.rating,
          text: formState.message,
        }
      },
      onCompleted: (data) => {
        // console.log(data);
      }
    });

    setFormState(formStateInit);
  };

  const handleJoinTopic = (topicId: string) => {
    setIsJoining(true);

    JoinTopic({
      variables: {
        createEnrollmentInput: {
          topicId: topicId,
        },
      },
    });
  };

  useEffect(() => {
    if (topic) {
      GetVocabularies({
        variables: {
          getVocabulariesInput: {
            vocabularyIds: cloneDeep(topic.vocabularies).map(vocabulary => vocabulary.id),
          },
        }
      });
  
      GetLessons({
        variables: {
          ids: cloneDeep(topic.lessons).map(lesson => lesson.id),
        }
      });

      GetEvaluations({
        variables: {
          entityId: topic.id,
          entityName: 'topic',
        }
      });
    }
  }, [topic]);

  useEffect(() => {
    const ignoredWordsUser = currentUser?.ignoredWords || [];
    const ignoredWordsFilter =  ignoredWordsUser.filter(item => vocabularies.findIndex(vocabulary => vocabulary.vocabulary === item) >= 0);
    setIgnoredWords(ignoredWordsFilter);
  }, [currentUser, vocabularies]);

  useEffect(() => {
    const newRating = !commentsData.length ? 0 : cloneDeep(commentsData)?.map(item => item.rating).reduce((rating1, rating2) => rating1 + rating2, 0) / commentsData.length;
    setRating(newRating);
  }, [commentsData]);

  useEffect(() => {
    GetCurrentUser();

    GetTopic({
      variables: {
        ids: [router.query.id],
        includeLessonInfo: true,
        includeVocabularyInfo: true,
      },
    });

    GetEnrollment({
      variables: {
        topicId: router.query.id
      }
    });

    GetMyTopics();

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const overviewContent = document.getElementById('overview_content');

    if (overviewContent) {
      overviewContent.style.marginTop = `-${overviewContent.clientHeight / 2}px`;
    }
  });

  if (!currentUser || !topic || getCurrentUserLoading || getTopicLoading || getEvaluationsLoading) return <Loading />;

  // * render ui
  return (
    <TopicDetailWrapper
      sx={{
        height: {
          xs: 'unset',
        },
        padding: {
          xs: theme.spacing(1),
          sm: theme.spacing(2),
          md: theme.spacing(3),
          lg: theme.spacing(5),
        },
      }}
    >
      {/* title page */}
      <BreadcrumbsCustom
        title={t('Overview')}
        breadcrumbsList={breadcrumbsList}
        icon={<LearningIcon width="36px" height="36px" />}
      />

      {/* content */}
      <BoxWrapper>
        {/* thumbnail */}
        <Box
          sx={{
            width: '100%',
            height: {
              xs: '500px',
              md: '700px',
            },
            borderRadius: '6px',
            backgroundImage: `url(${topic.thumbnailUri ? topic.thumbnailUri : '/images/source/topic/image-not-available.png'}), url('/images/source/topic/image-not-available.png')`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#dddddd',
            backgroundSize: topic.thumbnailUri ? 'cover' : 'unset',
          }}
        />

        {/* content */}
        <Box
          id="overview_content"
          sx={{
            width: '100%',
            px: {
              xs: 1,
              sm: 2,
              md: 4,
              lg: 16.5
            },
            mt: '28px',
            display: 'flex',
            flexDirection: {
              xs: 'column',
              lg: 'row',
            },
          }}
        >
          {/* overview */}
          <Box
            sx={{
              width: {
                xs: '100%',
                lg: '50%',
              },
              mr: {
                xs: 0,
                lg: '20px',
              },
            }}
          >
            {/* details */}
            <Card
              sx={{
                boxShadow: theme.colors.shadows.card,
                p: '24px',
              }}
            >
              <Typography
                children={topic.name}
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: '32px',
                    sm: '40px',
                    md: '48px',
                    textAlign: 'center',
                  }
                }}
              />
              <Typography
                children={topic.description}
                sx={{
                  mt: theme.spacing(1),
                  fontSize: '18px',
                  fontWeight: 400,
                  color: addAlpha(theme.colors.alpha.black[100], 0.5),
                }}
              />
              <Box
                sx={{
                  mt: theme.spacing(4),
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ButtonCustom
                  startIcon={<NoteBookIcon />}
                  sx={{
                    borderRadius: '50%',
                    minWidth: 'unset',
                    width: '40px',
                    height: '40px',
                    backgroundColor: theme.colors.primary.lighter,
                    mr: '12px',
                    cursor: 'default',
                    boxShadow: theme.colors.shadows.card,
                  }}
                />
                <Typography
                  children={
                    <Box sx={{ display: 'flex' }} >
                      <Typography
                        children={`${t('Number of words')}:`}
                        sx={{
                          fontSize: '18px',
                          fontWeight: 400,
                          color: theme.colors.secondary.dark,
                          mr: '4px',
                        }}
                      />
                      <Typography
                        children={`${vocabularies.length} ${t('word')}`}
                        sx={{
                          fontSize: '18px',
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  }
                />
              </Box>
              {!!ignoredWords.length && (
                <Box
                  sx={{
                    mt: theme.spacing(1.5),
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ButtonCustom
                    startIcon={<NoteBookQuestionIcon />}
                    sx={{
                      borderRadius: '50%',
                      minWidth: 'unset',
                      width: '40px',
                      height: '40px',
                      backgroundColor: theme.colors.primary.lighter,
                      mr: '12px',
                      cursor: 'default',
                      boxShadow: theme.colors.shadows.card,
                    }}
                  />
                  <Box>
                    <Typography
                      children={t('You may already know these words')}
                      sx={{
                        fontWeight: 400,
                        fontSize: '18px',
                        color: theme.colors.secondary.dark,
                      }}
                    />
                    {ignoredWords.map((item, index: number) => (
                      <LabelCustom
                        key={index}
                        children={item}
                        color="info"
                        sx ={{
                          mr: theme.spacing(1),
                          p: '3px 12px',
                          borderRadius: '22px',
                          fontSize: '10px',
                          mb: '4px',
                          fontWeight: 700,
                          color: '#ffffff !important',
                          bgcolor: `${theme.colors.info.main} !important`,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Card>
            
            {/* action */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: theme.spacing(2.5)
              }}
            >
              { enrollment && (
                <Tooltip key={Math.random()} arrow placement="top" title={t('Test')}>
                  <Box>
                    <ButtonCustom
                      variant="contained"
                      color="primary"
                      startIcon={getEnrollmentLoading ? <LoadingData /> : <TestIcon />}
                      onClick={() => {
                        if (topic && !!vocabularies.length)
                          handleTest({
                            title: (
                              <Box
                                children={
                                  <Box sx={{ display: 'flex' }}>
                                    <Typography children={`${t('Topic')}:`} variant="h3" sx={{ mr: 0.5, color: theme.colors.secondary.main, fontSize: '18px', fontWeight: 700}} />
                                    <Typography children={topic.name} variant="h3" sx={{ fontSize: '18px', fontWeight: 700 }} />
                                  </Box>
                                }
                              />
                            ),
                            subtitle: (
                              <Typography children={t('Vocabulary test')} variant="inherit" sx={{ color: theme.colors.secondary.main, fontSize: '14px', fontWeight: 700 }} />
                            ),
                            vocabularies: vocabularies,
                          });
                        else
                          toastify({ type: 'warning', message: t('No words to test') });
                      }}
                      rest={{
                        disabled: !topic || !enrollment
                      }}
                      sx={{
                        minWidth: 'unset',
                        width: '44px',
                        height: '44px',
                        mx: theme.spacing(1.5),
                      }}
                    />
                  </Box>
                </Tooltip>
              )}
              { enrollment && (
                <Tooltip key={Math.random()} arrow placement="top" title={t('Learn')}>
                  <Box>
                    <ButtonCustom
                      variant="contained"
                      color="primary"
                      startIcon={getEnrollmentLoading ? <LoadingData /> : <LearningIcon />}
                      onClick={() => {
                        if (topic && !!vocabularies.length)
                          handleLearning({
                            title: (
                              <Box
                                children={
                                  <Box sx={{ display: 'flex' }}>
                                    <Typography children={`${t('Topic')}:`} variant="h3" sx={{ mr: 0.5, color: theme.colors.secondary.main, fontSize: '18px', fontWeight: 700}} />
                                    <Typography children={topic.name} variant="h3" sx={{ fontSize: '18px', fontWeight: 700 }} />
                                  </Box>
                                }
                              />
                            ),
                            subtitle: (
                              <Typography children={t('Learn vocabulary')} variant="inherit" sx={{ color: theme.colors.secondary.main, fontSize: '14px', fontWeight: 700 }} />
                            ),
                          });
                        else
                          toastify({ type: 'warning', message: t('No words to learn') });
                      }}
                      rest={{
                        disabled: !topic || !enrollment
                      }}
                      sx={{
                        minWidth: 'unset',
                        width: '44px',
                        height: '44px',
                        mx: theme.spacing(1.5),
                      }}
                    />
                  </Box>
                </Tooltip>
              )}
              { enrollment && (
                <Tooltip key={Math.random()} arrow placement="top" title={t('Details')}>
                  <Box>
                    <ButtonCustom
                      variant="contained"
                      color="primary"
                      startIcon={getEnrollmentLoading ? <LoadingData /> : <ViewIcon />}
                      onClick={() => enrollment ? onGoToDetail(enrollment.id) : null}
                      rest={{
                        disabled: !enrollment
                      }}
                      sx={{
                        minWidth: 'unset',
                        width: '44px',
                        height: '44px',
                        mx: theme.spacing(1.5),
                      }}
                    />
                  </Box>
                </Tooltip>
              )}
              { !enrollment && (
                <Tooltip key={Math.random()} arrow placement="top" title={t('Details')}>
                  <Box>
                    <ButtonCustom
                      variant="contained"
                      color="warning"
                      children={isJoining ? t('In processing') : t('Join now')}
                      startIcon={isJoining ? <LoadingData /> : <JoinIcon />}
                      onClick={() => handleJoinTopic(topic.id)}
                      sx={{
                        minWidth: 'unset',
                        height: '38px',
                        mx: theme.spacing(1.5),
                        fontSize: '15px',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Tooltip>
              )}
            </Box>

            {/* rating */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mt: theme.spacing(2.5)
              }}
            >
              <StyledRating
                value={rating}
                getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                precision={0.5}
                readOnly
                icon={<StartRatingIcon sx={{ width: '36px', height: '36px', color: theme.colors.warning.dark }} />}
                emptyIcon={<StartRatingIcon sx={{ width: '36px', height: '36px', color: theme.colors.alpha.black[50] }} />}
              />
              {!commentsData?.length
                ? (
                  <Box sx={{ display: 'flex', mt: 1.5, fontSize: '18px', fontWeight: 700, color: theme.colors.secondary.main }}>
                    <Typography variant="inherit" children={t('There are no reviews yet')}/>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', mt: 1.5, fontSize: '18px', fontWeight: 700, color: theme.colors.secondary.main }}>
                    <Typography variant="inherit" children={`${Math.round(rating * 10) / 10}/5`} sx={{ mr: 0.5 }} />
                    <Typography variant="inherit" children={`(${commentsData?.length} ${t('Evaluation')})`} />
                  </Box>
                )
              }
            </Box>
          </Box>

          {/* lesson list */}
          <Box
            sx={{
              width: {
                xs: '100%',
                lg: '50%',
              },
              mt: {
                xs: '28px',
                lg: 0,
              },
            }}
          >
            <Card
              sx={{
                boxShadow: theme.colors.shadows.card,
              }}
            >
              <Typography
                children={t('List of lessons')}
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  p: '20px',
                }}
              />
              <Divider sx={{ height: '1px', bgcolor: theme.colors.alpha.black[100], opacity: 0.1 }} />
              <TimelineWrapper sx={{ maxHeight: '445px' }}>
                {
                  lessons?.length > 0
                    ? cloneDeep(lessons).map((item, index: number) => {
                      return (
                        <TimelineItem sx={{ p: 0 }} key={item.id}>
                          <TimelineSeparator
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <TimelineDot>
                              <BookIcon />
                            </TimelineDot>
                            <TimelineConnector
                              sx={{
                                height: index === 0 ? '50%' : '100%',
                                top: index === 0 ? '50%' : '0%',
                              }}
                            />
                          </TimelineSeparator>
                          <TimelineContent>
                            <Box
                              sx={{
                                display: 'flex',
                                boxShadow: theme.colors.shadows.card,
                                borderRadius: '4px 6px 4px 5px',
                                height: '100%',
                              }}
                            >
                              <Box
                                sx={{
                                  height: '100%',
                                  width: '6px',
                                  bgcolor: theme.colors.primary.main,
                                  borderRadius: '12px',
                                  mr: theme.spacing(2),
                                }}
                              />
                              <Box
                                sx={{
                                  py: '12px',
                                  flex: 1,
                                  display: 'flex',
                                  flexDirection: {
                                    xs: 'column',
                                    md: 'row',
                                  }
                                }}
                              >
                                <Box
                                  sx={{
                                    mr: theme.spacing(2),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    width: 'fit-content',
                                  }}
                                >
                                  <Typography
                                    children={item.name}
                                    sx={{
                                      fontSize: '16px',
                                      fontWeight: 700,
                                      display: 'inline-block',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                    }}
                                  />
                                  <Typography
                                    children={`${item?.vocabularies?.length ?? 0} ${t('Vocabulary')}`}
                                    sx={{
                                      fontSize: '14px',
                                      display: 'inline-block',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                      color: theme.colors.secondary.dark,
                                      fontWeight: 400,
                                    }} /> 
                                </Box>
                                <Box>
                                  {cloneDeep(item?.vocabularies ?? []).map(item => (
                                    <LabelCustom
                                      key={item.id}
                                      children={item.vocabulary}
                                      color="default"
                                      sx ={{
                                        mr: theme.spacing(1),
                                        p: '3px 12px',
                                        borderRadius: '22px',
                                        fontSize: '10px',
                                        mb: '4px',
                                        fontWeight: 700,
                                        backgroundColor: `${theme.colors.secondary.light} !important`,
                                        color: '#ffffff !important'
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </Box>
                          </TimelineContent>
                        </TimelineItem>
                      );
                    })
                    : <Box sx={{ textAlign: 'center' }} children={t('No records to display')} />
                }
              </TimelineWrapper>
            </Card>
          </Box>
        </Box>

        {/* reviews */}
        <Box
          sx={{
            width: '100%',
            mt: 4,
          }}
        >
          {/* title */}
          <Box>
            <Typography variant="inherit" children={t('Reviews')} sx={{ fontSize: '20px', fontWeight: 700 }} />
          </Box>

          {/* write comment */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'start',
              mt: '20px',
            }}
          >
            <Avatar
              sx={{
                width: {
                  xs: 40,
                  md: 50,
                },
                height: {
                  xs: 40,
                  md: 50,
                },
                mr: {
                  xs: 1,
                  md: 1.5
                },
              }}
              alt={currentUser.identity?.traits.firstName}
              src={currentUser.identity?.traits.picture?.toString()}
            />
            <Box
              sx={{
                flex: 1,
                width: 0,
                background: '#FFFFFF',
                boxShadow: theme.colors.shadows.card,
                borderRadius: '6px',
                p: '12px',
              }}
            >
              <Tooltip arrow placement="top" title={t('Click to select')}>
                <StyledRating
                  value={formState.rating}
                  getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                  precision={1}
                  icon={<StartRatingIcon sx={{ width: '28px', height: '28px', color: theme.colors.warning.dark }} />}
                  emptyIcon={<StartRatingIcon sx={{ width: '28px', height: '28px', color: theme.colors.alpha.black[50] }} />}
                  onChange={(event, newValue) => handleRating(newValue ?? 0)}
                  readOnly={!enrollment}
                />
              </Tooltip>
              <TextField
                multiline
                maxRows={4}
                value={formState.message}
                onChange={handleChange}
                variant="standard"
                name="message"
                fullWidth
                disabled={!enrollment}
                sx={{
                  mt: 2,
                  fontSize: '14px',
                  '.MuiInputBase-root::before': {
                    borderBottom: `2px solid ${theme.palette.common.black}`,
                    opacity: 0.1,
                  },
                }}
                placeholder={!enrollment ? t('Please join the topic to be able to rate!') : t('Please leave your review!')}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'end',
                  mt: 1,
                  width: '100%',
                  alignItems: 'end',
                }}
              >
                <Box
                  sx={{
                    // display: 'flex',
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    // overflowX: 'auto',
                    py: 1,
                  }}
                >
                  {
                    randomEvaluations.map((item) => {
                      return(
                        <ButtonCustom
                          key={item.id}
                          variant="text"
                          children={item.text}
                          sx={{
                            p: theme.spacing(0.5, 2),
                            mb: 1,
                            mr: 1,
                            display: 'inline-block',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            minWidth: 'fit-content',
                            boxShadow: '4px 4px 10px -4px #c2c2c2',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 400,
                            color: theme.colors.secondary.dark,
                          }}
                          onClick={() => setFormState({ ...formState, message: item.text })}
                          rest={{
                            disabled: !enrollment
                          }}
                        />
                      );
                    })
                  }
                </Box>

                <ButtonCustom
                  variant="contained"
                  children={t('Send Review')}
                  onClick={() => handleComment(topic.id)}
                  rest={{
                    disabled: !enrollment || !formState.message.trim() || !formState.rating,
                  }}
                  sx={{
                    width: 'fit-content', 
                    mt: 1,
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* review list */}
          <Box
            sx={{
              // maxHeight: '500px',
              // overflowY: 'scroll',
              // mr: '-5px',
              mt: '20px',
            }}
          >
            {
              commentsData.map((item, index) => {
                return (
                  <Box
                    key={item._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'start',
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: {
                          xs: 40,
                          md: 50,
                        },
                        height: {
                          xs: 40,
                          md: 50,
                        },
                        mr: {
                          xs: 1,
                          md: 1.5
                        },
                      }}
                      alt={item.user.identity?.traits.firstName}
                      src={item.user.identity?.traits.picture?.toString()}
                    />
                    <Box
                      sx={{
                        flex: 1,
                        background: '#FFFFFF',
                        boxShadow: theme.colors.shadows.card,
                        borderRadius: '6px',
                        p: '12px',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: {
                              xs: 'column',
                              md: 'row',
                            },
                            alignItems: {
                              xs: 'start',
                              md: 'end',
                            },
                          }}
                        >
                          {/* name */}
                          <Typography
                            variant="inherit" children={`${item.user.identity?.traits.firstName} ${item.user.identity?.traits.lastName}`}
                            sx={{
                              fontSize: '18px',
                              fontWeight: 700,
                              lineHeight: 1,
                              mr: 1,
                            }}
                          />

                          {/* time */}
                          <Typography
                            variant="inherit" children={fromNow({ time: new Date(item.createdAt), language: language})}
                            sx={{
                              fontSize: '16px',
                              fontWeight: 400,
                              lineHeight: 1,
                              color: theme.colors.secondary.main,
                            }}
                          />
                        </Box>

                        {/* rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StyledRating
                            sx={{
                              display: {
                                xs: 'none',
                                md: 'flex'
                              }  
                            }}
                            value={item.rating}
                            getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                            precision={0.5}
                            readOnly
                            icon={<StartRatingIcon sx={{ width: '24px', height: '24px', color: theme.colors.warning.dark }} />}
                            emptyIcon={<StartRatingIcon sx={{ width: '24px', height: '24px', color: theme.colors.alpha.black[50] }} />}
                          />
                          <StyledRating
                            sx={{
                              display: {
                                xs: 'flex',
                                md: 'none'
                              }  
                            }}
                            value={1}
                            max={1}
                            readOnly
                            icon={<StartRatingIcon sx={{ width: '24px', height: '24px', color: theme.colors.warning.dark }} />}
                            emptyIcon={<StartRatingIcon sx={{ width: '24px', height: '24px', color: theme.colors.alpha.black[50] }} />}
                          />
                          <Typography variant="inherit" children={`${item.rating}/5`} sx={{ ml: 0.5, fontSize: '16px', fontWeight: 600, color: theme.colors.secondary.main }} />
                        </Box>
                      </Box>

                      {/* message */}
                      <Typography
                        variant="inherit" children={item.text}
                        sx={{
                          fontSize: '16px',
                          fontWeight: 400,
                          lineHeight: 1,
                          mt: 1,
                          color: theme.colors.secondary.dark,
                          pr: 3,
                        }}
                      />
                    </Box>
                  </Box>
                );
              })
            }
          </Box>
        </Box>
      </BoxWrapper>

      {openLessonReview && (
        <LearningPage
          open={openLessonReview}
          setOpen={setOpenLessonReview}
          title={learningPageTitle}
          subtitle={learningPageSubTitle}
          myTopic={enrollment ? topic : undefined}
          showLessonList={true}
          vocabularies={vocabulariesForLearning ?? []}
          memoryAnalyses={enrollment?.memoryAnalyses ?? []}
          handleTest={handleTest}
          sx={{}}
        />
      )}

      {openTestPage && (
        <TestPage
          open={openTestPage}
          setOpen={setOpenTestPage}
          title={testPageTitle}
          subtitle={testPageSubTitle}
          vocabularies={vocabulariesForTest ?? []}
          topicId={topic?.id}
          sx={{}}
        />
      )}
    </TopicDetailWrapper>
  );
};

export default TopicOverview;
