import { ToastifyContext } from '@els/client/app/shared/contexts';
import { BrainIcon, ButtonCustom } from '@els/client/app/shared/ui';
import { Box, Card, Grid, Tooltip, Typography, useTheme } from '@mui/material';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
export interface StatisticalCardsProps {
  myTopic: any;
  vocabulariesMemorized: any;
  vocabulariesVague: any;
  vocabulariesForgot: any;
  handleViewVocabularyList: (data: any) => void
};

const StatisticalCards: FC<StatisticalCardsProps> = ({myTopic, vocabulariesMemorized, vocabulariesVague, vocabulariesForgot, handleViewVocabularyList}) => {
  const theme = useTheme();
  const { toastify } = useContext(ToastifyContext);
  const { t }: { t: any } = useTranslation();
  return (
    <Box
      sx={{
        mt: '-100px',
        px: {
          xs: theme.spacing(2),
          md: theme.spacing(9),
        },
        mb: '28px',
      }}
    > 
      <Grid container rowSpacing={{ xs: 2, md: '20px' }} columnSpacing={{ xs: 2, md: '20px', lg: '60px' }} alignItems="start">
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: '20px',
              mx: 'auto',
              boxShadow: theme.colors.shadows.card,
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
                startIcon={<BrainIcon color="#ffffff" bgcolor={theme.colors.success.main} sx={{ width: '30px', height: '30px' }} />}
                sx={{
                  minWidth: 'unset',
                  width: '60px',
                  height: '60px',
                  mr: theme.spacing(2),
                  boxShadow: theme.colors.shadows.success,
                  pointerEvents: 'none',
                }}
              />
              <Typography
                children={(
                  <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }}>
                    <Typography
                      children={myTopic?.students?.[0]?.summaryMemoryStatus?.memorizedVocabularies?.length}
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        mr: '4px',
                        lineHeight: 1,
                      }}
                    />
                    {' '}
                    <Typography
                      children={t('words')}
                      sx={{
                        fontSize: '28px',
                        fontWeight: 600,
                        color: theme.colors.secondary.main,
                        mr: '16px',
                        lineHeight: 1
                      }}
                    />
                  </Box>
                )}
                sx={{
                  fontSize: '28px',
                  fontWeight: 700,
                  mr: '16px',
                  flex: 1,
                }}
              />
              { !!myTopic?.students?.[0]?.memoryFluctuations?.memorized && (
                <Tooltip arrow placement="top" title={t('Today')}>
                  <Typography
                    children={`+${myTopic?.students?.[0]?.memoryFluctuations?.memorized}`}
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
              children={(
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    children={t('View')}
                    onClick={() => {
                      if (vocabulariesMemorized.length > 0)
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
                                children={myTopic.name}
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
                                children={myTopic.name}
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
                                children={myTopic.name}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                            </Box>
                          ),
                          vocabularies: vocabulariesMemorized,
                          memoryAnalyses: myTopic?.students?.[0]?.memoryAnalyses,
                        });
                      else
                        toastify({ type: 'warning', message: t('No words have been memorized') });
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
              )}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: '20px',
              mx: 'auto',
              boxShadow: theme.colors.shadows.card,
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
                startIcon={<BrainIcon color="#ffffff" bgcolor={theme.colors.warning.main} sx={{ width: '30px', height: '30px' }} />}
                sx={{
                  minWidth: 'unset',
                  width: '60px',
                  height: '60px',
                  mr: theme.spacing(2),
                  boxShadow: theme.colors.shadows.warning,
                  pointerEvents: 'none',
                }}
              />
              <Typography
                children={(
                  <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }}>
                    <Typography
                      children={myTopic?.students?.[0]?.summaryMemoryStatus?.vagueVocabularies?.length}
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        mr: '4px',
                        lineHeight: 1,
                      }}
                    />
                    {' '}
                    <Typography
                      children={t('words')}
                      sx={{
                        fontSize: '28px',
                        fontWeight: 600,
                        color: theme.colors.secondary.main,
                        mr: '16px',
                        lineHeight: 1
                      }}
                    />
                  </Box>
                )}
                sx={{
                  fontSize: '28px',
                  fontWeight: 700,
                  mr: '16px',
                  flex: 1,
                }}
              />
              { !!myTopic?.students?.[0]?.memoryFluctuations?.vague && (
                <Tooltip arrow placement="top" title={t('Since last study')}>
                  <Typography
                    children={`+${myTopic?.students?.[0]?.memoryFluctuations?.vague}`}
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
              children={(
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    children={t('View')}
                    onClick={() => {
                      if (vocabulariesVague.length > 0)
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
                                children={myTopic.name}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                            </Box>
                          ),
                          titleLearning: (
                            <Box>
                              <Typography
                                children={t('View already vague words')}
                                variant="inherit"
                                sx={{
                                  color: theme.colors.secondary.main,
                                  fontSize: '14px',
                                  fontWeight: 700,
                                }}
                              />
                              <Typography
                                children={myTopic.name}
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
                                children={myTopic.name}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                            </Box>
                          ),
                          vocabularies: vocabulariesVague,
                          memoryAnalyses: myTopic?.students?.[0]?.memoryAnalyses,
                        });
                      else
                        toastify({ type: 'warning', message: t('No words have been vague') });
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
                  <Typography children={t('the words you are about to forget')} />
                </Box>
              )}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: '20px',
              mx: 'auto',
              boxShadow: theme.colors.shadows.card,
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
                startIcon={<BrainIcon color="#ffffff" bgcolor={theme.colors.error.main} sx={{ width: '30px', height: '30px' }} />}
                sx={{
                  minWidth: 'unset',
                  width: '60px',
                  height: '60px',
                  mr: theme.spacing(2),
                  boxShadow: theme.colors.shadows.error,
                  pointerEvents: 'none',
                }}
              />
              <Typography
                children={(
                  <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }}>
                    <Typography
                      children={myTopic?.students?.[0]?.summaryMemoryStatus?.forgotVocabularies?.length}
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        mr: '4px',
                        lineHeight: 1,
                      }}
                    />
                    {' '}
                    <Typography
                      children={t('words')}
                      sx={{
                        fontSize: '28px',
                        fontWeight: 600,
                        color: theme.colors.secondary.main,
                        mr: '16px',
                        lineHeight: 1
                      }}
                    />
                  </Box>
                )}
                sx={{
                  fontSize: '28px',
                  fontWeight: 700,
                  mr: '16px',
                  flex: 1,
                }}
              />
              { !!myTopic?.students?.[0]?.memoryFluctuations?.forgot && (
                <Tooltip arrow placement="top" title={t('Since last study')}>
                  <Typography
                    children={`+${myTopic?.students?.[0]?.memoryFluctuations?.forgot}`}
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
              children={(
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    children={t('View')}
                    onClick={() => {
                      if (vocabulariesVague.length > 0)
                        handleViewVocabularyList({
                          title: (
                            <Box>
                              <Typography
                                children={t('Forgot words')}
                                variant="inherit"
                                sx={{
                                  color: theme.colors.secondary.main,
                                  fontSize: '14px',
                                  fontWeight: 700,
                                }}
                              />
                              <Typography
                                children={myTopic.name}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                            </Box>
                          ),
                          titleLearning: (
                            <Box>
                              <Typography
                                children={t('View already forgot words')}
                                variant="inherit"
                                sx={{
                                  color: theme.colors.secondary.main,
                                  fontSize: '14px',
                                  fontWeight: 700,
                                }}
                              />
                              <Typography
                                children={myTopic.name}
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
                                children={myTopic.name}
                                variant="h3"
                                sx={{ fontSize: '18px', fontWeight: 700 }}
                              />
                            </Box>
                          ),
                          vocabularies: vocabulariesForgot,
                          memoryAnalyses: myTopic?.students?.[0]?.memoryAnalyses,
                        });
                      else
                        toastify({ type: 'warning', message: t('No words have been vague') });
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
                  <Typography children={t('the words you have forgotten')} />
                </Box>
              )}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export { StatisticalCards };
