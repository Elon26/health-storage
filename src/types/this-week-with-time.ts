import ReminderScheduleItem from './reminder-schedule-item';

type ThisWeekWithTime = {
  weekdayName: string;
  thisMidnight: number;
  nextMidnight: number;
  schedule: ReminderScheduleItem[];
};

export default ThisWeekWithTime;
