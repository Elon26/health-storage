import Frequency from '@/types/frequency';
import { Schedule } from '@/types/schedule';
import Weekday from '@/types/weekday';

export const defaultScheduleItem: Schedule = {
  frequency: Frequency.everyDay,
  times: [{ hour: 8, minute: 0 }],
  startDate: new Date(),
  endDate: new Date(),
  everyXDayInterval: null,
  cyclicalInterval: null,
  specificDays: [],
};

export const weekdays = [
  Weekday.monday,
  Weekday.tuesday,
  Weekday.wednesday,
  Weekday.thursday,
  Weekday.friday,
  Weekday.saturday,
  Weekday.sunday,
];

export const americanWeekdays = [
  Weekday.sunday,
  Weekday.monday,
  Weekday.tuesday,
  Weekday.wednesday,
  Weekday.thursday,
  Weekday.friday,
  Weekday.saturday,
];
