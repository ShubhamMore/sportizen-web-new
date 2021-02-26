import { Injectable } from '@angular/core';

export class Month {
  constructor(public monthNo: string, public month: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private oneDayInMilliseconds: number;
  private date: Date;
  private dateString: string;
  private dateInMilliseconds: number;
  private dateTimeString: string;
  private dateTimeISOString: string;
  private months: Month[];
  private years: string[];
  private weekDays: string[];

  constructor() {
    this.date = new Date();
    this.oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    this.dateString = this.convertToDateString(this.date);
    this.dateInMilliseconds = this.date.getTime();
    this.dateTimeString = this.convertToDateTimeString(this.date);
    this.dateTimeISOString = this.convertToISOString(this.date);

    this.months = [
      { monthNo: '01', month: 'Jan' },
      { monthNo: '02', month: 'Feb' },
      { monthNo: '03', month: 'Mar' },
      { monthNo: '04', month: 'Apr' },
      { monthNo: '05', month: 'May' },
      { monthNo: '06', month: 'Jun' },
      { monthNo: '07', month: 'Jul' },
      { monthNo: '08', month: 'Aug' },
      { monthNo: '09', month: 'Sep' },
      { monthNo: '10', month: 'Oct' },
      { monthNo: '11', month: 'Nov' },
      { monthNo: '12', month: 'Dec' },
    ];

    this.weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    this.years = [];
    for (let year = 2018; year <= this.date.getFullYear(); year++) {
      this.years.push(year.toString());
    }
  }

  getWeekDays() {
    return this.weekDays;
  }

  getWeekDay(day: number) {
    return this.weekDays[day];
  }

  getDay(date: any) {
    if (!date) {
      return '--';
    }
    date = new Date(date);
    return this.weekDays[date.getDay()];
  }

  getMonths() {
    return this.months;
  }

  getMonthByMonthNumber(monthNo: string) {
    const month: Month = this.months.find((curMonth: Month) => curMonth.monthNo === monthNo);
    if (!month) {
      return '--';
    }
    return month.month;
  }

  getMonth(month: number) {
    return this.months[month].month;
  }

  getCurrentMonth(): string {
    const month = this.date.getMonth();
    return (month + 1).toString().padStart(2, '0');
  }

  getYears() {
    return this.years;
  }

  getCurrentYear(): string {
    return this.date.getFullYear().toString();
  }

  getDate() {
    const date = new Date(this.date);
    return date;
  }

  getDateString() {
    return this.dateString;
  }

  getFormattedDate() {
    return this.formatDate(this.dateString);
  }

  getDateInMilliseconds(): number {
    return this.dateInMilliseconds;
  }

  getDateTimeString() {
    return this.dateTimeString;
  }

  getDateTimeISOString() {
    return this.dateTimeISOString;
  }

  dateToMilliseconds(date: any) {
    return new Date(date).getTime();
  }

  millisecondsToDate(milliseconds: number) {
    return new Date(milliseconds);
  }

  millisecondsToDateString(milliseconds: number) {
    return this.convertToDateString(milliseconds);
  }

  convertToDate(date: any): Date {
    return new Date(date);
  }

  convertToDateString(date: any): string {
    if (!date) {
      return '--';
    }
    date = new Date(date);
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    );
  }

  reverseDate(date: string) {
    if (!date) {
      return '--';
    }
    return date.split('-').reverse().join('-');
  }

  addDaysInDate(date: any, days: number) {
    if (!date) {
      return '--';
    }
    const curDate = new Date(date);
    curDate.setDate(curDate.getDate() + (days - 1));

    const myDate = new Date(curDate);

    return myDate;
  }

  convertToISOString(date: any) {
    if (!date) {
      return '--';
    }
    return new Date(date).toISOString();
  }

  convertToDateTimeString(date: any): string {
    if (!date) {
      return '--';
    }
    date = new Date(date);
    return (
      this.convertToDateString(date) +
      'T' +
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0')
    );
  }

  convertToDateTimeHourString(date: any): string {
    if (!date) {
      return '--';
    }
    date = new Date(date);
    return (
      this.convertToDateString(date) +
      ' ' +
      this.formatTime(
        date.getHours().toString().padStart(2, '0') +
          ':' +
          date.getMinutes().toString().padStart(2, '0')
      )
    );
  }

  formatDate(date: string) {
    if (!date) {
      return '--';
    }
    return date.split('-').reverse().join('-');
  }

  formatTime(time: any) {
    if (!time) {
      return '--';
    }
    time = time.split(':');
    let hours = +time[0];
    const minute = time[1];
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    return hours.toString().padStart(2, '0') + ':' + minute + ' ' + meridiem;
  }

  formatDateTime(date: any) {
    if (!date) {
      return '--';
    }
    date = new Date(date).toISOString().split('T');
    return this.formatDate(date[0]) + ' ' + this.formatTime(date[1]);
  }

  compareDates(date1: any, date2: any): boolean {
    return this.convertToDate(date1) <= this.convertToDate(date2);
  }

  dateDifferenceInDays(date1: any, date2: any) {
    const dateDifference = this.dateToMilliseconds(date2) - this.dateToMilliseconds(date1);
    return dateDifference / this.oneDayInMilliseconds;
  }

  getUpToTime(date: any): string {
    date = new Date(date).getTime();
    const curDate = this.getDateInMilliseconds();
    const timeDifference = Math.round((curDate - date) / 1000); // 1 sec  = 1000 ms
    if (timeDifference >= 0 && timeDifference < 60) {
      return timeDifference + ' sec'; // 1 sec  = 1000 ms
    } else if (timeDifference >= 60 && timeDifference < 3600) {
      const difference = Math.round(timeDifference / 60); // 1 min = 60 sec
      return difference + (difference <= 1 ? ' min' : ' mins');
    } else if (timeDifference >= 3600 && timeDifference < 86400) {
      const difference = Math.round(timeDifference / (60 * 60)); // 1 hr = 60 m
      return difference + (difference <= 1 ? ' hr' : ' hrs');
    } else if (timeDifference >= 86400 && timeDifference < 604800) {
      const difference = Math.round(timeDifference / (60 * 60 * 24)); // 1 day = 24 hr
      return difference + (difference <= 1 ? ' day' : ' days');
    } else if (timeDifference >= 604800 && timeDifference < 2630880) {
      const difference = Math.round(timeDifference / (60 * 60 * 24 * 7)); // 1 week = 7 day
      return difference + (difference <= 1 ? ' week' : ' weeks');
    } else if (timeDifference >= 2630880 && timeDifference < 31570560) {
      const difference = Math.round(timeDifference / (60 * 60 * 24 * 7 * 4.35)); // 1 month = 4.35 weeks
      return difference + (difference <= 1 ? ' month' : ' months');
    } else if (timeDifference >= 31570560) {
      const difference = Math.round(timeDifference / (60 * 60 * 24 * 7 * 4.35 * 12)); // 1 year = 12 months
      return difference + (difference <= 1 ? ' year' : ' years');
    } else {
      return '';
    }
  }
}
