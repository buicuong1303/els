/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import 'moment/locale/vi';

export const fromNow = (data: { time: any, language?: string | 'en' | 'vi', showDetails?: boolean, format?: string }) => {
  const { time, language = 'vi', showDetails = false, format = 'MM-DD-YYYY hh:mm A' } = data;

  moment.locale(language);

  if (showDetails) {
    if (moment(new Date()).endOf('day').isSame(moment(time).endOf('day'))) {
      return moment(time).fromNow();
    } else {
      return moment(time).format(format);
    }
  } else {
    return moment(time).fromNow();
  }
};