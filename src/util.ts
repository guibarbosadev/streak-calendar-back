import {
  TChallengeStatus,
  IChallengeCalendar,
  ICustomDate,
} from "./schemas/Challenge";

export function checkIsDateValid(customDate?: ICustomDate) {
  if (!customDate) return false;

  const date = new Date();
  const currentDate: ICustomDate = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
  const { year, month, day } = customDate;
  const isPastYear = currentDate.year > year;
  const isSameYear = currentDate.year === year;
  const isPastMonth = isSameYear ? currentDate.month > month : false;
  const isSameMonth = isSameYear ? currentDate.month === month : false;
  const isPastDay = isSameYear && isSameMonth ? currentDate.day > day : false;
  const isValid = !isPastYear && !isPastMonth && !isPastDay;

  return isValid;
}

export function markDay(params: {
  calendar: IChallengeCalendar;
  date: ICustomDate;
  status: TChallengeStatus;
}) {
  const { calendar, date, status } = params;
  const { year, month, day } = date;
  const currentCalendar: IChallengeCalendar = {
    ...calendar,
    [year]: {
      ...calendar[year],
      [month]: {
        ...calendar[year]?.[month],
        [day]: status,
      },
    },
  };

  if (!status) {
    delete currentCalendar[year][month][day];
  }

  return currentCalendar;
}
