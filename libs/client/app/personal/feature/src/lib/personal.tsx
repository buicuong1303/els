/* eslint-disable @typescript-eslint/no-empty-interface */

// next, react
import { useRouter } from 'next/router';
import {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// material
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Box, Grid, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// other
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import jsCookies from 'js-cookie';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

// custom context
import { ToastifyContext } from '@els/client/app/shared/contexts';

// interface
import {
  GraphqlMutations,
  GraphqlQueries,
  GraphqlTypes,
  HandleLearningType,
  HandleTestType,
  HandleViewType
} from '@els/client/app/shared/data-access';

// ui
import {
  Loading,
  VirtualizedTableRowsRenderedType,
} from '@els/client/app/shared/ui';
import { LearningPage, TestPage, ViewWordList } from '@els/client/app/topic/ui';

// apollo client
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  AbilityChart,
  Banner,
  MyTopic,
  RankPanel,
  RankUserCard,
  StatisticalCard,
  Title,
} from '@els/client-app-personal-ui';
import { ApolloClient } from '@els/client/shared/data-access';
import { handleApolloError } from '@els/client/shared/utils';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

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

interface RankQueryPaginationType {
  name: string;
  pageNumber: number;
  limit: number;
}

export enum TopicLearningStatusTypes {
  All = 'All',
  Accomplished = 'Accomplished',
}

export interface SeriesTypes {
  name: string;
  data: number[];
  color: string;
}

export interface ChartStateTypes {
  options: any;
  series: SeriesTypes[];
}

export interface PersonalProps {}

const topicsLearningStatusTypes = [
  {
    value: TopicLearningStatusTypes.All,
    label: TopicLearningStatusTypes.All,
  },
  {
    value: TopicLearningStatusTypes.Accomplished,
    label: TopicLearningStatusTypes.Accomplished,
  },
];

// TODO for test
// const sortForChart = (array: any[], property: any) => {
//   const arraySort = array.sort((item1: any, item2: any) => {
//     if (item1[property].length > item2[property].length) return 1;
//     if (item1[property].length < item2[property].length) return -1;
//     return 0;
//   });
//   const arraySort1: any[] = [];
//   const arraySort2: any[] = [];
//   for (let i = 0; i < arraySort.length; i++) {
//     if (i%2 === 0) arraySort1.push(arraySort[i]);
//     else arraySort2.push(arraySort[i]);
//   }
//   const arrayForChart1 = arraySort1.filter((v, i)=>i % 2 === 0).reverse().concat(arraySort1.filter((v, i)=>i % 2 === 1));
//   const arrayForChart2 = arraySort2.filter((v, i)=>i % 2 === 0).reverse().concat(arraySort2.filter((v, i)=>i % 2 === 1));
//   const arrayForChart: any[] = arrayForChart1.concat(arrayForChart2);
//   return arrayForChart;
// }
// TODO end for test

const RANK_LIMIT = Number(publicRuntimeConfig.RANK_LIMIT ?? 10);

