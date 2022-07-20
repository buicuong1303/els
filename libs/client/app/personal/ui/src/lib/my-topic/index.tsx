import { TopicLearningStatusTypes } from '@els/client-app-personal-feature';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import {
  PaginationCustom
} from '@els/client/app/shared/ui';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MyTopicItem } from './my-topic-item';
const BoxFlexCenter = styled(Box)(
  ({ theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
  `
);

interface ShowTopicFormState {
  pageNumber: number;
  limit: number;
}
export interface MyTopicProps {
  handleChangeTopicsLearningStatus: (value: any) => void;
  topicsLearningStatus: TopicLearningStatusTypes;
  topicsLearningStatusTypes: any[];
  showTopicFormState: ShowTopicFormState;
  handleChangeShowTopics: (data: any) => void;
  currentEnrollmentsShow: GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.Enrollment[]>;
  topicPageNumberOptions: number[];
  handleGoToLearningPage: (...rest: any) => void;
  onGoToTopicDetail: (id: string) => void;
  language: string;
  handleViewVocabularyList: (data: any) => void;
  topicListNumberPage: number;
}
const MyTopic: FC<MyTopicProps> = ({
  topicListNumberPage,
  topicPageNumberOptions,
  currentEnrollmentsShow,
  language,
  topicsLearningStatus,
  topicsLearningStatusTypes,
  showTopicFormState,
  onGoToTopicDetail,
  handleGoToLearningPage,
  handleChangeShowTopics,
  handleChangeTopicsLearningStatus,
  handleViewVocabularyList,

}) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  return (
    <Box sx={{ mt: 3.5 }}>
      <Typography
        variant="inherit"
        children={t('Your topics')}
        sx={{
          fontSize: '16px',
          fontWeight: 700,
          mb: 1,
        }}
      />
      <Box
        sx={{
          mx: 'auto',
          boxShadow:
            '0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
          background: theme.colors.alpha.white[100],
          borderRadius: '6px',
        }}
      >
        {/* header */}
        <Box
          sx={{
            p: '20px',
            borderBottom: '1px solid rgba(34, 51, 84, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Tabs
              onChange={(e, value) => handleChangeTopicsLearningStatus(value)}
              value={topicsLearningStatus}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '.MuiTabs-indicator': {
                  boxShadow: 'unset',
                  border: 'unset',
                  bgcolor: theme.colors.alpha.white[100],
                },
              }}
            >
              {topicsLearningStatusTypes.map((tab: any) => (
                <Tab
                  key={tab.value}
                  label={t(tab.label)}
                  value={tab.value}
                  sx={{
                    bgcolor:
                      topicsLearningStatus === tab.value
                        ? theme.colors.primary.main
                        : 'unset',
                    boxShadow:
                      topicsLearningStatus === tab.value
                        ? '0px 1px 4px rgba(25, 117, 255, 0.25), 0px 3px 12px 2px rgba(25, 117, 255, 0.35)'
                        : 'unset',
                    color:
                      topicsLearningStatus === tab.value ? '#ffffff' : 'unset',
                    p: '8px 20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '6px',
                  }}
                />
              ))}
            </Tabs>
          </Box>
          <Box>
            <FormControl
              variant="outlined"
              sx={{
                minWidth: 120,
                fontSize: '12px',
                fontWeight: 500,
                '.MuiInputBase-input': {
                  p: '8px 16px',
                  color: `${theme.colors.primary.main}`,
                },
                '.MuiSvgIcon-root': {
                  color: `${theme.colors.primary.main}`,
                  path: {
                    d: 'path("M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z")',
                  },
                },
              }}
            >
              <InputLabel
                id="number-records-select-label"
                children={t('Records number')}
              />
              <Select
                labelId="number-records-select-label"
                value={showTopicFormState.limit}
                onChange={(e) =>
                  handleChangeShowTopics({
                    pageNumber: 1,
                    limit: Number(e.target.value),
                  })
                }
                label={t('Records number')}
                sx={{
                  p: 0,
                }}
              >
                {topicPageNumberOptions.map((item: any) => {
                  return (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* body */}
        <Box
          sx={{
            borderBottom: '1px solid rgba(34, 51, 84, 0.2)',
          }}
        >
          {currentEnrollmentsShow?.length ? (
            currentEnrollmentsShow.map((item: any, index: number) => {
              return (
                <MyTopicItem 
                  key={index}
                  enrollment={item}
                  index={index}
                  language={language}
                  onGoToTopicDetail={onGoToTopicDetail}
                  handleGoToLearningPage={handleGoToLearningPage}
                  handleViewVocabularyList={handleViewVocabularyList}
                />
              );
            })
          ) : (
            <BoxFlexCenter
              children={t('No records to display')}
              sx={{
                p: theme.spacing(4, 1.5),
              }}
            />
          )}
        </Box>

        {/* footer */}
        {!!currentEnrollmentsShow?.length && (
          <Box
            sx={{
              p: '8px 20px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <PaginationCustom
              variant="text"
              color="primary"
              page={showTopicFormState.pageNumber}
              count={topicListNumberPage}
              shape="rounded"
              onChange={(value) =>
                handleChangeShowTopics({ pageNumber: value })
              }
              sx={{
                '.MuiPaginationItem-text': {
                  '&:hover': {
                    backgroundColor: theme.colors.primary.light,
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export { MyTopic };
