/* eslint-disable @typescript-eslint/no-empty-interface */
// next, react
import { useRouter } from 'next/router';
import { FC, ReactNode, useContext, useEffect, useState } from 'react';

// material
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Card, Collapse, Grid, Tab, Tabs, Tooltip, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// other
import { useLazyQuery, useMutation } from '@apollo/client';
import { cloneDeep, orderBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

// custom context
import { LoadingContext, ToastifyContext } from '@els/client/app/shared/contexts';

// interface
import { GraphqlMutations, GraphqlQueries, GraphqlTypes, HandleLearningType, HandleTestType, HandleViewType } from '@els/client/app/shared/data-access';

// ui
import { LearningPage, TestPage, TopicCard, ViewWordList } from '@els/client/app/topic/ui';

import {
  ArrowDownIcon,
  BreadcrumbsCustom,
  BreadcrumbsItem,
  ButtonCustom,
  CheckedCustom,
  GridIcon,
  LearningIcon,
  ListIcon,
  Loading,
  LoadingData,
  Search,
  SearchIcon
} from '@els/client/app/shared/ui';

// utils
import { addAlpha, removeVietnameseTones } from '@els/client/shared/utils';

// apollo client
import { ApolloClient } from '@els/client/shared/data-access';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const TopicListWrapper = styled(Box)(
  ({ theme: _theme }) => `
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

const BoxFlexCenter = styled(Box)(
  ({ theme: _theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
  `
);

const BoxWrapper = styled(Box)(
  ({ theme: _theme }) => `
    height: 0;
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

const TabsContainerWrapper = styled(Box)(
  ({ theme: _theme }) => `
    min-height: 38px;
  `
);

const displayTypes = [
  { value: 'grid', label: 'Hiển thị dạng lưới' },
  { value: 'list', label: 'Hiển thị dạng danh sách' },
];

interface QueryFiltersType {
  category?: string;
  searchValue: string;
  specializeds: string[];
}

interface QueryPaginationType {
  pageNumber: number;
  limit: number;
}

export interface JoinTopicVariable {
  createEnrollmentInput: {
    topicId: string,
    userId: string
  }
}

export interface TopicListProps {
  // topicList: GraphqlTypes.LearningTypes.Topic[];
  // myTopicList: GraphqlTypes.LearningTypes.Topic[];
}

const BoxNoRecords = ()=>{
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  return (
    <BoxFlexCenter
      children={t('No records to display')}
      sx={{
        p: theme.spacing(4, 1.5),
        m: 'auto',
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
    />
  );
};



const TOPIC_LIMIT = Number(publicRuntimeConfig.TOPIC_LIMIT ?? 10);

export const TopicList: FC<TopicListProps> = (props) => {

  const theme = useTheme();

  const router = useRouter();

  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);
  const { showLoading, hideLoading } = useContext(LoadingContext);

  const apolloClient = ApolloClient.useApollo(props);

  // * breadcrumb
  const breadcrumbsList: BreadcrumbsItem[] = [];

  // * page state
  const [firstLoadMyTopics, setFirstLoadMyTopics] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();
  const [currentLimitTopic, setCurrentLimitTopic] = useState<number>(0);
  const [currentMyTopic, setCurrentMyTopic] = useState<GraphqlTypes.LearningTypes.Topic>();
  const [vocabulariesForView, setVocabulariesForView] = useState<string[]>();
  const [vocabulariesForLearning, setVocabulariesForLearning] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>();
  const [vocabulariesForTest, setVocabulariesForTest] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>();
  const [topicList, setTopicList] = useState<GraphqlTypes.LearningTypes.Topic[]>([]);
  const [categories, setCategories] = useState<GraphqlTypes.LearningTypes.Category[]>([]);
  const [sortTopicList, setSortTopicList] = useState<'asc' | 'desc' | undefined>();
  const [myTopicList, setMyTopicList] = useState<GraphqlTypes.LearningTypes.Topic[]>([]);
  const [showLessonList, setShowLessonList] = useState<boolean>();
  const [specializedName, setSpecializedName] = useState('');
  const [topicIsJoiningId, setTopicIsJoiningId] = useState<string>('');

  const [studentId, setStudentId] = useState<string | undefined>('');
  const [memoryAnalyses, setMemoryAnalyses] = useState<GraphqlTypes.LearningTypes.MemoryAnalysis[]>([]);
  const initQueryPagination: QueryPaginationType = {
    pageNumber: 1,
    limit: TOPIC_LIMIT
  };
  const [queryPagination, setQueryPagination] = useState<QueryPaginationType>(initQueryPagination);

  const initQueryFilters: QueryFiltersType = {
    category: undefined,
    searchValue: '',
    specializeds: [],
  };
  const [queryFilters, setQueryFilters] = useState<QueryFiltersType>(initQueryFilters);

  const onError = (error:any) =>{
    return toastify({
      message: error.message,
      type: 'error',
    });
  };

  // * load data
  const [GetCurrentUser] = useLazyQuery<{ user: GraphqlTypes.LearningTypes.User }>(
    GraphqlQueries.LearningQueries.User.GetUser,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        if (data?.user) setCurrentUser(data?.user);
      },
      onError
    }
  );

  const [GetCategories] = useLazyQuery<{ categories: GraphqlTypes.LearningTypes.Category[] }>(
    GraphqlQueries.LearningQueries.Category.GetCategories,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        setCategories(data.categories ?? []);
      },
      onError
    },
  );

  const readTopicsFromCache = () => {
    const topicsResponse = apolloClient.readQuery({
      query: GraphqlQueries.LearningQueries.Topic.GetTopicShortFromCache,
    });

    setTopicList(topicsResponse?.topics ?? []);
  };

  const [GetTopics, { loading: getTopicsLoading }] = useLazyQuery<{
    topics: {
      nodes: GraphqlTypes.LearningTypes.Topic[],
      pageInfo: { [key: string]: any }
    }
  }>(
    GraphqlQueries.LearningQueries.Topic.GetTopicsShort,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        const newCurrentLimitTopic =
          data?.topics?.pageInfo?.total - queryPagination.pageNumber * queryPagination.limit > TOPIC_LIMIT
            ? TOPIC_LIMIT
            : data?.topics?.pageInfo?.total - queryPagination.pageNumber * queryPagination.limit;

        setCurrentLimitTopic(newCurrentLimitTopic);

        readTopicsFromCache();
      },
      onError,
      fetchPolicy: 'network-only',
    },
  );

  const [GetMyTopics, { loading: getMyTopicsLoading, networkStatus: GetMyTopicsNetworkStatus }] = useLazyQuery<{ myTopics: GraphqlTypes.LearningTypes.Topic[] }>(
    GraphqlQueries.LearningQueries.Topic.GetMyTopics,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        console.log(data?.myTopics);
        setMyTopicList(data?.myTopics ?? []);
      },
      onError,
      notifyOnNetworkStatusChange: true
    },
  );

  // * mutation data
  const [JoinTopic, { loading: JoinTopicLoading }] = useMutation(GraphqlMutations.LearningMutations.Enrollment.JoinTopic, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onError,
    refetchQueries: [
      GraphqlQueries.LearningQueries.Topic.GetMyTopics,
      GraphqlQueries.LearningQueries.User.GetUser,
    ],
  });

  // * view vocabulary list
  const [vocabularyListTitle, setVocabularyListTitle] = useState<ReactNode>('');
  const [vocabularyListSubTitle, setVocabularyListSubTitle] = useState<ReactNode>('');
  const [vocabularyListTitleLearning, setVocabularyListTitleLearning] = useState<ReactNode>('');
  const [vocabularyListSubtitleLearning, setVocabularyListSubtitleLearning] = useState<ReactNode>('');
  const [vocabularyListTitleTest, setVocabularyListTitleTest] = useState<ReactNode>('');
  const [vocabularyListSubtitleTest, setVocabularyListSubtitleTest] = useState<ReactNode>('');
  const [openVocabularyList, setOpenVocabularyList] = useState<boolean>(false);
  const handleViewVocabularyList = (data: HandleViewType) => {
    setVocabularyListTitle(data.title);
    setVocabularyListSubTitle(data.subtitle);
    setVocabularyListTitleLearning(data.titleLearning);
    setVocabularyListSubtitleLearning(data.subtitleLearning);
    setVocabularyListTitleTest(data.titleTest);
    setVocabularyListSubtitleTest(data.subtitleTest);
    setCurrentMyTopic(data.myTopic);
    setMemoryAnalyses(data.memoryAnalyses ?? []);
    setVocabulariesForView(data?.vocabularies);

    setStudentId(data.studentId);
    setOpenVocabularyList(true);
  };

  const getListVocalbularies = (data: HandleTestType)=>{
    return !data.options?.memoryStatus
      ? data?.vocabularies
      : cloneDeep(data?.vocabularies ?? []).filter(
        item =>
          data.memoryAnalyses?.findIndex(
            memoryAnalyse =>
              memoryAnalyse.vocabulary.id === item.id && memoryAnalyse.memoryStatus === data.options?.memoryStatus
          ) !== -1
      );
  };

  // * learning page
  const [learningPageTitle, setLearningPageTitle] = useState<ReactNode>('');
  const [learningPageSubTitle, setLearningPageSubTitle] = useState<ReactNode>('');
  const [openLessonReview, setOpenLessonReview] = useState<boolean>(false);
  const handleLearning = async (data: HandleLearningType) => {
    showLoading();

    setLearningPageTitle(data.title);
    setLearningPageSubTitle(data.subtitle);
    setCurrentMyTopic(data.myTopic);
    setMemoryAnalyses(data.memoryAnalyses ?? []);
    setShowLessonList(data.showLessonList);

    const learningVocabularies = getListVocalbularies(data);
    setVocabulariesForLearning(learningVocabularies);

    setStudentId(data.studentId);

    setOpenLessonReview(true);
    setOpenVocabularyList(false);

    hideLoading();
  };

  // * test page
  const [testPageTitle, setTestPageTitle] = useState<ReactNode>('');
  const [testPageSubTitle, setTestPageSubTitle] = useState<ReactNode>('');
  const [openTestPage, setOpenTestPage] = useState<boolean>(false);
  const handleTestVocabularies = (data: HandleTestType)=>{
    return getListVocalbularies(data);
  };

  const handleTest = (data: HandleTestType) => {
    setTestPageTitle(data.title);
    setTestPageSubTitle(data.subtitle);
    setCurrentMyTopic(data.myTopic);
    const testVocabularies = handleTestVocabularies(data);
    setVocabulariesForTest(testVocabularies);
    setStudentId(data.studentId);
    setOpenTestPage(true);
    setOpenVocabularyList(false);
  };

  // * handle logic
  const onGoToDetail = (id: string) => router.push(`/learning/${id}`);

  const onGoToTopicOverview = (id: string) => router.push(`/learning/topic/${id}`);

  const handleJoinTopic = (topicId: string) => {
    setTopicIsJoiningId(topicId);

    JoinTopic({
      variables: {
        createEnrollmentInput: {
          topicId: topicId,
        },
      },
    });
  };

  const [currentCategory, setCurrentCategory] = useState<string>(categories?.[0]?.id);
  const handleChangeCategory = (_event: React.SyntheticEvent, value: string): void => {
    setCurrentCategory(value);
    setCollapsesSpecialized(true);
  };

  const [currentDisplayType, setCurrentDisplayType] = useState<string>(displayTypes[0].value);
  const handleChangeDisplayType = (_event: React.SyntheticEvent, value: string): void => setCurrentDisplayType(value);

  const [collapsesSpecialized, setCollapsesSpecialized] = useState<boolean>(true);

  const [searchValue, setSearchValue] = useState('');
  const handleChangeSearch = (e: any) => {
    e.persist();
    const value = e.target.value.replace(/[^\w\s]/gi, '');
    setSearchValue(value);
  };

  const [specializedCheckeds, setSpecializedCheckeds] = useState<{[key: string]: boolean}>({});
  const handleChangeSpecialized = (e: any) => {
    e.persist();

    const checked = e.target.checked;
    const name = e.target.name;

    setSpecializedCheckeds({
      ...specializedCheckeds,
      [name]: checked,
    });
  };

  const handleLoadMore = () => {
    setSortTopicList(undefined);

    const newPageNumber = queryPagination.pageNumber + 1;

    setQueryPagination({
      ...queryPagination,
      pageNumber: newPageNumber,
    });

    GetTopics({
      variables: {
        pageNumber: newPageNumber,
        limit: queryPagination.limit,
        category: queryFilters.category,
        name: queryFilters.searchValue,
        specs: queryFilters.specializeds,
      }
    });
  };

  useEffect(() => {
    if (!currentCategory) setCurrentCategory(categories?.[1]?.id);

    if (specializedName && currentCategory) {
      const specializations = categories?.[categories.findIndex(item => item.id === currentCategory)]?.specializations;
      const specializedId = specializations?.[specializations?.findIndex(specialized => specialized.name === specializedName)]?.id;

      if (specializedId)
        setSpecializedCheckeds({
          ...specializedCheckeds,
          [specializedId]: true,
        });
    }
  }, [categories]);

  useEffect(() => {
    setTopicList([]);

    const categoryForFilter = cloneDeep(categories)?.[categories?.findIndex(item => item.id === currentCategory)];
    const specializedsForFilter = categoryForFilter?.specializations?.filter(item => specializedCheckeds[item.id]);

    setQueryFilters({
      ...queryFilters,
      category: categoryForFilter?.id,
      searchValue: searchValue,
      specializeds: specializedsForFilter?.map(item => item.id) ?? [],
    });
  }, [categories, currentCategory, specializedCheckeds, searchValue]);

  useEffect(() => {
    if (currentUser) {
      GetMyTopics({
        variables: {
          includeLessonInfo: false,
          includeVocabularyInfo: true,
          includeCategoryInfo: false
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    setSortTopicList(undefined);

    setQueryPagination(initQueryPagination);

    if (queryFilters.category) {
      GetTopics({
        variables: {
          pageNumber: 1,
          limit: TOPIC_LIMIT,
          category: queryFilters.category,
          name: queryFilters.searchValue,
          specs: queryFilters.specializeds,
        }
      });
    }
  }, [queryFilters]);

  useEffect(() => {
    const newCurrentMyTopic = myTopicList[myTopicList.findIndex(item => item.id === currentMyTopic?.id)];
    if (newCurrentMyTopic) setCurrentMyTopic(newCurrentMyTopic);

    const newMemoryAnalyses = newCurrentMyTopic?.students?.[0]?.memoryAnalyses;
    if (newMemoryAnalyses) setMemoryAnalyses(newMemoryAnalyses);
  }, [myTopicList]);

  useEffect(() => {
    if (router?.query?.categoryId) {
      setCurrentCategory(router?.query?.categoryId?.toString());
    }
    if (router?.query?.specializedName) {
      setSpecializedName(router?.query?.specializedName?.toString());
    }
  }, [router]);

  useEffect(() => {
    setFirstLoadMyTopics(false);
  }, [getMyTopicsLoading, myTopicList]);

  useEffect(() => {
    GetCurrentUser();

    GetCategories();
  }, []);
  // Sort topic list
  const handleSortTopicList = ()=>{
    if(sortTopicList){
      if(sortTopicList === 'asc'){
        return (
          <ButtonCustom onClick={() => setSortTopicList('desc')} startIcon={<FaSortUp />} sx={{ p: 1, ml: 1, minWidth: 'unset' }} />
        );
      }
      return (
        <ButtonCustom onClick={() => setSortTopicList(undefined)} startIcon={<FaSortDown />} sx={{ p: 1, ml: 1, minWidth: 'unset' }} />
      );
    }
    return (
      <ButtonCustom onClick={() => setSortTopicList('asc')} startIcon={<FaSort />} sx={{ p: 1, ml: 1, minWidth: 'unset' }} />
    );
  };

  const renderSortTopicList = ()=>{
    if(sortTopicList){
      return orderBy(topicList, (topic) => removeVietnameseTones(topic.name ?? ''), [sortTopicList]);
    }
    return topicList;
  };

  const renderTopicList = ()=>{
    if(!topicList.length && !getTopicsLoading){
      return <BoxNoRecords/>;
    }
    return (
      <Box>
        <Grid container spacing={{ xs: 2, md: '20px' }} alignItems="start">
          {cloneDeep(
            renderSortTopicList()
          ).map((item, index) => {
            const myTopicData = myTopicList[myTopicList.findIndex(myTopic => myTopic.id === item.id)];
            return (
              <Grid
                key={item.id + index}
                item
                xs={12}
                md={currentDisplayType === displayTypes[0].value?6:12}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <TopicCard
                  itemData={item}
                  isJoining={item.id === topicIsJoiningId && (JoinTopicLoading || GetMyTopicsNetworkStatus !== 7) }
                  vocabularies={myTopicData?.vocabularies ?? []}
                  myTopicData={myTopicData}
                  getMyTopicsLoading={getMyTopicsLoading}
                  firstLoadMyTopics={firstLoadMyTopics}
                  handleJoinTopic={handleJoinTopic}
                  handleViewVocabularyList={handleViewVocabularyList}
                  handleLearning={handleLearning}
                  handleTest={handleTest}
                  onGoToDetail={myTopicData ? onGoToDetail : undefined}
                  onGoToTopicOverview={onGoToTopicOverview}
                  sx={{}}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const isTopicsLoading = ()=>{
    if(getTopicsLoading){
      return {
        t: t('Loading more'),
        event: undefined,
        startIcon: <LoadingData />,
        endIcon: undefined
      };
    }
    return {
      t: t('Load more'),
      event: handleLoadMore,
      startIcon: undefined,
      endIcon: <ExpandMoreIcon />

    };
  };

  // * render ui
  return (
    <TopicListWrapper
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
      {/* <ButtonCustom children={'Create Topic'} onClick={() => writeTopicQueryCache()} /> */}
      <BreadcrumbsCustom
        title={t('List of topics')}
        breadcrumbsList={breadcrumbsList}
        icon={<LearningIcon width="36px" height="36px" />}
      />

      <BoxWrapper>
        <TabsContainerWrapper
          sx={{
            px: {
              xs: '0px',
              md: '60px',
            },
            display: 'flex',
            justifyContent: {
              xs: 'center',
              md: 'start',
            },
          }}
        >
          {categories.length > 0 && currentCategory && (
            <Tabs
              onChange={handleChangeCategory}
              value={currentCategory}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '.MuiTabs-indicator': {
                  boxShadow: 'unset',
                  border: 'unset',
                  bgcolor: theme.colors.alpha.white[100],
                }
              }}
            >
              {/* {orderBy(categories, ['name'], ['asc']).map((tab) => ( */}
              {categories.map((tab) => (
                <Tab
                  key={tab.id} label={t(tab.name)} value={tab.id}
                  sx={{
                    bgcolor: currentCategory ===  tab.id ? theme.colors.alpha.white[100] : theme.palette.background.default,
                    color: `${theme.palette.common.black} !important`,
                    p: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 900,
                    textTransform: 'none',
                    borderRadius: '6px 6px 0 0',
                    mx: {
                      xs: `${theme.spacing(0.5)} !important`,
                      sm: `${theme.spacing(2)} !important`,
                    },
                    borderLeft: `1px solid ${theme.palette.grey[50]}`,
                    borderTop: `1px solid ${theme.palette.grey[50]}`,
                    borderRight: `1px solid ${theme.palette.grey[50]}`,
                  }}
                />
              ))}
            </Tabs>
          )}
        </TabsContainerWrapper>

        <Card
          sx={{
            p: theme.spacing(3),
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* search */}
          <Box>
            <Search
              onChange={handleChangeSearch}
              value={searchValue}
              placeholder={t('Enter the word you want to find') + '...'}
              startAdornment={
                <SearchIcon color={theme.colors.primary.main} sx={{ mr: '8px', opacity: '1 !important' }} />
              }
              endAdornment={
                <ButtonCustom color="primary" variant="contained" children={t('Search')} sx={{ mx: 0, fontSize: '13px', fontWeight: 700 }} />
              }
              sx={{
                '.MuiInputBase-root': {
                  p: '10px',
                },
                '.MuiOutlinedInput-notchedOutline': {
                  p: 0,
                  border: '1px solid #CCCEDD',
                },
                '.MuiOutlinedInput-input': {
                  p: 0,
                  flex: 1,
                  fontSize: '15px',
                  fontWeight: 400,
                },
              }}
            />
          </Box>

          {/* test from now */}
          {/* <Box>
            <Typography children={exactDateTime(new Date('2022-02-22T07:00:00.565+00:00'), language)} />
          </Box> */}

          {/* filter */}
          {!!categories?.[categories?.findIndex(category => category.id === currentCategory)]?.specializations?.length && (
            <Box>
              <Box
                onClick={() => setCollapsesSpecialized(!collapsesSpecialized)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: theme.spacing(1.5),
                  ':hover': {
                    color: theme.colors.primary.main,
                    cursor: 'pointer',
                  },
                }}
              >
                <Typography
                  children={t('Specialized')}
                  sx={{ fontSize: '16px', fontWeight: 700, my: 'auto', color: 'unset' }}
                />
                <ButtonCustom
                  startIcon={<ArrowDownIcon sx={{ transform: collapsesSpecialized ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 300ms' }} />}
                  sx={{
                    minWidth: 'unset',
                    p: '8px',
                  }}
                />
              </Box>
              <Collapse in={collapsesSpecialized}>
                {orderBy(categories?.[categories?.findIndex(category => category.id === currentCategory)]?.specializations, (specializations) => 
                  removeVietnameseTones(specializations.name ?? ''), ['asc'])?.map((specialized) => {
                  return (
                    <CheckedCustom
                      key={specialized.id}
                      color='primary'
                      variant='outlined'
                      label={specialized.name}
                      checked={specializedCheckeds[specialized.id] || false}
                      name={specialized.id}
                      onChange={(e) => handleChangeSpecialized(e)}
                      sx={{
                        ml: '10px',
                        mb: '6px',
                      }}
                      // checkedIcon
                    />
                  );
                })}
              </Collapse>
            </Box>
          )}

          {/* transaction */}
          <Box sx={{ my: theme.spacing(2), display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
            <Typography
              children={
                <Box sx={{ height: '100%', display: 'flex', alignContent: 'center' }}>
                  <Typography children={`${t('Showing')}:`} sx={{ m: 'auto', mr: '4px', color: theme.colors.alpha.black[50] }} />
                  <Typography children={`${topicList.length} ${t('Topic')}`} sx={{ m: 'auto', fontWeight: 700 }} />
                  <Tooltip key={Math.random()} arrow placement="top" title={t('Sort by topic name')}>
                    <Box sx={{ display: 'flex' }}>
                      {
                        handleSortTopicList()
                      }
                    </Box>
                  </Tooltip>
                </Box>
              }
            />
            <Tabs
              onChange={handleChangeDisplayType}
              value={currentDisplayType}
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
                height: 'unset',
              }}
            >
              {displayTypes.map((displayType, index: number) => {
                const isDisplay = currentDisplayType ===  displayType.value;
                const primaryColor = theme.colors.primary.main;
                const setColor = ()=>{
                  if(isDisplay){
                    return '#ffffff';
                  }
                  return primaryColor;
                };

                return (
                  <Tab
                    key={displayType.value}
                    icon={
                      displayType.value === 'grid'
                        ? <Tooltip key={Math.random()} arrow placement="top" title={t('List view')}>
                          <Box sx={{ display: 'flex' }}>
                            <GridIcon color={setColor()} />
                          </Box>
                        </Tooltip>
                        : <Tooltip key={Math.random()} arrow placement="top" title={t('Grid view')}>
                          <Box sx={{ display: 'flex' }}>
                            <ListIcon color={setColor()} />
                          </Box>
                        </Tooltip>
                    }
                    value={displayType.value}
                    sx={{
                      bgcolor: isDisplay ? primaryColor : theme.palette.background.default,
                      color: `${theme.palette.common.black} !important`,
                      p: '10px !important',
                      fontSize: '14px',
                      fontWeight: 900,
                      borderRadius: index === 0 ? '6px 0px 0px 6px' : '0px 6px 6px 0px',
                      mr: '0 !important',
                      border: `1px solid ${ isDisplay ? primaryColor : theme.palette.grey[50]}`,
                      width: '44px',
                      height: '44px',
                    }}
                  />
                );
              })}
            </Tabs>
          </Box>

          <Box sx={{ position: 'relative', minHeight: '400px' }}>
            {/* loading */}
            {
              (getTopicsLoading && getMyTopicsLoading) && (<Loading sx={{ position: 'absolute', alignItems: 'center', backgroundColor: addAlpha('#ffffff', 0.5) }} />)
            }
            {
              (
                <Box>
                  {/* content */}
                  {currentDisplayType === displayTypes[0].value && (
                    renderTopicList()
                  )}

                  {currentDisplayType === displayTypes[1].value && (
                    renderTopicList()
                  )}
                </Box>
              )
            }
          </Box>

          {topicList.length > 0 && !getMyTopicsLoading && currentLimitTopic > 0 && (
            <ButtonCustom
              children={`${isTopicsLoading().t} ${currentLimitTopic} ${t('topic')}`}
              variant="outlined"
              onClick={isTopicsLoading().event}
              startIcon={isTopicsLoading().startIcon}
              endIcon={isTopicsLoading().endIcon}
              sx={{
                mt: 3,
                width: 'fit-content',
                marginX: 'auto',
                ...getTopicsLoading && { pointerEvents: 'none' }
              }}
            />
          )}
        </Card>
      </BoxWrapper>

      {openLessonReview && (
        <LearningPage
          open={openLessonReview}
          setOpen={setOpenLessonReview}
          title={learningPageTitle}
          subtitle={learningPageSubTitle}
          myTopic={currentMyTopic}
          vocabularies={vocabulariesForLearning ?? []}
          memoryAnalyses={memoryAnalyses}
          handleTest={handleTest}
          showLessonList={showLessonList}
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
          topicId={currentMyTopic?.id}
          sx={{}}
        />
      )}

      {openVocabularyList && (
        <ViewWordList
          title={vocabularyListTitle}
          subtitle={vocabularyListSubTitle}
          titleLearning={vocabularyListTitleLearning}
          subtitleLearning={vocabularyListSubtitleLearning}
          titleTest={vocabularyListTitleTest}
          subtitleTest={vocabularyListSubtitleTest}
          open={openVocabularyList}
          setOpen={setOpenVocabularyList}
          vocabularies={vocabulariesForView ?? []}
          studentId={studentId}
          myTopic={currentMyTopic} // ? note: myTopic and memoryAnalyses, must have one of 2
          memoryAnalyses={memoryAnalyses} // ? note: myTopic and memoryAnalyses, must have one of 2
          handleTest={handleTest}
          handleLearning={handleLearning}
          sx={{}}
        />
      )}
    </TopicListWrapper>
  );
};

export default TopicList;
