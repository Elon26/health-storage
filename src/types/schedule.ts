import Frequency from './frequency';
import Weekday from './weekday';

export type Schedule = {
  frequency: Frequency;
  times: DayTime[];
  startDate: Date;
  endDate: Date;
  everyXDayInterval: null | number;
  cyclicalInterval: null | CyclicalInterval;
  specificDays: null | Weekday[];
};

export type DayTime = {
  hour: number;
  minute: number;
};

export type CyclicalInterval = {
  use: number;
  pause: number;
};
