/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
import FullCalendar, { EventContentArg } from '@fullcalendar/react';

import { ToastifyContext } from '@els/client/app/shared/contexts';
import { Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import jsCookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FC, useContext, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BreadcrumbsCustom, AttendanceIcon } from '@els/client/app/shared/ui';
import { EventItem } from '@els/client/app/attendance/ui';
import { GraphqlMutations, GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { ApolloClient } from '@els/client/shared/data-access';
import moment from 'moment';
import { cloneDeep, forEach } from 'lodash';

// The import order DOES MATTER here. If you change it, you'll get an error!
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { handleApolloError } from '@els/client/shared/utils';

const AttendanceWrapper = styled(Box)(
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

export interface AttendanceProps {}

export const Attendance: FC<AttendanceProps> = (props) => {
  const theme = useTheme();

  const router = useRouter();

  const { t }: { t: any } = useTranslation();

  const language = jsCookies.get('i18nextLng') ?? window?.localStorage?.getItem('i18nextLng') ?? 'vi';

  const { toastify } = useContext(ToastifyContext);

  // * render ui
  const renderEventItem = (eventData: EventContentArg) => {
    const callback = eventData.event.extendedProps.callback;
    const isCurrentDay = eventData.event.extendedProps.isCurrentDay;
    const isCompleted = eventData.event.extendedProps.isCompleted;

    return <EventItem isCurrentDay={isCurrentDay} isCompleted={isCompleted} callback={() => callback(eventData)} />;
  };

  // * page ref
  const attendanceEventsRef = useRef<any[]>([]);

  // * page state
  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();
  const [attendanceUser, setAttendanceUser] = useState<GraphqlTypes.LearningTypes.AssignedMission[]>([]);
  interface AttendanceEvent {
    display: string,
    backgroundColor: string,
    isCurrentDay: boolean,
    isCompleted: boolean,
    callback?: () => void,
    start: string,
  }
  const [attendanceEvents, setAttendanceEvents] = useState<AttendanceEvent[]>([]);

  // * load data
  const [GetCurrentUser] = useLazyQuery<{ user: GraphqlTypes.LearningTypes.User }>(
    GraphqlQueries.LearningQueries.User.GetUser,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        if (data?.user) setCurrentUser(data?.user);
      },
      onError: (error: ApolloError) => handleApolloError(error, toastify),
    }
  );

  const [GetAttendanceUser] = useLazyQuery<{ attendanceUser: GraphqlTypes.LearningTypes.AssignedMission[] }>(
    GraphqlQueries.LearningQueries.User.GetAttendanceUser,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        console.log(data);
        setAttendanceUser(data.attendanceUser ?? []);
      },
      onError: (error: ApolloError) => handleApolloError(error, toastify),
    }
  );

  const [CheckIn] = useMutation(
    GraphqlMutations.LearningMutations.User.CheckIn,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onError: (error: ApolloError) => handleApolloError(error, toastify),
      onCompleted: () => {
        // ? note: Because the data returned from useMutation is not enough to automatically or actively write to the cache, it must be retrieved from the database via fetchPolicy: 'network-only'
        GetAttendanceUser({
          fetchPolicy: 'network-only'
        });
      }
    }
  );

  // * handle logic
  const handleAttendance = () => {
    CheckIn();
    const newAttendanceEvents = cloneDeep(attendanceEventsRef.current);
    newAttendanceEvents[newAttendanceEvents.length - 1].isCompleted = true;
    setAttendanceEvents(newAttendanceEvents);
  };

  const handleStyleFullCalendar = () => {
    const prevButtons = document.getElementsByClassName('fc-prev-button') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < prevButtons.length; i++) {
      const element = prevButtons[i];
      element.style.background = '#ffffff00';
      element.style.color = theme.colors.primary.main;
      element.style.border = 'unset';
      element.style.outline = 'unset';
      element.style.boxShadow = 'unset';
    }

    const todayButtons = document.getElementsByClassName('fc-today-button') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < todayButtons.length; i++) {
      const element = todayButtons[i];
      element.style.background = '#ffffff00';
      element.style.color = theme.colors.primary.main;;
      element.style.border = `1px solid ${theme.colors.primary.main}`;
      element.style.padding = '8px 12px';
      element.style.fontWeight = '700';
      element.style.fontSize = '13px';
      element.style.lineHeight = '15px';
      element.style.boxShadow = 'unset';
      element.innerHTML = t('Today');
    }

    const nextButtons = document.getElementsByClassName('fc-next-button') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < nextButtons.length; i++) {
      const element = nextButtons[i];
      element.style.background = '#ffffff00';
      element.style.color = theme.colors.primary.main;
      element.style.border = 'unset';
      element.style.outline = 'unset';
      element.style.boxShadow = 'unset';
    }

    const cellsHeader = document.getElementsByClassName('fc-col-header-cell') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < cellsHeader.length; i++) {
      const element = cellsHeader[i];
      element.style.backgroundColor = theme.palette.background.default;
      element.style.height = '64px';
      element.style.verticalAlign = 'middle';
      element.style.fontSize = '14px';
      element.style.fontWeight = '700';
      element.style.textTransform = 'uppercase';
    }

    const cellsBody = document.getElementsByClassName('fc-daygrid-day-frame') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < cellsBody.length; i++) {
      const element = cellsBody[i];
      element.style.padding = '16px';
      element.style.maxHeight = '140px';
    }

    const datesNumber = document.getElementsByClassName('fc-daygrid-day-number') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < datesNumber.length; i++) {
      const element = datesNumber[i];
      element.style.fontSize = '18px';
      element.style.fontWeight = '400';
      element.style.padding = '0px';
      element.style.lineHeight = '25px';
      element.style.marginRight = '5px';
    }
  };

  // * useEffect
  useEffect(() => {
    GetCurrentUser();

    GetAttendanceUser();
  }, []);

  useEffect(() => {
    if (currentUser?.createdAt && attendanceUser) {
      const newAttendanceEvents: AttendanceEvent[] = [];

      attendanceUser.forEach(attendance => {
        const start = moment(attendance.createdAt);

        newAttendanceEvents.push({
          display: 'background',
          backgroundColor: 'unset',
          isCurrentDay: start.isSame(moment(), 'day'),
          isCompleted: !!attendance.completedAt,
          start: start.format('YYYY-MM-DD'),
        });
      });

      if (newAttendanceEvents.findIndex(item => item.start === moment().format('YYYY-MM-DD')) === -1) {
        newAttendanceEvents.push({
          display: 'background',
          backgroundColor: 'unset',
          isCurrentDay: true,
          isCompleted: false,
          callback: handleAttendance,
          start: moment().format('YYYY-MM-DD'),
        });
      }
      setAttendanceEvents(newAttendanceEvents);
    }
  }, [currentUser?.createdAt, attendanceUser]);

  useEffect(() => {
    handleStyleFullCalendar();
  }, [language]);

  useEffect(() => {
    attendanceEventsRef.current = attendanceEvents;
  }, [attendanceEvents]);

  // * render ui
  return (
    <AttendanceWrapper
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
        title={t('Attendance')}
        breadcrumbsList={[]}
        icon={<AttendanceIcon width="36px" height="36px" color="unset" />}
      />

      {/* content */}
      <BoxWrapper sx={{ minHeight: '100%' }}>
        <Box
          sx={{
            bgcolor: theme.colors.alpha.white[100],
            boxShadow: theme.colors.shadows.card,
            borderRadius: '6px',
            p: 5,
          }}
        >
          <FullCalendar
            height="auto"
            locale={language}
            headerToolbar={{
              start: 'prev today next',
              center: 'title',
              end: '',
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            plugins={[dayGridPlugin, interactionPlugin]}
            events={attendanceEvents}
            eventContent={renderEventItem}
            dayCellDidMount={handleStyleFullCalendar}
          />
        </Box>
      </BoxWrapper>
    </AttendanceWrapper>
  );
};

export default Attendance;
