/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import 'moment/locale/vi';

export const getDayAndMonth = (time: any, language: string | 'en' | 'vi', vnFormat = 'DD/MM') => {
  moment.locale(language);
  return moment(time).format(`${language === 'vi' ? vnFormat : 'MMM Do'}`);
};