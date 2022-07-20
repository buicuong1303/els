/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useRef, useState, useEffect, ReactNode } from 'react';
import { Box } from '@mui/material';
import moment from 'moment';
import { timeRemaining } from '@els/client/shared/utils';
import { useTranslation } from 'react-i18next';

interface TimeRemainingProps {
  startTime?: any;
  endTime?: any;
  timeZone: any;
  language?: string | 'en' | 'vi';
  duration?: number; // milliseconds
  contentTimedOut?: ReactNode;
}

const TimeRemaining: FC<TimeRemainingProps> = (props) => {
  const {
    startTime,
    endTime = new Date(moment().endOf('day').toDate()), // default is end of current day
    language = 'vi',
    duration = 60000,
    contentTimedOut,
  } = props;

  const { t }: { t: any } = useTranslation();

  const intervalRef = useRef<any>();

  const [toggleRerender, setToggleRerender] = useState<boolean>(false);
  const [timeRemainingState, setTimeRemainingState] = useState<{ expire: boolean, content: ReactNode }>();


  useEffect(() => {
    setTimeRemainingState(timeRemaining({ startTime: startTime ?? moment(), endTime, language }));
  }, [toggleRerender, language]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => setToggleRerender(!toggleRerender), duration);
  }, [toggleRerender]);

  useEffect(() => {
    setTimeRemainingState(timeRemaining({ startTime: startTime ?? moment(), endTime, language }));

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  if (!timeRemainingState) return null;

  if (timeRemainingState.expire) {
    return (
      <Box
        component="span"
        children={contentTimedOut ?? timeRemainingState.content}
      />
    );
  }

  return (
    <Box
      component="span"
      children={`${t('Expires after')} ${t(timeRemainingState.content)}`}
    />
  );
};

export { TimeRemaining };
