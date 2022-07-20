/* eslint-disable @typescript-eslint/no-empty-interface */

// next, react
import { useRouter } from 'next/router';
import {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// material
import { Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// other
import { useLazyQuery, useMutation } from '@apollo/client';
import { ApexOptions } from 'apexcharts';
import jsCookies from 'js-cookie';
import { cloneDeep, orderBy } from 'lodash';
import { useTranslation } from 'react-i18next';

// custom context
import { ToastifyContext } from '@els/client/app/shared/contexts';

// interface
import {
  GraphqlMutations,
  GraphqlQueries,
  GraphqlSubscriptions,
  GraphqlTypes,
} from '@els/client/app/shared/data-access';

// until

// ui
import { BreadcrumbsCustom, MissionIcon } from '@els/client/app/shared/ui';

// apollo client
import {
  CongratulationCard,
  InfoPanel,
  PersonalMission,
  StreakChart,
  SystemMission,
} from '@els/client/app/mission/ui';
import { SettingOptions } from '@els/client/app/setting/feature';
import { ApolloClient } from '@els/client/shared/data-access';
import { getDayAndMonth, getWeekday } from '@els/client/shared/utils';
import moment from 'moment-timezone';

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

const BoxFlexCenter = styled(Box)(
  ({ theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
  `
);
export const BoxNoRecords = () => {
  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  return (
    <BoxFlexCenter
      children={t('No records to display')}
      sx={{
        p: theme.spacing(4, 1.5),
        m: 'auto',
      }}
    />
  );
};

export enum PersonalMissionTypes {
  Daily = 'daily',
  Weekly = 'weekly',
  Completed = 'completed',
}

const personalMissionOptions = [
  { label: PersonalMissionTypes.Daily, value: PersonalMissionTypes.Daily },
  { label: PersonalMissionTypes.Weekly, value: PersonalMissionTypes.Weekly },
  {
    label: PersonalMissionTypes.Completed,
    value: PersonalMissionTypes.Completed,
  },
];

export interface MissionProps {}

export const Mission: FC<MissionProps> = (props) => {
  const theme = useTheme();

  const router = useRouter();

  const { t }: { t: any } = useTranslation();

  const language =
    jsCookies.get('i18nextLng') ??
    window?.localStorage?.getItem('i18nextLng') ??
    'vi';

  const { toastify } = useContext(ToastifyContext);

  // * page ref
  const experienceGainedRef = useRef<number[]>([]);
  const targetRef = useRef<number[]>([]);

  // * page state
  const [currentUser, setCurrentUser] =
    useState<GraphqlTypes.LearningTypes.User>();
  const [personalAssignedMissions, setPersonalAssignedMissions] = useState<
  GraphqlTypes.LearningTypes.AssignedMission[]
  >([]);
  const [systemAssignedMissions, setSystemAssignedMissions] = useState<
  GraphqlTypes.LearningTypes.AssignedMission[]
  >([]);
  const [assignedMissionLoadingIds, setAssignedMissionLoadingIds] = useState<{
    [key: string]: string;
  }>({});
  interface ChartDataItemType {
    value: number;
    label: string;
  }
  interface ChartDataType {
    experienceGained: ChartDataItemType[];
    target: ChartDataItemType[];
  }
  interface PersonalMissionFormStateType {
    typeOptions: PersonalMissionTypes;
  }
  const initPersonalMissionFormState: PersonalMissionFormStateType = {
    typeOptions: PersonalMissionTypes.Daily,
  };
  const [personalMissionFormState, setPersonalMissionFormState] =
    useState<PersonalMissionFormStateType>(initPersonalMissionFormState);

  interface ChartStateInitType {
    options: ApexOptions;
    series: ApexOptions['series'];
  }
  const changeChartColor = () => {
    return changeChartColumnColor({
      experienceGained: experienceGainedRef.current,
      target: targetRef.current,
    });
  };

  const chartStateInit: ChartStateInitType = {
    options: {
      chart: {
        id: 'apexchart-column',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        type: 'bar',
        events: {
          mounted: () => changeChartColor(),
          updated: () => changeChartColor(),
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20',
          borderRadius: 4,
        },
      },
      stroke: {
        show: true,
        width: 4,
        colors: ['transparent'],
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        borderColor: theme.colors.secondary.light,
        strokeDashArray: 5,
      },
      xaxis: {
        labels: {
          rotate: -1,
          rotateAlways: true,
          hideOverlappingLabels: false,
          showDuplicates: true,
          offsetX: 4,
          offsetY: 4,
          style: {
            colors: theme.colors.secondary.light,
            fontSize: '15px',
            fontWeight: '400px',
          },
        },
      },
      tooltip: {
        enabled: true,
        marker: {
          show: false,
        },
        y: {
          formatter: (value) => `${value} ${t('scores')}`,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          opacityFrom: 0.8,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
    },
    series: [
      {
        name: '',
        data: [],
      },
      {
        name: '',
        data: [],
      },
    ],
  };
  const [chartState, setChartState] = useState<any>(chartStateInit);

  const chartStateMemo = useMemo(() => chartState, [chartState]);

  // * congratulation level
  interface CongratulationCardValueType {
    open: boolean;
    icon?: any;
    title?: ReactNode;
    message?: ReactNode;
  }

  const initCongratulationValue: CongratulationCardValueType = {
    open: false,
    icon: '',
    title: '',
    message: '',
  };

  // * congratulation level
  const [congratulationLevelCardValue, setCongratulationLevelCardValue] =
    useState<CongratulationCardValueType>(initCongratulationValue);

  const handleCloseCongratulationLevelCard = () => {
    setCongratulationLevelCardValue(initCongratulationValue);
  };

  // * congratulation streak
  const [congratulationStreakCardValue, setCongratulationStreakCardValue] =
    useState<CongratulationCardValueType>(initCongratulationValue);

  const handleCloseCongratulationStreakCard = () => {
    setCongratulationStreakCardValue(initCongratulationValue);
  };

  // * load data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const onError = (error: any) => {
    return toastify({
      message: error.message,
      type: 'error',
    });
  };

  const [GetCurrentUser, { loading: getCurrentUserLoading }] = useLazyQuery<{
    user: GraphqlTypes.LearningTypes.User;
  }>(GraphqlQueries.LearningQueries.User.GetUser, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      if (data?.user) setCurrentUser(data?.user);
    },
    onError,
  });

  const [
    GetPersonalAssignedMissions,
    {
      loading: getPersonalAssignedMissionsLoading,
      subscribeToMore: subscriptionGetPersonalAssignedMissions,
    },
  ] = useLazyQuery<{
    assignedMissions: GraphqlTypes.LearningTypes.AssignedMission[];
  }>(GraphqlQueries.LearningQueries.Mission.GetAssignedMissions, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setPersonalAssignedMissions(
        orderBy(data?.assignedMissions ?? [], ['createdAt'], 'desc')
      );
    },
    onError,
    fetchPolicy: 'network-only', // ? note: When standing on another page and completing the task, the task does not update to the cache, so when returning to the task page, it is necessary to reload the data from the database.
  });

  const [
    GetSystemAssignedMissions,
    {
      loading: getSystemAssignedMissionsLoading,
      subscribeToMore: subscriptionGetSystemAssignedMissions,
    },
  ] = useLazyQuery<{
    assignedMissions: GraphqlTypes.LearningTypes.AssignedMission[];
  }>(GraphqlQueries.LearningQueries.Mission.GetAssignedMissions, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setSystemAssignedMissions(
        orderBy(data?.assignedMissions ?? [], ['createdAt'], 'desc')
      );
    },
    onError,
    fetchPolicy: 'network-only', // ? note: When standing on another page and completing the task, the task does not update to the cache, so when returning to the task page, it is necessary to reload the data from the database.
  });

  const [DoneAssignedMission, { loading: doneAssignedMissionLoading }] =
    useMutation<{
      assignedMission: {
        doneAssignedMission: GraphqlTypes.LearningTypes.AssignedMission;
      };
    }>(GraphqlMutations.LearningMutations.Mission.DoneAssignedMission, {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onError,
    });

  // * handle logic
  const handleChangePersonalMissionOptions = (value: PersonalMissionTypes) => {
    setPersonalMissionFormState({
      ...personalMissionFormState,
      typeOptions: value,
    });
  };

  const changeChartColumnColor = (data: {
    experienceGained: number[];
    target: number[];
  }) => {
    const experienceGainedFailedIndexs = cloneDeep(data.experienceGained)
      .map((item, index) => (item < data.target[index] ? index : undefined))
      .filter((item) => item !== undefined);

    const apexchartsSeries = document.getElementsByClassName(
      'apexcharts-series'
    ) as HTMLCollectionOf<HTMLElement>;

    const apexchartsSeriesX0 = apexchartsSeries[0];
    if (apexchartsSeriesX0) {
      const childrens =
        apexchartsSeriesX0.children as HTMLCollectionOf<HTMLElement>;

      experienceGainedFailedIndexs.forEach((item) => {
        if (item !== undefined) {
          const element = childrens[item];
          if (element) element.style.fill = theme.colors.secondary.light;
        }
      });
    }

    const apexchartsSeriesX1 = apexchartsSeries[1];
    if (apexchartsSeriesX1) {
      const childrens =
        apexchartsSeriesX1.children as HTMLCollectionOf<HTMLElement>;

      data.target.forEach((item, index) => {
        const element = childrens[index];
        if (element) element.style.fill = theme.colors.primary.lighter;
        
      });
    }
  };

  const goToSettingPage = (data: { tab: SettingOptions }) => {
    router.push({
      pathname: '/settings',
      query: {
        tab: data.tab,
      },
    });
  };

  const handlePerform = (missionCode: string) => {
    switch (missionCode) {
      case GraphqlTypes.LearningTypes.MissionCode.CheckIn:
        router.push('/attendance');
        break;

      case GraphqlTypes.LearningTypes.MissionCode.ReviewForgot:
      case GraphqlTypes.LearningTypes.MissionCode.ReviewVague:
      case GraphqlTypes.LearningTypes.MissionCode.LearnNew:
      case GraphqlTypes.LearningTypes.MissionCode.Complete_1Topic:
      case GraphqlTypes.LearningTypes.MissionCode.Complete_2Topics:
      case GraphqlTypes.LearningTypes.MissionCode.Streaks_3:
      case GraphqlTypes.LearningTypes.MissionCode.Streaks_5:
      case GraphqlTypes.LearningTypes.MissionCode.ObtainLevel_10:
      case GraphqlTypes.LearningTypes.MissionCode.Top_1:
        router.push('/');
        break;

      case GraphqlTypes.LearningTypes.MissionCode.Invite_5Persons:
        router.push('/referral');
        break;

      default:
        break;
    }
  };

  const handleGetRewarded = useCallback(
    (data: { assignedMissionId: string }) => {
      setAssignedMissionLoadingIds({
        ...assignedMissionLoadingIds,
        [data.assignedMissionId]: data.assignedMissionId,
      });

      DoneAssignedMission({
        variables: {
          doneAssignedMissionInput: {
            assignedMissionId: data.assignedMissionId,
          },
        },
      });
    },
    [assignedMissionLoadingIds, currentUser]
  );

  const maxStreakLength = 7;

  const getStreaks = () => {
    let streaks = orderBy(
      currentUser?.extraInfo?.currentStreakList?.streaks ?? [],
      ['createdAt'],
      'asc'
    );

    streaks = streaks.map((item) => {
      return {
        ...item,
        createdAt: moment(item.createdAt).format('MM-DD-YYYY'),
      };
    });
    const noHadStreakToday = !moment().isSame(
      moment(streaks?.[streaks.length - 1]?.createdAt),
      'day'
    );
    if (!streaks.length || noHadStreakToday) {
      streaks.push({
        createdAt: moment().format('MM-DD-YYYY'),
        expDate: currentUser?.expDate ?? 0,
        expTarget: currentUser?.setting?.appSetting?.exp ?? 0,
      });
    }

    if (streaks.length < maxStreakLength) {
      [...new Array(maxStreakLength - streaks.length)].forEach(
        (item, index) => {
          streaks.push({
            createdAt: moment()
              .add(index + 1, 'day')
              .format('MM-DD-YYYY'),
            expDate: 0,
            expTarget: currentUser?.setting?.appSetting?.exp ?? 0,
          });
        }
      );
    }
    return streaks;
  };

  const newChartStateStyle = (data:number)=>{
    if(data<=10){
      return {
        width: '50',
        borderRadius: 8
      };
    } else if(data<=20){
      return {
        width: '65',
        borderRadius: 6
      };
    }
    return {
      width: '80',
      borderRadius: 4
    };
  };
  const chartStateOptionXaxis = (newChartState:any, target:any,  streaks:any, chartData:ChartDataType)=>{
    if (newChartState.options.xaxis) {
      newChartState.options.xaxis.tickAmount =
        target.length <= 15 ? target.length : Math.round(target.length / 3);
      newChartState.options.xaxis.categories = cloneDeep(
        chartData.target
      ).map((item) =>
        chartData.target.length <= 7
          ? t(getWeekday(new Date(item.label), true))
          : t(getDayAndMonth(new Date(item.label), language, 'Do MMMM'))
      );
      newChartState.options.xaxis.labels.style.colors = [
        ...new Array(7),
      ].map((item, index) => {
        if (moment(streaks[index].createdAt).isSame(moment(), 'day'))
          return theme.colors.warning.dark;
        return theme.colors.secondary.light;
      });
      
    }
  };

  // * useEffect
  useEffect(() => {
    if (currentUser) {
      const streaks = getStreaks();
      const newChartState = {
        ...chartState,
      };

      getStreaks();
      const chartData: ChartDataType = {
        experienceGained: cloneDeep(streaks).map((item: any) => {
          return {
            label: moment(item.createdAt).format('YYYY/MM/DD'),
            value: item.expDate,
          };
        }),
        target: cloneDeep(streaks).map((item: any) => {
          return {
            label: moment(item.createdAt).format('YYYY/MM/DD'),
            value: item.expTarget,
          };
        }),
      };

      const experienceGained = cloneDeep(chartData.experienceGained).map(
        (item) => item.value
      );
      experienceGainedRef.current = experienceGained;

      const target = cloneDeep(chartData.target).map((item) => item.value);
      targetRef.current = target;

      const series: ApexOptions['series'] = [
        {
          name: t('Experience gained'),
          data: experienceGained,
          color: theme.colors.warning.dark,
        },
        {
          name: t('Target'),
          data: target,
          color: theme.colors.primary.lighter,
        },
      ];

      newChartState.series = series;
      
      chartStateOptionXaxis(newChartState, target, streaks, chartData);

      if (newChartState.options.plotOptions?.bar) {
        newChartState.options.plotOptions.bar.columnWidth = newChartStateStyle(chartData.target.length).width;
        newChartState.options.plotOptions.bar.borderRadius= newChartStateStyle(chartData.target.length).borderRadius;
      }

      setChartState(newChartState);
    }
  }, [currentUser, language]);


  useEffect(() => {
    if (personalMissionFormState.typeOptions)
      GetPersonalAssignedMissions({
        variables: {
          category: personalMissionFormState.typeOptions,
        },
      });
  }, [personalMissionFormState]);

  useEffect(() => {
    if (subscriptionGetPersonalAssignedMissions) {
      // * subscription for personal mission
      subscriptionGetPersonalAssignedMissions({
        document:
          GraphqlSubscriptions.LearningMutations.Mission
            .SubscriptionMissionCompleted,
        updateQuery: (prev, { subscriptionData }) => {
          if (GetPersonalAssignedMissions)
            GetPersonalAssignedMissions({
              variables: {
                category: personalMissionFormState.typeOptions,
              },
            });

          return prev;
        },
      });
    }
  }, [subscriptionGetPersonalAssignedMissions, personalMissionFormState]);

  useEffect(() => {
    if (subscriptionGetSystemAssignedMissions) {
      // * subscription for system mission
      subscriptionGetSystemAssignedMissions({
        document:
          GraphqlSubscriptions.LearningMutations.Mission
            .SubscriptionMissionCompleted,
        updateQuery: (prev, { subscriptionData }) => {
          if (GetSystemAssignedMissions)
            GetSystemAssignedMissions({
              variables: {
                category: 'none-repeatable',
              },
            });

          return prev;
        },
      });
    }
  }, [subscriptionGetSystemAssignedMissions]);

  useEffect(() => {
    GetCurrentUser();

    GetSystemAssignedMissions({
      variables: {
        category: 'none-repeatable',
      },
    });
  }, []);

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
        title={t('Missions')}
        breadcrumbsList={[]}
        icon={<MissionIcon width="36px" height="36px" />}
      />

      {/* content */}
      <BoxWrapper>
        {/* info */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
          {/* group info */}
          <InfoPanel
            currentUser={currentUser}
            getCurrentUserLoading={getCurrentUserLoading}
          />

          {/* chart */}
          <StreakChart
            currentUser={currentUser}
            getCurrentUserLoading={getCurrentUserLoading}
            goToSettingPage={goToSettingPage}
            chartStateMemo={chartStateMemo}
          />
        </Box>

        {/* mission */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          sx={{ mt: '28px' }}
        >
          <PersonalMission
            assignedMissionLoadingIds={assignedMissionLoadingIds}
            doneAssignedMissionLoading={doneAssignedMissionLoading}
            language={language}
            personalAssignedMissions={personalAssignedMissions}
            getPersonalAssignedMissionsLoading={
              getPersonalAssignedMissionsLoading
            }
            personalMissionOptions={personalMissionOptions}
            personalMissionFormState={personalMissionFormState}
            handlePerform={handlePerform}
            handleGetRewarded={handleGetRewarded}
            handleChangePersonalMissionOptions={
              handleChangePersonalMissionOptions
            }
          />

          <SystemMission
            getSystemAssignedMissionsLoading={getSystemAssignedMissionsLoading}
            systemAssignedMissions={systemAssignedMissions}
            doneAssignedMissionLoading={doneAssignedMissionLoading}
            handlePerform={handlePerform}
            assignedMissionLoadingIds={assignedMissionLoadingIds}
            handleGetRewarded={handleGetRewarded}
          />
        </Box>
      </BoxWrapper>

      <CongratulationCard
        open={congratulationLevelCardValue.open}
        onClose={handleCloseCongratulationLevelCard}
        icon={congratulationLevelCardValue.icon}
        title={congratulationLevelCardValue.title}
        message={congratulationLevelCardValue.message}
        rest={{
          className: congratulationLevelCardValue.open && 'animation-heaving',
        }}
      />

      <CongratulationCard
        open={congratulationStreakCardValue.open}
        onClose={handleCloseCongratulationStreakCard}
        icon={congratulationStreakCardValue.icon}
        title={congratulationStreakCardValue.title}
        message={congratulationStreakCardValue.message}
        rest={{
          className: congratulationStreakCardValue.open && 'animation-heaving',
        }}
      />
    </TopicDetailWrapper>
  );
};

export default Mission;
