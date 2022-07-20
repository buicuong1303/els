import React, { FC, useContext } from 'react';
import { BrainIcon, ButtonCustom } from '@els/client/app/shared/ui';
import { Box, Card, Grid, Tooltip, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { ToastifyContext } from '@els/client/app/shared/contexts';
export interface StatisticalCardProps {
  currentUser: GraphqlTypes.LearningTypes.User;
  handleViewVocabularyList: (data: any) => void;
  vocabulariesForgot: string[],
  vocabulariesMemorized: string[],
  vocabulariesVague: string[]
}
const StatisticalCard: FC<StatisticalCardProps> = ({ currentUser, handleViewVocabularyList, vocabulariesForgot = [], vocabulariesMemorized = [], vocabulariesVague }) => {
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const { toastify } = useContext(ToastifyContext);
  return (
    <Box
      sx={{
        mt: '-75px',
        px: {
          xs: theme.spacing(2),
          md: theme.spacing(9),
          lg: theme.spacing(16.5),
        },
        mb: '28px',
      }}
    >
      <Grid
        container
        rowSpacing={{ xs: 2, md: '20px' }}
        columnSpacing={{ xs: 2, md: '20px', lg: '110px' }}
        alignItems="start"
      >
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: '20px',
              mx: 'auto',
              boxShadow:
              '0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
            }}
          >
            <Typography
              children={t('Memorized')}
              sx={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                mb: theme.spacing(1),
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: theme.spacing(1),
              }}
            >
              <ButtonCustom
                variant="contained"
                color="success"
                startIcon={
                  <BrainIcon
                    color="#ffffff"
                    bgcolor={theme.colors.success.main}
                    sx={{ width: '30px', height: '30px' }}
                  />
                }
                sx={{
                  cursor: 'unset',
                  minWidth: 'unset',
                  width: '60px',
                  height: '60px',
                  color: 'unset',
                  mr: theme.spacing(2),
                  boxShadow:
                  '0px 1px 4px rgba(68, 214, 0, 0.25), 0px 3px 12px 2px rgba(68, 214, 0, 0.35)',
                  pointerEvents: 'none',
                }}
              />
              <Typography
                children={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'end',
                    }}
                  >
                    <Typography
                      children={
                        currentUser?.summaryMemoryStatus
                          ?.memorizedVocabularies?.length ?? 0
                      }
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        mr: '4px',
                        lineHeight: 1,
                      }}
                    />
                    <Typography
                      children={t('words')}
                      sx={{
                        fontSize: '28px',
                        fontWeight: 600,
                        color: theme.colors.secondary.main,
                        mr: '16px',
                        lineHeight: 1,
                      }}
                    />
                  </Box>
                }
                sx={{
                  fontSize: '28px',
                  fontWeight: 700,
                  mr: '16px',
                }}
              />
              {!!currentUser?.memoryFluctuations?.memorized && (
                <Tooltip arrow placement="top" title={t('Today')}>
                  <Typography
                    children={`+${currentUser?.memoryFluctuations?.memorized}`}
                    sx={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: theme.colors.success.main,
                    }}
                  />
                </Tooltip>
              )}
            </Box>
            <Typography
              children={
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    children={t('View')}
                    onClick={() => {
                      if (vocabulariesMemorized.length > 0)
                        handleViewVocabularyList({
                          title: (
                            <Box>
                              <Typography
                                children={t('Statistical')}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                              <Typography
                                children={t('Memorized words')}
                                variant="inherit"
                                sx={{
                                  color: theme.colors.secondary.main,
                                  fontSize: '14px',
                                  fontWeight: 700,
                                }}
                              />
                            </Box>
                          ),
                          titleLearning: (
                            <Box>
                              <Typography
                                children={t('Vocabulary review')}
                                variant="inherit"
                                sx={{
                                  color: theme.colors.secondary.main,
                                  fontSize: '14px',
                                  fontWeight: 700,
                                }}
                              />
                              <Typography
                                children={t('Memorized words')}
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
                                children={t('Memorized words')}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                            </Box>
                          ),
                          studentId: currentUser.enrollments[0].id,
                          memoryAnalyses: currentUser.memoryAnalyses,
                          vocabularies: vocabulariesMemorized,
                          memoryStatus:
                          GraphqlTypes.LearningTypes.MemoryStatus
                            .Memorized,
                        });
                      else
                        toastify({
                          type: 'warning',
                          message: t('No words have been memorized'),
                        });
                    }}
                    sx={{
                      fontSize: '14px',
                      color: theme.colors.primary.main,
                      fontWeight: 700,
                      cursor: 'pointer',
                      mr: '4px',
                      userSelect: 'none',
                      ':hover': {
                        color: theme.colors.primary.dark,
                      },
                    }}
                  />
                  <Typography children={t('the words you already know')} />
                </Box>
              }
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: '20px',
              mx: 'auto',
              boxShadow:
              '0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
            }}
          >
            <Typography
              children={t('Vague')}
              sx={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                mb: theme.spacing(1),
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: theme.spacing(1),
              }}
            >
              <ButtonCustom
                variant="contained"
                color="warning"
                startIcon={
                  <BrainIcon
                    color="#ffffff"
                    bgcolor={theme.colors.warning.main}
                    sx={{ width: '30px', height: '30px' }}
                  />
                }
                sx={{
                  cursor: 'unset',
                  minWidth: 'unset',
                  width: '60px',
                  height: '60px',
                  color: 'unset',
                  mr: theme.spacing(2),
                  boxShadow:
                  '0px 1px 4px rgba(255, 163, 25, 0.25), 0px 3px 12px 2px rgba(255, 163, 25, 0.35)',
                  pointerEvents: 'none',
                }}
              />
              <Typography
                children={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'end',
                    }}
                  >
                    <Typography
                      children={
                        currentUser?.summaryMemoryStatus?.vagueVocabularies
                          ?.length ?? 0
                      }
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        mr: '4px',
                        lineHeight: 1,
                      }}
                    />{' '}
                    <Typography
                      children={t('words')}
                      sx={{
                        fontSize: '28px',
                        fontWeight: 600,
                        color: theme.colors.secondary.main,
                        mr: '16px',
                        lineHeight: 1,
                      }}
                    />
                  </Box>
                }
                sx={{
                  fontSize: '28px',
                  fontWeight: 700,
                  mr: '16px',
                }}
              />
              {!!currentUser?.memoryFluctuations?.vague && (
                <Tooltip arrow placement="top" title={t('Since last study')}>
                  <Typography
                    children={`+${currentUser?.memoryFluctuations?.vague}`}
                    sx={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: theme.colors.warning.main,
                    }}
                  />
                </Tooltip>
              )}
            </Box>
            <Typography
              children={
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    children={t('View')}
                    onClick={() => {
                      if (vocabulariesVague.length > 0)
                        handleViewVocabularyList({
                          title: (
                            <Box>
                              <Typography
                                children={t('Statistical')}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                              <Typography
                                children={t('Vague words')}
                                variant="inherit"
                                sx={{
                                  color: theme.colors.secondary.main,
                                  fontSize: '14px',
                                  fontWeight: 700,
                                }}
                              />
                            </Box>
                          ),
                          titleLearning: (
                            <Box>
                              <Typography
                                children={t('Vocabulary review')}
                                variant="inherit"
                                sx={{
                                  color: theme.colors.secondary.main,
                                  fontSize: '14px',
                                  fontWeight: 700,
                                }}
                              />
                              <Typography
                                children={t('Vague words')}
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
                                children={t('Vague words')}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                            </Box>
                          ),
                          studentId: currentUser.enrollments[0].id,
                          memoryAnalyses: currentUser.memoryAnalyses,
                          vocabularies: vocabulariesVague,
                          memoryStatus:
                          GraphqlTypes.LearningTypes.MemoryStatus.Vague,
                        });
                      else
                        toastify({
                          type: 'warning',
                          message: t('There are no words to forget'),
                        });
                    }}
                    sx={{
                      fontSize: '14px',
                      color: theme.colors.primary.main,
                      fontWeight: 700,
                      cursor: 'pointer',
                      mr: '4px',
                      userSelect: 'none',
                      ':hover': {
                        color: theme.colors.primary.dark,
                      },
                    }}
                  />
                  <Typography
                    children={t('the words you are about to forget')}
                  />
                </Box>
              }
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: '20px',
              mx: 'auto',
              boxShadow:
              '0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
            }}
          >
            <Typography
              children={t('Forgotten')}
              sx={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                mb: theme.spacing(1),
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: theme.spacing(1),
              }}
            >
              <ButtonCustom
                variant="contained"
                color="error"
                startIcon={
                  <BrainIcon
                    color="#ffffff"
                    bgcolor={theme.colors.error.main}
                    sx={{ width: '30px', height: '30px' }}
                  />
                }
                sx={{
                  cursor: 'unset',
                  minWidth: 'unset',
                  width: '60px',
                  height: '60px',
                  color: 'unset',
                  mr: theme.spacing(2),
                  boxShadow:
                  '0px 1px 4px rgba(255, 25, 67, 0.25), 0px 3px 12px 2px rgba(255, 25, 67, 0.35)',
                  pointerEvents: 'none',
                }}
              />
              <Typography
                children={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'end',
                    }}
                  >
                    <Typography
                      children={
                        currentUser?.summaryMemoryStatus?.forgotVocabularies
                          ?.length ?? 0
                      }
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        mr: '4px',
                        lineHeight: 1,
                      }}
                    />{' '}
                    <Typography
                      children={t('words')}
                      sx={{
                        fontSize: '28px',
                        fontWeight: 600,
                        color: theme.colors.secondary.main,
                        mr: '16px',
                        lineHeight: 1,
                      }}
                    />
                  </Box>
                }
                sx={{
                  fontSize: '28px',
                  fontWeight: 700,
                  mr: '16px',
                }}
              />
              {!!currentUser?.memoryFluctuations?.forgot && (
                <Tooltip arrow placement="top" title={t('Since last study')}>
                  <Typography
                    children={`+${currentUser?.memoryFluctuations?.forgot}`}
                    sx={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: theme.colors.error.main,
                    }}
                  />
                </Tooltip>
              )}
            </Box>
            <Typography
              children={
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    children={t('View')}
                    onClick={() => {
                      if (vocabulariesForgot.length > 0)
                        handleViewVocabularyList({
                          title: (
                            <Box>
                              <Typography
                                children={t('Statistical')}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                              <Typography
                                children={t('Forgotten words')}
                                variant="inherit"
                                sx={{
                                  color: theme.colors.secondary.main,
                                  fontSize: '14px',
                                  fontWeight: 700,
                                }}
                              />
                            </Box>
                          ),
                          titleLearning: (
                            <Box>
                              <Typography
                                children={t('Vocabulary review')}
                                variant="inherit"
                                sx={{
                                  color: theme.colors.secondary.main,
                                  fontSize: '14px',
                                  fontWeight: 700,
                                }}
                              />
                              <Typography
                                children={t('Forgotten words')}
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
                                children={t('Forgotten words')}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                            </Box>
                          ),
                          studentId: currentUser.enrollments[0].id,
                          memoryAnalyses: currentUser.memoryAnalyses,
                          vocabularies: vocabulariesForgot,
                          memoryStatus:
                          GraphqlTypes.LearningTypes.MemoryStatus.Forgot,
                        });
                      else
                        toastify({
                          type: 'warning',
                          message: t('No words have been forgotten'),
                        });
                    }}
                    sx={{
                      fontSize: '14px',
                      color: theme.colors.primary.main,
                      fontWeight: 700,
                      cursor: 'pointer',
                      mr: '4px',
                      userSelect: 'none',
                      ':hover': {
                        color: theme.colors.primary.dark,
                      },
                    }}
                  />
                  <Typography
                    children={t('the words you have forgotten')}
                  />
                </Box>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export { StatisticalCard } ;