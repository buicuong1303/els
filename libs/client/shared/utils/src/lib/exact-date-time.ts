/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import 'moment/locale/vi';

export const exactDateTime = (time: any, language: string | 'en' | 'vi') => {
  moment.locale(language, {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s:  'seconds',
      ss: '%ss',
      m:  'a minute',
      mm: '%dm',
      h:  'an hour',
      hh: '%dh',
      d:  'a day',
      dd: '%dd',
      M:  'a month',
      MM: '%dM',
      y:  'a year',
      yy: '%dY'
    }
  });
  
  // return moment(time).format(`dddd, ${language === 'vi' ? 'Do MMMM' : 'MMMM Do'} , YYYY HH:mm`);
  return moment(time).calendar();
};