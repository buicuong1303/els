/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';
import 'moment/locale/vi';
import { ReactNode } from 'react-transition-group/node_modules/@types/react';

interface timeRemainingType {
  startTime: Date;
  endTime: Date;
  language: string | 'en' | 'vi';
};

interface TimeRemainingResponse {
  expire: boolean;
  content: ReactNode;
}

export const timeRemaining = (data: timeRemainingType): TimeRemainingResponse => {
  const { startTime, endTime, language } = data;

  moment.locale(language);

  if (moment(endTime).isAfter(moment(startTime))) {
    return {
      expire: false,
      content: moment(startTime).to(moment(endTime), true),
    };
  } else {
    return {
      expire: true,
      content: moment(endTime).fromNow(),
    };
  }
};