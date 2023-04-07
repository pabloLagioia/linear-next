import dayjs, { Dayjs } from "dayjs";
import dayjsBusinessDays from 'dayjs-business-days2';
 
dayjs.extend(dayjsBusinessDays);

type DateDayJS = Date | string | Dayjs | undefined

export const daysUntil = (futureDate: Date) => {

  const currentDate = dayjs();
  return dayjs(dayjs(futureDate)).businessDiff(currentDate);

}

export const dateDiff = (from: DateDayJS, to: DateDayJS) => from && to ? dayjs(dayjs(to)).businessDiff(dayjs(from)) : undefined

export const yyyyMMDD = (date: DateDayJS) => date ? dayjs(date).format("YYYY-MM-DD") : undefined

export const today = () => dayjs()

export const dateAdd = (from: DateDayJS, daysToAdd: number) => yyyyMMDD(dayjs(from).add(daysToAdd, "day"))