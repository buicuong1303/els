/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { fromNow } from '@els/client/shared/utils';
import moment from 'moment';

interface FromNowProps {
  startTime?: any;
  timeZone: any;
  language?: string | 'en' | 'vi';
  duration?: number; // milliseconds
}

const FromNow: FC<FromNowProps> = (props) => {
  const {
    startTime,
    timeZone,
    language = 'vi',
    duration = 60000,
  } = props;

  const intervalRef = useRef<any>();

  const [toggleRerender, setToggleRerender] = useState<boolean>(false);
  const [fromNowState, setFromNowState] = useState<string>();


  useEffect(() => {
    setFromNowState(fromNow({ time: moment(startTime), language: language }));
  }, [toggleRerender, language]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => setToggleRerender(!toggleRerender), duration);
  }, [toggleRerender]);

  useEffect(() => {
    setFromNowState(fromNow({ time: moment(startTime), language: language }));

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  if (!fromNowState) return null;

  return (
    <Box
      component="span"
      children={fromNowState}
    />
  );
};

export { FromNow };