export const Personal: FC<PersonalProps> = (props) => {
  const theme = useTheme();

  const router = useRouter();

  const { t }: { t: any } = useTranslation();

  const language =
    jsCookies.get('i18nextLng') ??
    window?.localStorage?.getItem('i18nextLng') ??
    'vi';

  const { toastify } = useContext(ToastifyContext);

  // * page state
  const categorySelectedIdRef = useRef('');
  const percentRef = useRef<any>();
  const currentStopIndexRef = useRef<number>(0);
  const isHoverTopPoint = useRef(false);
  const categoryDetailsRef = useRef<GraphqlTypes.LearningTypes.Category>();
  const currentUserCategoryDetailsRef =
    useRef<GraphqlTypes.LearningTypes.Category>();
  const anyUserCategoryDetailsRef =
    useRef<GraphqlTypes.LearningTypes.Category>();
  const userSelected = useRef<GraphqlTypes.LearningTypes.User>();

  const [topicsLearningStatus, setTopicsLearningStatus] =
    useState<TopicLearningStatusTypes>(TopicLearningStatusTypes.All);
  const [categories, setCategories] = useState<
  GraphqlTypes.LearningTypes.Category[]
  >([]);
  const [categorySelectedId, setCategorySelectedId] = useState('');
  const [rankTypes, setRankTypes] = useState<
  GraphqlTypes.LearningTypes.RankType[]
  >([]);
  const [rankTypeSelected, setRankTypeSelected] =
    useState<GraphqlTypes.LearningTypes.RankType>();
  const [currentRanks, setCurrentRanks] = useState<
  GraphqlTypes.LearningTypes.Rank[]
  >([]);
  const [currentUser, setCurrentUser] =
    useState<GraphqlTypes.LearningTypes.User>();
  const [currentUserRank, setCurrentUserRank] =
    useState<GraphqlTypes.LearningTypes.Rank>();
  const [currentUserRankIndex, setCurrentUserRankIndex] = useState<number>();
  const [currentUserRankInView, setCurrentUserRankInView] = useState<{
    inView: boolean;
    position?: 'top' | 'bottom';
  }>();
  const [currentRankUserInfo, setCurrentRankUserInfo] =
    useState<GraphqlTypes.LearningTypes.RankUserInfo>();
  const [currentRankUserId, setCurrentRankUserId] = useState<string>('');
  const [currentEnrollmentList, setCurrentEnrollmentList] = useState<
  GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.Enrollment[]>
  >([]);
  const [currentEnrollmentsShow, setCurrentEnrollmentsShow] = useState<
  GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.Enrollment[]>
  >([]);
  const [rowsRenderedData, setRowsRenderedData] = useState<{
    startIndex: number;
    stopIndex: number;
  }>();
  const initRankQueryPagination: RankQueryPaginationType = {
    name: '',
    pageNumber: 1,
    limit: RANK_LIMIT,
  };
  const [rankQueryPagination, setRankQueryPagination] =
    useState<RankQueryPaginationType>(initRankQueryPagination);
  const [canLoadMoreRank, setCanLoadMoreRank] = useState<boolean>(false);

  const [topicListNumberPage, setTopicListNumberPage] = useState(1);
  const topicPageNumberOptions: number[] = [2, 5, 10, 20, 50];
  interface ShowTopicFormState {
    pageNumber: number;
    limit: number;
  }
  const showTopicFormStateInit: ShowTopicFormState = {
    pageNumber: 1,
    limit: 5,
  };
  const [showTopicFormState, setShowTopicFormState] = useState(
    showTopicFormStateInit
  );

  const [capacityChartDataOfCurrentUser, setCapacityChartDataOfCurrentUser] =
    useState<any>();
  const [capacityChartDataOfAnyUser, setCapacityChartDataOfAnyUser] =
    useState<any>();

  function chartMountAndUpdate() {
    const apexchartsXaxis = document.getElementsByClassName(
      'apexcharts-xaxis'
    ) as HTMLCollectionOf<HTMLElement>;
    if (apexchartsXaxis && apexchartsXaxis?.[0]) {
      apexchartsXaxis[0].style.transform = 'scale(1.1)';

      const xaxis = apexchartsXaxis[0]
        .children as HTMLCollectionOf<HTMLElement>;
      const arrayXaxis = Array.from(xaxis);
      for (const xaxi of arrayXaxis) {
        xaxi.style.pointerEvents = 'unset';
        xaxi.style.cursor = 'pointer';

        const xaxiFill = xaxi.style.fill;
        const xaxiFontWeight = xaxi.style.fontWeight;
        xaxi.addEventListener('mouseenter', () => {
          xaxi.style.fill = '#FFED4E';
          xaxi.style.fontWeight = '600';
        });
        xaxi.addEventListener('mouseleave', () => {
          xaxi.style.fill = xaxiFill;
          xaxi.style.fontWeight = xaxiFontWeight;
        });

        xaxi.addEventListener('click', () =>
          handleGoToLearningPage(categorySelectedIdRef.current, xaxi.innerHTML)
        );
      }
    }
  }

  const chartStateInit = {
    options: {
      chart: {
        id: 'capacity-chart',
        width: '100%',
        height: '100%',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        type: 'radar',
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1,
        },
        events: {
          mounted: chartMountAndUpdate,
          updated: chartMountAndUpdate,
        },
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: '#ffffff20',
            strokeWidth: 1,
            connectorColors: '#ffffff20',
            fill: {
              colors: undefined,
            },
          },
        },
      },
      legend: {
        show: false,
      },
      markers: {
        size: [4, 4, 4],
        strokeColors: [
          '#ffffff69',
          theme.colors.info.main,
          theme.colors.error.light,
        ],
        colors: ['#ffffff69', '#ffffff', '#ffffff'],
        strokeWidth: [0, 2, 2],
        strokeOpacity: 1,
        strokeDashArray: 0,
        fillOpacity: 1,
        shape: ['circle', 'circle', 'circle'],
        radius: 2,
        offsetX: 0,
        offsetY: 0,
        onClick: undefined,
        onDblClick: undefined,
        hover: {
          size: undefined,
          sizeOffset: 1.5,
        },
        discrete: [],
      },
      fill: {
        opacity: 0.24,
      },
      yaxis: {
        show: true,
        min: 0,
        max: 100,
        logBase: 100,
        tickAmount: 5,
        labels: {
          show: true,
          offsetX: 20,
          offsetY: 5,
          style: {
            colors: '#ffffff80',
            fontSize: '12px',
            fontWeight: 400,
          },
          formatter: (val: any) => `${val}%`,
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#78909C',
          width: 6,
          offsetX: 100,
          offsetY: 100,
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: [],
            fontSize: '12px',
            fontWeight: 400,
          },
          show: true,
          rotate: -45,
          rotateAlways: true,
          hideOverlappingLabels: true,
          showDuplicates: true,
          trim: true,
          minHeight: undefined,
          maxHeight: 120,
          offsetX: 0,
          offsetY: 5,
        },
      },
      tooltip: {
        enabled: true,
        marker: {
          show: false,
        },
        x: {
          show: true,
          formatter: (title: any) => {
            const specialization = cloneDeep(
              categoryDetailsRef.current?.specializations
            )?.find((item) => item.name === title);

            percentRef.current = isHoverTopPoint.current
              ? `${specialization?.totalVocabulary} ${t('word')}`
              : `${t('Memorized')} ${specialization?.vocabularyMemorized} ${t(
                'word'
              )}`;

            return title;
          },
        },
        y: {
          formatter: (value: any) => {
            if (percentRef.current) return percentRef.current;

            return value;
          },
          title: {
            formatter: (seriesName: string) => {
              isHoverTopPoint.current = seriesName === t('Total') + ':';

              categoryDetailsRef.current =
                seriesName === t('Me') + ':' || seriesName === t('Total') + ':'
                  ? currentUserCategoryDetailsRef.current
                  : anyUserCategoryDetailsRef.current;
              return seriesName;
            },
          },
        },
      },
    },
    series: [
      {
        name: '',
        data: [],
        color: '#ffffff00',
      },
      {
        name: '',
        data: [],
        color: theme.colors.info.main,
      },
      {
        name: '',
        data: [],
        color: theme.colors.error.light,
      },
    ],
  };
  const [chartState, setChartState] = useState<any>(chartStateInit);

  const [vocabulariesMemorized, setVocabulariesMemorized] = useState<string[]>(
    []
  );
  const [vocabulariesVague, setVocabulariesVague] = useState<string[]>([]);
  const [vocabulariesForgot, setVocabulariesForgot] = useState<string[]>([]);

  const [studentId, setStudentId] = useState<string | undefined>('');
  const [myTopic, setMyTopic] = useState<GraphqlTypes.LearningTypes.Topic>();
  const [memoryAnalyses, setMemoryAnalyses] = useState<
  GraphqlTypes.LearningTypes.Maybe<
  GraphqlTypes.LearningTypes.MemoryAnalysis[]
  >
  >([]);
  const [currentMemoryStatus, setCurrentMemoryStatus] =
    useState<GraphqlTypes.LearningTypes.MemoryStatus>();
  const [currentVocabulariesForView, setCurrentVocabulariesForView] =
    useState<string[]>();
  const [currentVocabulariesForLearning, setCurrentVocabulariesForLearning] =
    useState<GraphqlTypes.LearningTypes.Vocabulary[]>();
  const [currentVocabulariesForTest, setCurrentVocabulariesForTest] =
    useState<GraphqlTypes.LearningTypes.Vocabulary[]>();

  // * load data
  const [GetCurrentUser] = useLazyQuery<{
    user: GraphqlTypes.LearningTypes.User;
  }>(GraphqlQueries.LearningQueries.User.GetUser, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      if (data?.user) setCurrentUser(data?.user);
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
  });

  const [GetCategories] = useLazyQuery<{
    categories: GraphqlTypes.LearningTypes.Category[];
  }>(GraphqlQueries.LearningQueries.Category.GetCategories, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setCategories(data.categories ?? []);
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
    // ? note: neu cache lai data, state va cache co cung dia chi con tro,
    // ? note: khi api khac lam thay doi cache => thay doi state => useEffect subscribe state chay lai
    fetchPolicy: 'no-cache',
  });

  const [GetRankTypes] = useLazyQuery<{
    rankType: GraphqlTypes.LearningTypes.RankType[];
  }>(GraphqlQueries.LearningQueries.Rank.GetRankTypes, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setRankTypes(data.rankType ?? []);
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
  });

  const [GetRanks, { loading: getRanksLoading }] = useLazyQuery<{
    ranks: { nodes: GraphqlTypes.LearningTypes.Rank[] };
  }>(GraphqlQueries.LearningQueries.Rank.GetRanks, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    variables: {
      name: rankQueryPagination.name,
      pageNumber: rankQueryPagination.pageNumber,
      limit: rankQueryPagination.limit,
    },
    onCompleted: (data) => {
      if (data?.ranks?.nodes?.length === RANK_LIMIT) setCanLoadMoreRank(true);
      else setCanLoadMoreRank(false);

      setCurrentRanks(
        rankQueryPagination.pageNumber > 1
          ? [...currentRanks, ...(data?.ranks?.nodes ?? [])]
          : data?.ranks?.nodes ?? []
      );
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
    fetchPolicy: 'network-only',
  });

  const [GetMyRank, { loading: getMyRankLoading }] = useLazyQuery<{
    myRank: GraphqlTypes.LearningTypes.Rank;
  }>(GraphqlQueries.LearningQueries.Rank.GetMyRank, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setCurrentUserRank(data?.myRank);
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
    fetchPolicy: 'network-only',
  });

  const [GetRankUserInfo, { loading: getRankUserInfoLoading }] = useLazyQuery<{
    rankUserInfo: GraphqlTypes.LearningTypes.RankUserInfo;
  }>(GraphqlQueries.LearningQueries.Rank.GetRankUserInfo, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setCurrentRankUserInfo(data?.rankUserInfo);
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
    fetchPolicy: 'network-only',
  });

  const [
    GetCapacityChartDataOfCurrentUser,
    { loading: loadingGetCapacityChartDataOfCurrentUser },
  ] = useLazyQuery<{ categoryDetails: GraphqlTypes.LearningTypes.Category }>(
    GraphqlQueries.LearningQueries.Category.GetCategoryDetail,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        if (data?.categoryDetails) {
          // TODO comment if need test
          setCapacityChartDataOfCurrentUser(data?.categoryDetails);
        }
      },
      onError: (error: ApolloError) => handleApolloError(error, toastify),
      fetchPolicy: 'no-cache', // ? note: If the data is cached on the client, the next requests will not run on onCompleted
    }
  );

  const [
    GetCapacityChartDataOfAnyUser,
    { loading: loadingGetCapacityChartDataOfAnyUser },
  ] = useLazyQuery<{ categoryDetails: GraphqlTypes.LearningTypes.Category }>(
    GraphqlQueries.LearningQueries.Category.GetCategoryDetail,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        if (data?.categoryDetails) {
          // TODO comment if need test
          setCapacityChartDataOfAnyUser(data?.categoryDetails);
        }
      },
      onError: (error: ApolloError) => handleApolloError(error, toastify),
      fetchPolicy: 'no-cache', // ? note: If the data is cached on the client, the next requests will not run on onCompleted
    }
  );

  const [AcceptInvitation] = useMutation(
    GraphqlMutations.LearningMutations.User.AcceptInvitation,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onError: (error: ApolloError) => handleApolloError(error, toastify),
    }
  );

  // * view vocabulary list
  const [vocabularyListTitle, setVocabularyListTitle] = useState<ReactNode>();
  const [vocabularyListSubTitle, setVocabularyListSubTitle] =
    useState<ReactNode>();
  const [vocabularyListTitleLearning, setVocabularyListTitleLearning] =
    useState<ReactNode>();
  const [vocabularyListSubTitleLearning, setVocabularyListSubTitleLearning] =
    useState<ReactNode>();
  const [vocabularyListTitleTest, setVocabularyListTitleTest] =
    useState<ReactNode>();
  const [vocabularyListSubTitleTest, setVocabularyListSubTitleTest] =
    useState<ReactNode>();
  const [openVocabularyList, setOpenVocabularyList] = useState<boolean>(false);
  const handleViewVocabularyList = (data: HandleViewType) => {
    setVocabularyListTitle(data.title);
    setVocabularyListSubTitle(data.subtitle);
    setVocabularyListTitleLearning(data.titleLearning);
    setVocabularyListSubTitleLearning(data.subtitleLearning);
    setVocabularyListTitleTest(data.titleTest);
    setVocabularyListSubTitleTest(data.subtitleTest);
    setCurrentVocabulariesForView(data.vocabularies ?? []);
    setMemoryAnalyses(data.memoryAnalyses ?? []);
    setCurrentMemoryStatus(data.memoryStatus);
    setMyTopic(data.myTopic);
    setStudentId(data.studentId);
    setOpenVocabularyList(true);
  };

  // * rank user info
  const [openRankUserInfo, setOpenRankUserInfo] = useState<boolean>(false);
  const handleOpenRankUserInfo = (userId: string) => {
    setCurrentRankUserId(userId);

    GetRankUserInfo({
      variables: {
        userId: userId,
        state: Math.random(), // ? add variable state to run onCompleted when call api
      },
    });

    setOpenRankUserInfo(true);
  };
  const handleCloseRankUserInfo = () => {
    setCurrentRankUserId('userId');

    setCurrentRankUserInfo(undefined);

    setOpenRankUserInfo(false);
  };

  // * learning page
  const [learningPageTitle, setLearningPageTitle] = useState<ReactNode>('');
  const [learningPageSubTitle, setLearningPageSubTitle] =
    useState<ReactNode>('');
  const [openLessonReview, setOpenLessonReview] = useState<boolean>(false);
  const handleLearning = (data: HandleLearningType) => {
    setLearningPageTitle(data.title);
    setLearningPageSubTitle(data.subtitle);
    setMemoryAnalyses(data.memoryAnalyses ?? []);
    setCurrentVocabulariesForLearning(data.vocabularies);
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

    const testVocabularies = !data.options?.memoryStatus
      ? data.vocabularies ?? []
      : cloneDeep(data.vocabularies ?? []).filter(
        (item) =>
          data.memoryAnalyses?.findIndex(
            (memoryAnalyse) =>
              memoryAnalyse.vocabulary.id === item.id &&
                memoryAnalyse.memoryStatus === data.options?.memoryStatus
          ) !== -1
      );
    setCurrentVocabulariesForTest(testVocabularies);

    setOpenTestPage(true);
    setOpenVocabularyList(false);
  };

  // * handle logic
  const handleChangeTopicsLearningStatus = (
    value: TopicLearningStatusTypes
  ) => {
    setTopicsLearningStatus(value);
  };

  const handleChangeCategoryOption = (event: any) => {
    setCategorySelectedId(event.target.value);
    categorySelectedIdRef.current = event.target.value;
  };

  const handleRemoveChartSeries = (index: number) => {
    const newChartState = cloneDeep(chartState);
    newChartState.series[index].name = '';
    newChartState.series[index].data = [];
    setChartState(newChartState);
  };

  const handleChangeSlideIndex = (previous: any, next: any) => {
    const RanksType = rankTypes[next];

    const tableBody = document.getElementsByClassName(
      'ReactVirtualized__Table__Grid'
    );
    if (tableBody?.[0]) tableBody[0].scrollTo({ top: 0, behavior: 'smooth' });

    currentStopIndexRef.current = 0;

    if (RanksType) {
      setRankTypeSelected(RanksType);

      setCanLoadMoreRank(true);
      setRankQueryPagination({
        ...rankQueryPagination,
        pageNumber: 1,
        name: RanksType.name || '',
      });
    }
  };

  const handleChangeShowTopics = (data: {
    pageNumber?: number;
    limit?: number;
  }) => {
    const newShowTopicFormState = {
      pageNumber: data.pageNumber ?? showTopicFormState.pageNumber,
      limit: data.limit ?? showTopicFormState.limit,
    };
    setShowTopicFormState(newShowTopicFormState);
  };

  const handleShowTopic = useCallback(
    (data: ShowTopicFormState) => {
      const newCurrentTopicsShow =
        cloneDeep(currentEnrollmentList)?.splice(
          (data.pageNumber - 1) * data.limit,
          data.limit
        ) ?? [];

      setCurrentEnrollmentsShow(newCurrentTopicsShow);
    },
    [currentEnrollmentList]
  );

  const handleGoToLearningPage = (
    categorySelectedLearningPageId: string,
    specializedName: string
  ) => {
    router.push({
      pathname: '/learning',
      query: {
        categoryId: categorySelectedLearningPageId,
        specializedName: specializedName,
      },
    });
  };

  const handleLoadMoreRanks = () => {
    const newPageNumber = rankQueryPagination.pageNumber + 1;

    setRankQueryPagination({
      ...rankQueryPagination,
      pageNumber: newPageNumber,
    });
  };

  const handleClickRatingRow = (
    index: number,
    currentRanksList: GraphqlTypes.LearningTypes.Rank[]
  ) => {
    const user = currentRanksList[index]?.user;

    if (userSelected.current?.id === user.id) {
      handleRemoveChartSeries(2);

      userSelected.current = undefined;
      setCapacityChartDataOfAnyUser(undefined);
      return;
    }

    userSelected.current = user;

    if (categorySelectedId && user) {
      GetCapacityChartDataOfAnyUser({
        variables: {
          categoryId: categorySelectedId,
          userId: user.id,
          state: Math.random(), // ? because variables don't change onCompleted doesn't run
        },
      });
    }

    // TODO for test
    // setCapacityChartDataOfAnyUser(anyUserSpecializationsData);
    // TODO end for test
  };

  const handleRowsRendered = (data: VirtualizedTableRowsRenderedType) => {
    if (
      data.startIndex > 0 &&
      data.stopIndex !== currentStopIndexRef.current &&
      data.stopIndex >= data.overscanStopIndex &&
      canLoadMoreRank
    ) {
      currentStopIndexRef.current = data.stopIndex;
      handleLoadMoreRanks();
    }

    setRowsRenderedData(data);
  };

  const handleCurrentUserRankInView = (
    data: { startIndex: number; stopIndex: number },
    currentUserRankIndexInView: number | undefined
  ) => {
    if (
      currentUserRankIndexInView !== undefined &&
      currentUserRankIndexInView >= -1 &&
      currentUserRankIndexInView >= data.startIndex &&
      currentUserRankIndexInView <= data.stopIndex
    ) {
      setCurrentUserRankInView({ inView: true });
    } else {
      let position: any;
      if (currentUserRankIndexInView !== undefined) {
        if (currentUserRankIndexInView < data.startIndex) {
          position = 'top';
        } else if (currentUserRankIndexInView > data.startIndex) {
          position = 'bottom';
        } else {
          position = undefined;
        }
      } else {
        position = undefined;
      }

      setCurrentUserRankInView({ inView: false, position: position });
    }
  };

  const onGoToTopicDetail = (studentIdInput: string) =>
    router.push(`/learning/${studentIdInput}`);

  const slideProperties = {
    autoplay: false,
    duration: 999999999999,
    indicators: false,
    onChange: handleChangeSlideIndex,
    prevArrow: (
      <ArrowLeftIcon
        sx={{
          color: '#ffffff',
          fontSize: '20px',
          cursor: 'pointer',
          width: '30px',
          height: '30px',
        }}
      />
    ),
    nextArrow: (
      <ArrowRightIcon
        sx={{
          color: '#ffffff',
          fontSize: '20px',
          cursor: 'pointer',
          width: '30px',
          height: '30px',
        }}
      />
    ),
    transitionDuration: 300,
    defaultIndex: 1,
  };

  function calculateVocabulary(item: any) {
    return Math.round(
      ((item.vocabularyMemorized || 0) / (item.totalVocabulary || 1)) * 100
    );
  }

  useEffect(() => {
    const newCurrentEnrollmentList: GraphqlTypes.LearningTypes.Maybe<
    GraphqlTypes.LearningTypes.Enrollment[] | undefined
    > =
      topicsLearningStatus === TopicLearningStatusTypes.All
        ? currentUser?.enrollments
        : cloneDeep(currentUser?.enrollments)?.filter(
          (item) => item.isCompleted
        );

    setCurrentEnrollmentList(newCurrentEnrollmentList ?? []);
  }, [currentUser, topicsLearningStatus]);

  useEffect(() => {
    setCategorySelectedId(categories?.[1]?.id ?? '');
    categorySelectedIdRef.current = categories?.[1]?.id ?? '';
  }, [categories]);

  useEffect(() => {
    if (categorySelectedId) {
      GetCapacityChartDataOfCurrentUser({
        variables: {
          categoryId: categorySelectedId,
        },
      });
    }
  }, [categorySelectedId]);

  useEffect(() => {
    if (rankTypes.length) {
      setRankQueryPagination({
        ...rankQueryPagination,
        name: rankTypes?.[1]?.name || '',
      });

      setRankTypeSelected(rankTypes[1]);
    }
  }, [rankTypes]);

  useEffect(() => {
    if (rankQueryPagination.name) {
      GetRanks({
        variables: {
          name: rankQueryPagination.name,
          pageNumber: rankQueryPagination.pageNumber,
          limit: rankQueryPagination.limit,
        },
      });
    }
  }, [rankQueryPagination]);

  useEffect(() => {
    const summaryMemoryStatus = cloneDeep(currentUser?.summaryMemoryStatus);

    if (
      summaryMemoryStatus?.forgotVocabularies &&
      summaryMemoryStatus?.forgotVocabularies.length > 0
    ) {
      setVocabulariesForgot([...summaryMemoryStatus.forgotVocabularies]);
    }
    if (
      summaryMemoryStatus?.memorizedVocabularies &&
      summaryMemoryStatus?.memorizedVocabularies.length > 0
    ) {
      setVocabulariesMemorized([...summaryMemoryStatus.memorizedVocabularies]);
    }
    if (
      summaryMemoryStatus?.vagueVocabularies &&
      summaryMemoryStatus?.vagueVocabularies.length > 0
    ) {
      setVocabulariesVague([...summaryMemoryStatus.vagueVocabularies]);
    }
  }, [currentUser]);

  useEffect(() => {
    const integer = Math.floor(
      (currentEnrollmentList?.length ?? 0) / showTopicFormState.limit
    );
    const remainder =
      (currentEnrollmentList?.length ?? 0) -
        integer * showTopicFormState.limit >
      0
        ? 1
        : 0;
    setTopicListNumberPage(integer + remainder);

    handleShowTopic(showTopicFormState);
  }, [currentEnrollmentList, showTopicFormState]);

  useEffect(() => {
    setShowTopicFormState({
      ...showTopicFormState,
      pageNumber: 1,
    });
  }, [currentEnrollmentList]);

  useEffect(() => {
    if (currentUser && rankTypeSelected) {
      GetMyRank({
        variables: {
          rankType: rankTypeSelected?.name,
        },
      });
    }
  }, [rankTypeSelected, currentUser]);

  useEffect(() => {
    const findCurrentUserRankIndex = currentRanks?.findIndex(
      (item) => item.user?.id === currentUserRank?.user?.id
    );

    setCurrentUserRankIndex(
      findCurrentUserRankIndex >= 0
        ? findCurrentUserRankIndex
        : currentRanks.length
    );
  }, [currentRanks, currentUserRank]);

  useEffect(() => {
    if (rowsRenderedData)
      handleCurrentUserRankInView(rowsRenderedData, currentUserRankIndex);
  }, [rowsRenderedData, currentUserRankIndex]);

  useEffect(() => {
    if (capacityChartDataOfCurrentUser) {
      currentUserCategoryDetailsRef.current = capacityChartDataOfCurrentUser;

      const newCategoryDetails = cloneDeep(capacityChartDataOfCurrentUser);

      const newChartState = cloneDeep(chartState);

      const chartXaxisCategories = cloneDeep(
        newCategoryDetails.specializations ?? []
      ).map((item: any) => item.name);

      newChartState.options.xaxis.categories = chartXaxisCategories;
      newChartState.options.xaxis.labels.style.colors = cloneDeep(
        newCategoryDetails.specializations ?? []
      ).map((item: any) => theme.colors.secondary.lighter);

      newChartState.series[0].name = t('Total') + ':';
      const xaxisData0 = cloneDeep(
        newCategoryDetails.specializations ?? []
      ).map((item: any) => 100);
      newChartState.series[0].data = xaxisData0;

      newChartState.series[1].name = t('Me') + ':';
      const xaxisData1 = cloneDeep(
        newCategoryDetails.specializations ?? []
      ).map((item: any) => calculateVocabulary(item));
      newChartState.series[1].data = xaxisData1;

      newChartState.series[2].name = '';
      newChartState.series[2].data = [];
      setChartState(newChartState);
    }
  }, [capacityChartDataOfCurrentUser, language]);

  useEffect(() => {
    if (capacityChartDataOfAnyUser) {
      anyUserCategoryDetailsRef.current = capacityChartDataOfAnyUser;

      const newCategoryDetails = cloneDeep(capacityChartDataOfAnyUser);

      const newChartState = cloneDeep(chartState);

      newChartState.series[2].name = `${userSelected.current?.identity?.traits.firstName} ${userSelected.current?.identity?.traits.lastName}:`;
      const xaxisData = cloneDeep(newCategoryDetails.specializations ?? []).map(
        (item: any) => calculateVocabulary(item)
      );
      newChartState.series[2].data = xaxisData;

      setChartState(newChartState);
    }
  }, [capacityChartDataOfAnyUser, language]);

  useEffect(() => {
    GetCurrentUser();
    GetCategories();
    GetRankTypes();

    if (jsCookies.get('inviter_id')) {
      AcceptInvitation({
        variables: {
          invitationAcceptInput: {
            inviterId: jsCookies.get('inviter_id'),
          },
        },
      });
    }
  }, []);

  if (!currentUser) return <Loading />;

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
      <Title currentUser={currentUser} />

      {/* content */}
      <BoxWrapper>
        {/* thumbnail */}
        <Banner currentUser={currentUser} />

        {/* statistical */}
        <StatisticalCard
          currentUser={currentUser}
          handleViewVocabularyList={handleViewVocabularyList}
          vocabulariesForgot={vocabulariesForgot}
          vocabulariesMemorized={vocabulariesMemorized}
          vocabulariesVague={vocabulariesVague}
        />

        {/* chart and rank */}
        <Grid container spacing={{ xs: 2, md: '20px' }} alignItems="start">
          {/* chart */}
          <Grid item xs={12} md={7} lg={8}>
            <AbilityChart
              categories={categories}
              categorySelectedId={categorySelectedId}
              chartState={chartState}
              categorySelectedIdRef={categorySelectedIdRef}
              loadingGetCapacityChartDataOfAnyUser={
                loadingGetCapacityChartDataOfAnyUser
              }
              loadingGetCapacityChartDataOfCurrentUser={
                loadingGetCapacityChartDataOfCurrentUser
              }
              handleChangeCategoryOption={handleChangeCategoryOption}
            />
          </Grid>

          {/* rank */}
          <Grid item xs={12} md={5} lg={4}>
            <RankPanel
              currentUser={currentUser}
              userSelected={userSelected.current}
              currentRankUserId={currentRankUserId}
              getMyRankLoading={getMyRankLoading}
              currentUserRankIndex={currentUserRankIndex}
              currentUserRank={currentUserRank}
              getRankUserInfoLoading={getRankUserInfoLoading}
              rankTypeSelected={rankTypeSelected}
              rankQueryPagination={rankQueryPagination}
              getRanksLoading={getRanksLoading}
              rankTypes={rankTypes}
              slideProperties={slideProperties}
              currentRanks={currentRanks}
              currentUserRankInView={currentUserRankInView}
              handleRowsRendered={handleRowsRendered}
              handleClickRatingRow={handleClickRatingRow}
              handleOpenRankUserInfo={handleOpenRankUserInfo}
            />
          </Grid>
        </Grid>

        {/* topic list */}
        <MyTopic
          topicListNumberPage={topicListNumberPage}
          topicPageNumberOptions={topicPageNumberOptions}
          currentEnrollmentsShow={currentEnrollmentsShow}
          language={language}
          topicsLearningStatus={topicsLearningStatus}
          topicsLearningStatusTypes={topicsLearningStatusTypes}
          showTopicFormState={showTopicFormState}
          onGoToTopicDetail={onGoToTopicDetail}
          handleGoToLearningPage={handleGoToLearningPage}
          handleChangeShowTopics={handleChangeShowTopics}
          handleChangeTopicsLearningStatus={handleChangeTopicsLearningStatus}
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
          studentId={studentId}
          myTopic={myTopic} // ? note: myTopic and memoryAnalyses, must have one of 2
          memoryAnalyses={memoryAnalyses} // ? note: myTopic and memoryAnalyses, must have one of 2
          memoryStatus={currentMemoryStatus}
          handleTest={handleTest}
          handleLearning={handleLearning}
          ignoredWords={currentUser.ignoredWords?.filter((item) => item) ?? []}
          sx={{}}
        />
      )}

      {openLessonReview && (
        <LearningPage
          open={openLessonReview}
          setOpen={setOpenLessonReview}
          title={learningPageTitle}
          subtitle={learningPageSubTitle}
          myTopic={myTopic}
          vocabularies={currentVocabulariesForLearning ?? []}
          memoryAnalyses={memoryAnalyses}
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
          vocabularies={currentVocabulariesForTest ?? []}
          topicId={myTopic?.id}
          sx={{}}
        />
      )}

      {currentRankUserInfo && (
        <RankUserCard
          open={openRankUserInfo}
          onClose={handleCloseRankUserInfo}
          rankUserInfo={currentRankUserInfo}
          sx={{}}
          rest={{}}
        />
      )}
    </TopicDetailWrapper>
  );
};

export default Personal;
