/* eslint-disable @typescript-eslint/no-empty-interface */
// next, react
import { useRouter } from 'next/router';
import { FC, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

// material
import {
  Box, Typography,
  useTheme
} from '@mui/material';

import { styled } from '@mui/material/styles';

// other
import { useLazyQuery, useQuery } from '@apollo/client';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

// custom context
import { ToastifyContext } from '@els/client/app/shared/contexts';

// interface
import { GraphqlQueries, GraphqlTypes, HandleLearningType, HandleTestType, HandleViewType } from '@els/client/app/shared/data-access';

// until

// ui
import {
  BreadcrumbsCustom, BreadcrumbsItem, LabelCustom,
  LearningIcon, LineChartProps, Loading
} from '@els/client/app/shared/ui';
import {
  LearningPage, Lessons,
  PanelSkills, StatisticalCards, TestPage,
  ViewWordList
} from '@els/client/app/topic/ui';

// apollo client
import { ApolloClient } from '@els/client/shared/data-access';
import { getDayAndMonth, getWeekday } from '@els/client/shared/utils';

const TopicDetailWrapper = styled(Box)(
  () => `
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

const BoxWrapper = styled(Box)(
  () => `
    height: 0;
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

const LabelCustomWrapper = styled(LabelCustom)(
  ({ theme }) => `
    color: #ffffff !important;
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    border-radius: 22px;
    padding: ${theme.spacing(2)};
  `
);


export enum SkillTypes {
  Listening = 'Listening',
  Speaking = 'Speaking',
  Reading = 'Reading',
  Writing = 'Writing',
}

export enum DateOptionLabels {
  Week = 'The last seven days',
  Month = 'A recent month',
  Year = 'A recent year',
}

export enum DateOptionValues {
  'recently' = 'recently',
  '30_days_ago' = '30_days_ago',
  'one_year_ago' = 'one_year_ago',
}

export interface SeriesTypes {
  name: string,
  data: number[],
  color: string,
}

export interface ChartStateTypes {
  options: any,
  series: SeriesTypes[],
}

export interface TopicDetailProps {}

export interface ChartMemoProps {
  options: any;
  series: any[];
  type: LineChartProps['type'];
  height: string;
}

const skillTypes = [
  { label: SkillTypes.Listening, value: SkillTypes.Listening },
  { label: SkillTypes.Speaking, value: SkillTypes.Speaking },
  { label: SkillTypes.Reading, value: SkillTypes.Reading },
  { label: SkillTypes.Writing, value: SkillTypes.Writing },
];

const dateOptions = [
  { label: DateOptionLabels.Week, value: DateOptionValues.recently },
  { label: DateOptionLabels.Month, value: DateOptionValues['30_days_ago'] },
  { label: DateOptionLabels.Year, value: DateOptionValues.one_year_ago },
];

const handleTestVocabularies = (data: HandleTestType)=>{
  if(!data.options?.memoryStatus){
    if(data.vocabularies){
      return data.vocabularies;
    }
    return [];
  }
  return cloneDeep(data.vocabularies ?? []).filter(
    item =>
      data.memoryAnalyses?.findIndex(
        memoryAnalyse =>
          memoryAnalyse.vocabulary.id === item.id && memoryAnalyse.memoryStatus === data.options?.memoryStatus
      ) !== -1
  );
};

export const TopicDetail: FC<TopicDetailProps> = () => {
  const theme = useTheme();
  const {i18n} = useTranslation();
  const { t }: { t: any } = useTranslation();
  const getLanguage = i18n.language;

  const router = useRouter();

  const { toastify } = useContext(ToastifyContext);

  // * page ref
  const dateOptionRef = useRef<any>();
  const currentLanguageRef = useRef<any>();

  // * page state
  const chartFormStateInit = {
    skill: SkillTypes.Listening,
    dateOption: DateOptionValues.recently,
  };
  const [chartFormState, setChartFormState] = useState<{ skill: SkillTypes, dateOption: DateOptionValues}>(chartFormStateInit);

  const chartStateInit = {
    options: {
      chart: {
        id: 'apexchart-line',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: [3]
      },
      xaxis: {
        categories: [],
        offsetX: 10,
        labels: {
          rotate: -1,
          rotateAlways: true,
          hideOverlappingLabels: false,
          showDuplicates: true,
        },
      },
    },
    series: [{
      name: '',
      data: [],
      color: theme.colors.primary.main,
    }],
  };
  const [chartState, setChartState] = useState<any>(chartStateInit);

  const chartStateMemo = useMemo(() => chartState, [chartState]);

  const [actualSkillHistoryData, setActualSkillHistoryData] = useState<any[]>([]);
  
  const [memoryAnalyses, setMemoryAnalyses] = useState<GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.MemoryAnalysis[]>>([]);
  const [summarySkill, setSummarySkill] = useState<{ listening: number, speaking: number, reading: number, writing: number }>({ listening: 0, speaking: 0, reading: 0, writing: 0 });
  const [showLessonList, setShowLessonList] = useState<boolean>();
  
  const [currentLessonId, setCurrentLessonId] = useState<string>();
  const [currentVocabulariesForView, setCurrentVocabulariesForView] = useState<string[]>();
  const [currentVocabulariesForLearning, setCurrentVocabulariesForLearning] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>();
  const [currentVocabulariesForTest, setCurrentVocabulariesForTest] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>();
  
  const [vocabulariesMemorized, setVocabulariesMemorized] = useState<string[]>([]);
  const [vocabulariesVague, setVocabulariesVague] = useState<string[]>([]);
  const [vocabulariesForgot, setVocabulariesForgot] = useState<string[]>([]);

  // * view vocabulary list
  const [vocabularyListTitle, setVocabularyListTitle] = useState<ReactNode>();
  const [vocabularyListSubTitle, setVocabularyListSubTitle] = useState<ReactNode>();
  const [vocabularyListTitleLearning, setVocabularyListTitleLearning] = useState<ReactNode>();
  const [vocabularyListSubTitleLearning, setVocabularyListSubTitleLearning] = useState<ReactNode>();
  const [vocabularyListTitleTest, setVocabularyListTitleTest] = useState<ReactNode>();
  const [vocabularyListSubTitleTest, setVocabularyListSubTitleTest] = useState<ReactNode>();
  const [openVocabularyList, setOpenVocabularyList] = useState<boolean>(false);


  const handleViewVocabularyList = (data: HandleViewType) => {
    setVocabularyListTitle(data.title);
    setVocabularyListSubTitle(data.subtitle);
    setVocabularyListTitleLearning(data.titleLearning);
    setVocabularyListSubTitleLearning(data.subtitleLearning);
    setVocabularyListTitleTest(data.titleTest);
    setVocabularyListSubTitleTest(data.subtitleTest);
    setCurrentVocabulariesForView(data.vocabularies);
    setMemoryAnalyses(data.memoryAnalyses ?? []);
    setOpenVocabularyList(true);
    setCurrentLessonId(data.currentLessonId);
  };
  // * learning page
  const [learningPageTitle, setLearningPageTitle] = useState<ReactNode>('');
  const [learningPageSubTitle, setLearningPageSubTitle] = useState<ReactNode>('');
  const [openLessonReview, setOpenLessonReview] = useState<boolean>(false);
  const handleLearning = (data: HandleLearningType) => {
    setLearningPageTitle(data.title);
    setLearningPageSubTitle(data.subtitle);
    setMemoryAnalyses(data.memoryAnalyses ?? []);
    setShowLessonList(data.showLessonList);
    setCurrentVocabulariesForLearning(data.vocabularies);
    setCurrentLessonId(data.currentLessonId);
    setOpenLessonReview(true);
    setOpenVocabularyList(false);
  };

  
  // * test page
  const [testPageTitle, setTestPageTitle] = useState<ReactNode>('');
  const [testPageSubTitle, setTestPageSubTitle] = useState<ReactNode>('');
  const [openTestPage, setOpenTestPage] = useState<boolean>(false);
  
  const handleTest = (data: HandleTestType) => {
    setTestPageTitle(data.title);
    setTestPageSubTitle(data.subtitle);
    
    const testVocabularies = handleTestVocabularies(data);
    setCurrentVocabulariesForTest(testVocabularies);

    setOpenTestPage(true);
    setOpenVocabularyList(false);
  };

  // * get data
  const { data: myTopicResponse, loading: myTopicLoading, error: myTopicError } = useQuery<{ myTopicDetails: GraphqlTypes.LearningTypes.Topic[] }>(
    GraphqlQueries.LearningQueries.Topic.GetMyTopicDetails,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      variables: {
        studentIds: [router.query.id],
        includeVocabularyInfo: true,
        includeLessonInfo: true,
        includeCategoryInfo: true

      },
      fetchPolicy: 'network-only',
    },
  );
  const myTopic = myTopicResponse?.myTopicDetails?.[0];

  const [GetActualSkillHistory] = useLazyQuery(GraphqlQueries.LearningQueries.Topic.GetActualSkillHistory, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      const newActualSkillHistoryData: any[] = data?.topic?.getActualSkillHistory?.data ?? [];

      setActualSkillHistoryData(newActualSkillHistoryData);
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
  });

  

  // * breadcrumb
  const breadcrumbsList: BreadcrumbsItem[] = [
    {
      title: myTopic?.specialization?.category?.name,
      onClick: () => handleGoToLearningPage(myTopic?.specialization?.category?.id, '')
    },
    {
      title: myTopic?.specialization?.name,
      onClick: () => handleGoToLearningPage(myTopic?.specialization?.category?.id, myTopic?.specialization?.name)
    },
    {
      title: myTopic?.name,
      color: theme.colors.primary.main,
    },
  ];

  // change chart skill
  const handleChangeChartSkill = (value: SkillTypes) => {
    setChartFormState({
      ...chartFormState,
      skill: value,
    });
  };

  // change chart skill
  const handleChangeDateOption = (event: any) => {
    const value = event.target.value;

    setChartFormState({
      ...chartFormState,
      dateOption: value,
    });
  };

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

  useEffect(() => {
    if (myTopic?.students?.[0]?.id) {
      GetActualSkillHistory({
        variables: {
          period: chartFormState.dateOption,
          skill: chartFormState.skill.toLowerCase(),
          studentId: myTopic?.students?.[0]?.id,
        }
      });
    }

    dateOptionRef.current = chartFormState.dateOption;
  }, [myTopic, chartFormState, GetActualSkillHistory]);


  useEffect(() => {
    setVocabulariesMemorized(myTopic?.students?.[0]?.summaryMemoryStatus?.memorizedVocabularies || []);
    setVocabulariesVague(myTopic?.students?.[0]?.summaryMemoryStatus?.vagueVocabularies || []);
    setVocabulariesForgot(myTopic?.students?.[0]?.summaryMemoryStatus?.forgotVocabularies || []); 
  }, [myTopic]);

  const totalSkills = (skill:any)=>{
    const total = {
      good: 0,
      medium: 0,
      bad: 0,
      ...skill
    };
    return total.good + total.medium + total.bad;
  };
  const summarySkillMyTopic = (total:any, skill:any) =>{
    if(total>0){
      return skill/total;
    }
    return 0;
  };

  useEffect(() => {
    const totalListening = totalSkills(myTopic?.students?.[0]?.summarySkill?.listening);
    const totalSpeaking = totalSkills(myTopic?.students?.[0]?.summarySkill?.speaking);
    const totalReading = totalSkills(myTopic?.students?.[0]?.summarySkill?.reading);
    const totalWriting = totalSkills(myTopic?.students?.[0]?.summarySkill?.writing);
    setSummarySkill({
      listening: summarySkillMyTopic(totalListening, myTopic?.students?.[0]?.summarySkill?.listening?.good * 100),
      speaking: summarySkillMyTopic(totalSpeaking, myTopic?.students?.[0]?.summarySkill?.speaking?.good * 100),
      reading: summarySkillMyTopic(totalReading, myTopic?.students?.[0]?.summarySkill?.reading?.good * 100),
      writing: summarySkillMyTopic(totalWriting, myTopic?.students?.[0]?.summarySkill?.writing?.good * 100),
    });
  }, [myTopic]);

  useEffect(() => {
    if (actualSkillHistoryData) {
      const newChartState: any = cloneDeep(chartStateInit);

      newChartState.options.xaxis.type = dateOptionRef.current === DateOptionValues['recently'] ? 'category' : 'datetime';
      
      newChartState.options.xaxis.tickAmount = dateOptionRef.current === DateOptionValues['30_days_ago'] ? 10 : 12;

      newChartState.options.xaxis.categories = cloneDeep(actualSkillHistoryData).map((item: any) => item.label);

      newChartState.options.xaxis.labels = {
        ...newChartState.options.xaxis.labels,
        
        formatter: (value: any) => {
          return dateOptionRef.current === DateOptionValues['recently']
            ? t(getWeekday(new Date(value)))
            : t(getDayAndMonth(new Date(value), currentLanguageRef.current, 'DD/MM'));
        }
      };

      if (dateOptionRef.current !== DateOptionValues['recently']) {
        newChartState.options.xaxis.tooltip = {
          formatter: (value: any) => {
            return dateOptionRef.current === DateOptionValues['recently']
              ? t(getWeekday(new Date(value)))
              : t(getDayAndMonth(new Date(value), currentLanguageRef.current, 'Do MMMM'));
          }
        };
      }

      newChartState.series[0].name = t(chartFormState.skill);
      
      newChartState.series[0].data = cloneDeep(actualSkillHistoryData).map((item: any) => item.value);

      // TODO for test
      // newChartState.series[0].data = cloneDeep(actualSkillHistoryData).map((item: any) => Math.round(Math.random() * 100));
      // TODO end for test

      setChartState(newChartState);
    }
  }, [actualSkillHistoryData, getLanguage]);

  useEffect(() => {
    currentLanguageRef.current = getLanguage;
  }, [getLanguage]);

  // * render loading
  if (myTopicLoading) return <Loading bgColor={theme.palette.background.default}/>;

  // * notify error
  if (myTopicError) toastify({ type: 'error', message: myTopicError.message });

  // * check data
  if (!myTopic) return <Loading />;

  const boxBackground = ()=>{
    if(myTopic?.thumbnailUri){
      return {
        backgroundImage : myTopic?.thumbnailUri,
        backgroundPositionY :'center',
        backgroundSize: 'cover'
      };
    }
    return {
      backgroundImage : '/images/source/topic/image-not-available.png',
      backgroundPositionY : 0,
      backgroundSize:'unset',
    };
  };
  // * render ui
  return (
    <TopicDetailWrapper
      sx={{
        height: {
          xs: 'unset',
          // xl: 0, // scroll in lesson card
        },
        padding: {
          xs: theme.spacing(1),
          sm: theme.spacing(2),
          md: theme.spacing(3),
          lg: theme.spacing(5),
        },
      }}
    >
      <BreadcrumbsCustom
        title={t('Details')}
        breadcrumbsList={breadcrumbsList}
        icon={<LearningIcon width="36px" height="36px" />}
      />

      <BoxWrapper>
        {/* thumbnail */}
        <Box
          sx={{
            width: '100%',
            minHeight: '300px',
            backgroundImage: `url(${boxBackground().backgroundImage}), url('/images/source/topic/image-not-available.png')`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#dddddd',
            backgroundPositionY: boxBackground().backgroundPositionY,
            backgroundSize: boxBackground().backgroundSize,
            p: {
              xs: theme.spacing(2, 2),
              md: theme.spacing(2, 9),
            },
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'space-between',
            borderRadius: '6px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: 'fit-content',
            }}
          >
            { myTopic && <LabelCustomWrapper
              children={`${t('Total')} ${myTopic.vocabularies.length} ${t('words')}`}
              onClick={() => {
                if (myTopic.vocabularies.length) {
                  handleViewVocabularyList({
                    title: (
                      <Box>
                        <Typography
                          children={t('Entire vocabulary')}
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
                          children={t('Learn vocabulary')}
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
                    vocabularies: myTopic.vocabularies.map(v => v.id),
                    memoryAnalyses: myTopic?.students?.[0]?.memoryAnalyses,
                    //* fake to prevent remove vocabulary when mark memorized
                    currentLessonId: currentLessonId || 'fake'
                  });
                }
                toastify({ type: 'warning', message: t('No words to view') });
              }}
              sx={{
                width: 'fit-content',
                bgcolor: `${theme.colors.info.main} !important`,
                cursor: 'pointer',
                mb: theme.spacing(1),
                userSelect: 'none',
                ':hover': {
                  bgcolor: `${theme.colors.info.dark} !important`,
                }
              }}
            />}
            { myTopic && <LabelCustomWrapper
              children={`${t('Haven\'t studied yet')} ${myTopic?.students?.[0]?.summaryMemoryStatus?.newVocabularies?.length} ${t('words')}`}
              onClick={() => {
                if (myTopic?.students?.[0]?.summaryMemoryStatus?.newVocabularies?.length) {
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
                          children={myTopic.name}
                          variant="h3"
                          sx={{ fontSize: '18px', fontWeight: 700 }}
                        />
                      </Box>
                    ),
                    vocabularies: myTopic.vocabularies,
                    memoryAnalyses: myTopic?.students?.[0]?.memoryAnalyses,
                    studentId: myTopic?.students?.[0]?.id,
                    options: { memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.New }
                  });
                }
                toastify({ type: 'warning', message: t('No new words') });
              }}
              
              sx={{
                width: 'fit-content',
                bgcolor: `${theme.colors.warning.main} !important`,
                cursor: 'pointer',
                userSelect: 'none',
                ':hover': {
                  bgcolor: `${theme.colors.warning.dark} !important`,
                }
              }}
            />}
          </Box>
        </Box>

        {/* statistical */}
        <StatisticalCards 
          myTopic={myTopic}
          vocabulariesMemorized={vocabulariesMemorized}
          vocabulariesVague={vocabulariesVague}
          vocabulariesForgot={vocabulariesForgot}
          handleViewVocabularyList={handleViewVocabularyList}
        />

        {/* skill */}
        <PanelSkills 
          summarySkill={summarySkill}
          handleChangeChartSkill={handleChangeChartSkill}
          chartFormState={chartFormState}
          chartStateMemo={chartStateMemo}
          skillTypes={skillTypes}
          handleChangeDateOption={handleChangeDateOption}
          dateOptions={dateOptions}
        />

        <Lessons 
          myTopic={myTopic}
          handleTest={handleTest}
          handleLearning={handleLearning}
          handleViewVocabularyList={handleViewVocabularyList}
        />
      </BoxWrapper>

      {openVocabularyList && (
        <ViewWordList
          open={openVocabularyList}
          setOpen={setOpenVocabularyList}
          title={vocabularyListTitle}
          subtitle={vocabularyListSubTitle}
          titleLearning={vocabularyListTitleLearning}
          subtitleLearning={vocabularyListSubTitleLearning}
          titleTest={vocabularyListTitleTest}
          subtitleTest={vocabularyListSubTitleTest}
          vocabularies={currentVocabulariesForView ?? []}
          studentId={myTopic?.students?.[0]?.id}
          myTopic={myTopic} // ? note: myTopic and memoryAnalyses, must have one of 2
          memoryAnalyses={memoryAnalyses} // ? note: myTopic and memoryAnalyses, must have one of 2
          handleTest={handleTest}
          handleLearning={handleLearning}
          sx={{}}
          currentLessonId={currentLessonId}
        />
      )}

      {openLessonReview && (
        <LearningPage
          open={openLessonReview}
          setOpen={setOpenLessonReview}
          title={learningPageTitle}
          subtitle={learningPageSubTitle}
          myTopic={myTopic}
          currentLessonId={currentLessonId}
          showLessonList={showLessonList}
          vocabularies={currentVocabulariesForLearning ?? []}
          memoryAnalyses={memoryAnalyses}
          handleTest={handleTest}
        />
      )}

      {openTestPage && (
        <TestPage
          open={openTestPage}
          setOpen={setOpenTestPage}
          title={testPageTitle}
          subtitle={testPageSubTitle}
          vocabularies={currentVocabulariesForTest ?? []}
          topicId={myTopic.id}
          sx={{}}
        />
      )}
    </TopicDetailWrapper>
  );
};

export default TopicDetail;
