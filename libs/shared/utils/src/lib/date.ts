import * as moment from 'moment';
export class DateUtil {
  static diffDays(date: Date, otherDate: Date): number {
    return Math.ceil(
      Math.abs(date.valueOf() - otherDate.valueOf()) / (1000 * 60 * 60 * 24)
    );
  }
  static getDates(start: Date, end: Date) {
    const dateArray = [];
    let currentDate = moment(start);
    const stopDate = moment(end);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  static getMonths(start: Date, end: Date) {
    const monthArray = [];
    let currentMonth = moment(start);
    const stopMonth = moment(end).add(1, 'months');
    while (currentMonth <= stopMonth) {
      monthArray.push(moment(currentMonth).format('YYYY-MM'));
      currentMonth = moment(currentMonth).add(1, 'months');
    }
    return monthArray;
  }
}
