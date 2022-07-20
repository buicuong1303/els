import React, { FC } from 'react';
import { Box, Card, Divider, LinearProgress, Tooltip, Typography, useTheme } from '@mui/material';
import { BookIcon, ButtonCustom, LabelCustom, LearningIcon, TestIcon, ViewIcon } from '@els/client/app/shared/ui';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Timeline from '@mui/lab/Timeline';
import { cloneDeep, orderBy } from 'lodash';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { GraphqlTypes } from '@els/client/app/shared/data-access';

export interface LessonsProps {
  myTopic: any;
  handleTest: (data: any) => void;
  handleLearning: (data: any) => void;
  handleViewVocabularyList: (data: any) => void;
}

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
    flex-grow: 1;
    height: 6px;
    
    &.MuiLinearProgress-root {
      background-color: ${theme.colors.alpha.black[10]};
    }
    
    .MuiLinearProgress-bar {
      border-radius: ${theme.general.borderRadiusXl};
    }
  `
);
const TimelineWrapper = styled(Timeline)(
  ({ theme }) => `
    margin-left: ${theme.spacing(2)};
    overflow: auto;
    height: 100%;
    // max-height: 300px; // scroll in lesson card
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
const Lessons: FC<LessonsProps> = ({ myTopic, handleTest, handleLearning, handleViewVocabularyList }) => {
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: '100%',
        height: 0,
      }}
    >
      <Card
        sx={{
          boxShadow: theme.colors.shadows.card,
          display: 'flex',
          flexDirection: 'column',
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
        <TimelineWrapper>
          {
            myTopic?.lessons?.length
              ? myTopic?.lessons?.map((lesson: any, index: number) => {
                const vocabularyNumber = lesson.vocabularies.length;
                const memoryAnalyses = myTopic?.students?.[0]?.memoryAnalyses;
                const memoriedVocabularies =
                      !memoryAnalyses
                        ? []
                        : cloneDeep(lesson.vocabularies).filter(
                          (item: any) => memoryAnalyses?.[memoryAnalyses?.findIndex(
                            (memoryAnalyse: any) => memoryAnalyse.vocabulary.id === item.id
                          ) ?? -1]?.memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Memorized
                        );
                return (
                  <TimelineItem sx={{ p: 0 }} key={lesson.id}>
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
                            flex: 1,
                            py: '12px',
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
                              minWidth: '150px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography children={lesson.name} sx={{ fontSize: '13px', fontWeight: 700 }} />
                            <Typography children={`${lesson?.vocabularies?.length} ${t('Vocabulary')}`} sx={{ fontSize: '13px' }} /> 
                          </Box>
                          <Box sx={{ mr: theme.spacing(2), flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
                            <Box sx={{ mb: 0.5 }}>
                              {orderBy(lesson.vocabularies, item => item.vocabulary.toLowerCase(), 'asc').map((item, index: number) => {
                                const memoryStatus = !memoryAnalyses ? undefined : memoryAnalyses[memoryAnalyses?.findIndex((memoryAnalyse:any) => memoryAnalyse.vocabulary.id === item.id) ?? -1]?.memoryStatus;

                                return (
                                  <LabelCustom
                                    key={index}
                                    children={item.vocabulary}
                                    color={
                                      memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Memorized
                                        ? 'success'
                                        : memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Vague
                                          ? 'warning'
                                          : memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Forgot
                                            ? 'error'
                                            : 'default'
                                    }
                                    sx ={{
                                      mr: theme.spacing(1),
                                      p: '3px 12px',
                                      borderRadius: '22px',
                                      fontSize: '10px',
                                      mb: '4px',
                                      fontWeight: 700,
                                      backgroundColor: memoryStatus ?? `${theme.colors.secondary.light} !important`,
                                      color:
                                            memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Memorized
                                              ? theme.colors.success.dark
                                              : memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Vague
                                                ? theme.colors.warning.dark
                                                : memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Forgot
                                                  ? theme.colors.error.dark
                                                  : '#ffffff',
                                    }}
                                  />
                                );
                              })}
                            </Box>
                            <Box>
                              <LinearProgressWrapper
                                value={memoriedVocabularies.length > 0 ? Math.floor((memoriedVocabularies.length / vocabularyNumber) * 100) : 0}
                                color="primary"
                                variant="determinate"
                              />
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Tooltip key={Math.random()} arrow placement="top" title={t('Test')}>
                              <Box>
                                <ButtonCustom
                                  variant="contained" color="primary" startIcon={<TestIcon />}
                                  onClick={() => {
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
                                            children={lesson.name}
                                            variant="h3"
                                            sx={{ fontSize: '18px', fontWeight: 700 }}
                                          />
                                        </Box>
                                      ),
                                      vocabularies: lesson.vocabularies,
                                      studentId: myTopic?.students?.[0]?.id,
                                    });
                                  }}
                                  sx={{ minWidth: 'unset', width: '44px', height: '44px', mr: theme.spacing(1) }}
                                  rest={{
                                    disabled: vocabularyNumber === 0
                                  }}
                                />
                              </Box>
                            </Tooltip>
                            <Tooltip key={Math.random()} arrow placement="top" title={t('Learn')}>
                              <Box>
                                <ButtonCustom
                                  variant="contained" color="primary" startIcon={<LearningIcon />}
                                  onClick={() => {
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
                                            children={lesson.name}
                                            variant="h3"
                                            sx={{ fontSize: '18px', fontWeight: 700 }}
                                          />
                                        </Box>
                                      ),
                                      memoryAnalyses: myTopic?.students?.[0]?.memoryAnalyses,
                                      studentId: myTopic?.students?.[0]?.id,
                                      currentLessonId: lesson.id,
                                      showLessonList: true,
                                    });
                                  }}
                                  sx={{ minWidth: 'unset', width: '44px', height: '44px', mr: theme.spacing(1) }}
                                  rest={{
                                    disabled: vocabularyNumber === 0
                                  }}
                                />
                              </Box>
                            </Tooltip>
                            <Tooltip key={Math.random()} arrow placement="top" title={t('View')}>
                              <Box>
                                <ButtonCustom
                                  variant="contained" color="primary" startIcon={<ViewIcon />}
                                  onClick={() => {
                                    handleViewVocabularyList({
                                      title: (
                                        <Box display="flex">
                                          <Typography
                                            children={`${myTopic.name} /`}
                                            variant="inherit"
                                            sx={{ fontSize: '16px', fontWeight: 700 }}
                                          />
                                              &nbsp;
                                          <Typography
                                            children={lesson.name}
                                            variant="h3"
                                            sx={{ fontSize: '16px', fontWeight: 700, color: theme.colors.primary.main }}
                                          />
                                        </Box>
                                      ),
                                      titleLearning: (
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
                                            children={lesson.name}
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
                                            children={lesson.name}
                                            variant="h3"
                                            sx={{ fontSize: '18px', fontWeight: 700 }}
                                          />
                                        </Box>
                                      ),
                                      vocabularies: lesson.vocabularies.map((v: any) => v.id),
                                      memoryAnalyses: myTopic?.students?.[0]?.memoryAnalyses,
                                      currentLessonId: lesson.id
                                    });
                                  }}
                                  sx={{ minWidth: 'unset', width: '44px', height: '44px', mr: theme.spacing(1) }}
                                  rest={{
                                    disabled: vocabularyNumber === 0
                                  }}
                                />
                              </Box>
                            </Tooltip>
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
  );
};

export { Lessons };