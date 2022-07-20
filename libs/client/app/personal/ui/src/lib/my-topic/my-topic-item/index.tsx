import React, { FC, useContext, useEffect, useState } from 'react';
import { Box, styled, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import {
  ArrowUpIcon,
  BreadcrumbsCustom,
  ButtonCustom,
  TimeIcon,
} from '@els/client/app/shared/ui';
import moment from 'moment';
import { ToastifyContext } from '@els/client/app/shared/contexts';
const BoxFlexCenter = styled(Box)(
  ({ theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
  `
);
const TypographyAllWordNumber = styled(Typography)(
  ({ theme }) => `
    width: fit-content;
    min-width: 60px;
    height: 60px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 30px;
    font-size: 24px;
    font-weight: 600;
    // background-color: ${theme.colors.primary.main};
    color: ${theme.colors.primary.main};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
  `
);

const TypographyWordNumber = styled(Typography)(
  ({ theme }) => `
    width: fit-content;
    min-width: 24px;
    height: 24px;
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 400;
    background-color: ${theme.colors.secondary.lighter};
    color: ${theme.colors.secondary.light};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1;
  `
);

export interface MyTopicItemProps {
  enrollment: GraphqlTypes.LearningTypes.Enrollment;
  index: number;
  language: string;
  onGoToTopicDetail: (id: string) => void;
  handleGoToLearningPage: (...rest: any) => void;
  handleViewVocabularyList: (data: any) => void;
}
const MyTopicItem: FC<MyTopicItemProps> = ({
  enrollment,
  index,
  language,
  onGoToTopicDetail,
  handleGoToLearningPage,
  handleViewVocabularyList,
}) => {
  console.log(enrollment.memoryAnalyses);
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const { toastify } = useContext(ToastifyContext);
  const [format, setFormat] = useState('Do MMMM, YYYY');
  useEffect(() => {
    language === 'vi' ? setFormat('Do MMMM, YYYY') : setFormat('MMMM Do, YYYY');
  }, [language]);
  return (
    <BoxFlexCenter
      sx={{
        justifyContent: 'space-between',
        borderTop: index > 0 ? '1px solid rgba(34, 51, 84, 0.1)' : 'unset',
        p: theme.spacing(1, 2.5),
      }}
    >
      <BoxFlexCenter>
        {/* thumbnail */}
        <Box
          sx={{
            width: '220px',
            height: '135px',
            backgroundImage: `url(${
              enrollment.topic.thumbnailUri
                ? enrollment.topic.thumbnailUri
                : '/images/source/topic/image-not-available.png'
            }), url('/images/source/topic/image-not-available.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '6px',
            mr: '20px',
            cursor: 'pointer',
            transition: 'all 0.6s',
            '&:hover': {
              transition: 'all 0.3s',
              transform: 'scale(1.1)',
            },
          }}
          onClick={() => onGoToTopicDetail(enrollment.id)}
        />
        {/* information */}
        <Box>
          <BreadcrumbsCustom
            breadcrumbsList={[
              {
                title: enrollment.topic.specialization?.category?.name,
                onClick: () =>
                  handleGoToLearningPage(
                    enrollment.topic.specialization?.category?.id ?? '#',
                    '#'
                  ),
              },
              {
                title: enrollment.topic.specialization?.name,
                onClick: () =>
                  handleGoToLearningPage(
                    enrollment.topic.specialization?.category?.id ?? '#',
                    enrollment.topic.specialization?.name ?? '#'
                  ),
              },
            ]}
            sx={{
              mb: 0,
            }}
          />

          <Typography
            children={enrollment.topic.name}
            variant="h3"
            sx={{
              mt: 1,
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: '32.81px',
              color: theme.colors.primary.main,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => onGoToTopicDetail(enrollment.id)}
          />

          <Box sx={{ display: 'flex', mt: 1.5 }}>
            <Typography
              children={
                enrollment.isCompleted ? (
                  <Box>
                    {`${moment(enrollment.createdAt).format(format)} -
                    ${moment(
                    enrollment.lastActivityAt ?? enrollment.createdAt
                  ).format(format)}`}
                  </Box>
                ) : (
                  <Box>{moment(enrollment.createdAt).format(`${format}`)}</Box>
                )}
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.colors.alpha.black[50],
              }}
            />
          </Box>
          <ButtonCustom
            variant="text"
            color="info"
            startIcon={
              <BoxFlexCenter
                {...enrollment.isCompleted ? {
                  sx: {
                    width: '28px',
                    height: '28px',
                    backgroundColor: theme.colors.success.lighter,
                    borderRadius: '50%',
                  },
                  children: <ArrowUpIcon width="16px" height="16px" />,
                } : {
                  sx: {
                    width: '28px',
                    height: '28px',
                    backgroundColor: theme.colors.info.lighter,
                    borderRadius: '50%',
                  },
                  children: <TimeIcon width="16px" height="16px" />,
                }}
              />
            }
            {...enrollment.isCompleted ? {
              children: t('Accomplished'),
              sx: {
                color: theme.colors.success.dark,
                pointerEvents: 'none',
                p: 0,
                mt: 1,
                fontSize: '12px',
                fontWeight: 400,
              }
            } : {
              children: t('Learning'),
              sx: {
                color: theme.colors.info.dark,
                pointerEvents: 'none',
                p: 0,
                mt: 1,
                fontSize: '12px',
                fontWeight: 400,
              }
            }}

          />
        </Box>
      </BoxFlexCenter>

      <BoxFlexCenter>
        <table>
          <tbody>
            <tr>
              <td>
                <TypographyAllWordNumber
                  children={enrollment.topic.vocabularies?.length ?? 0}
                />
              </td>
              <td style={{ minWidth: '180px' }}>
                <table style={{ borderSpacing: '8px' }}>
                  <tbody>
                    <tr>
                      <td>
                        <TypographyWordNumber
                          children={
                            enrollment.summaryMemoryStatus?.newVocabularies
                              ?.length ?? 0
                          }
                        />
                      </td>
                      <td>
                        <Typography
                          children={t('Unlearned words')}
                          sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: theme.colors.secondary.light,
                            cursor: 'pointer',
                            '&:hover': {
                              color: theme.colors.primary.main,
                            },
                          }}
                          onClick={() => {
                            if (
                              enrollment.summaryMemoryStatus?.newVocabularies
                                ?.length
                            )
                              handleViewVocabularyList({
                                title: (
                                  <Box>
                                    <Typography
                                      children={t('Unlearned words')}
                                      variant="inherit"
                                      sx={{
                                        color: theme.colors.secondary.main,
                                        fontSize: '14px',
                                        fontWeight: 700,
                                      }}
                                    />
                                    <Typography
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
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
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
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
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
                                    />
                                  </Box>
                                ),
                                vocabularies:
                                  enrollment.summaryMemoryStatus
                                    ?.newVocabularies,
                                memoryAnalyses: enrollment.memoryAnalyses,
                                memoryStatus:
                                  GraphqlTypes.LearningTypes.MemoryStatus.New,
                                myTopic: enrollment.topic,
                                studentId: enrollment.id,
                              });
                            else
                              toastify({
                                type: 'warning',
                                message: t('No new words'),
                              });
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <TypographyWordNumber
                          children={
                            enrollment.summaryMemoryStatus?.forgotVocabularies
                              ?.length ?? 0
                          }
                        />
                      </td>
                      <td>
                        <Typography
                          children={t('Forgotten words')}
                          sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: theme.colors.secondary.light,
                            cursor: 'pointer',
                            '&:hover': {
                              color: theme.colors.primary.main,
                            },
                          }}
                          onClick={() => {
                            if (
                              enrollment.summaryMemoryStatus?.forgotVocabularies
                                ?.length
                            )
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
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
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
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
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
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
                                    />
                                  </Box>
                                ),
                                vocabularies:
                                  enrollment.summaryMemoryStatus
                                    ?.forgotVocabularies,
                                memoryAnalyses: enrollment.memoryAnalyses,
                                memoryStatus:
                                  GraphqlTypes.LearningTypes.MemoryStatus
                                    .Forgot,
                                myTopic: enrollment.topic,
                                studentId: enrollment.id,
                              });
                            else
                              toastify({
                                type: 'warning',
                                message: t('No words have been forgotten'),
                              });
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <TypographyWordNumber
                          children={
                            enrollment.summaryMemoryStatus?.vagueVocabularies
                              ?.length ?? 0
                          }
                        />
                      </td>
                      <td>
                        <Typography
                          children={t('Vague words')}
                          sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: theme.colors.secondary.light,
                            cursor: 'pointer',
                            '&:hover': {
                              color: theme.colors.primary.main,
                            },
                          }}
                          onClick={() => {
                            if (
                              enrollment.summaryMemoryStatus?.vagueVocabularies
                                ?.length
                            )
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
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
                                    />
                                  </Box>
                                ),
                                titleLearning: (
                                  <Box>
                                    <Typography
                                      children={t(
                                        'Review about to forget words'
                                      )}
                                      variant="inherit"
                                      sx={{
                                        color: theme.colors.secondary.main,
                                        fontSize: '14px',
                                        fontWeight: 700,
                                      }}
                                    />
                                    <Typography
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
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
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
                                    />
                                  </Box>
                                ),
                                vocabularies:
                                  enrollment.summaryMemoryStatus
                                    ?.vagueVocabularies,
                                memoryAnalyses: enrollment.memoryAnalyses,
                                memoryStatus:
                                  GraphqlTypes.LearningTypes.MemoryStatus.Vague,
                                myTopic: enrollment.topic,
                                studentId: enrollment.id,
                              });
                            else
                              toastify({
                                type: 'warning',
                                message: t('There are no words to forget'),
                              });
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <TypographyWordNumber
                          children={
                            enrollment.summaryMemoryStatus
                              ?.memorizedVocabularies?.length ?? 0
                          }
                        />
                      </td>
                      <td>
                        <Typography
                          children={t('Memorized words')}
                          sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: theme.colors.secondary.light,
                            cursor: 'pointer',
                            '&:hover': {
                              color: theme.colors.primary.main,
                            },
                          }}
                          onClick={() => {
                            if (
                              enrollment.summaryMemoryStatus
                                ?.memorizedVocabularies?.length
                            )
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
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
                                    />
                                  </Box>
                                ),
                                titleLearning: (
                                  <Box>
                                    <Typography
                                      children={t(
                                        'Review already memorized words'
                                      )}
                                      variant="inherit"
                                      sx={{
                                        color: theme.colors.secondary.main,
                                        fontSize: '14px',
                                        fontWeight: 700,
                                      }}
                                    />
                                    <Typography
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
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
                                      children={enrollment.topic.name}
                                      variant="h3"
                                      sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                      }}
                                    />
                                  </Box>
                                ),
                                vocabularies:
                                  enrollment.summaryMemoryStatus
                                    ?.memorizedVocabularies,
                                memoryAnalyses: enrollment.memoryAnalyses,
                                memoryStatus:
                                  GraphqlTypes.LearningTypes.MemoryStatus
                                    .Memorized,
                                myTopic: enrollment.topic,
                                studentId: enrollment.id,
                              });
                            else
                              toastify({
                                type: 'warning',
                                message: t('No words have been memorized'),
                              });
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </BoxFlexCenter>
    </BoxFlexCenter>
  );
};

export { MyTopicItem };
