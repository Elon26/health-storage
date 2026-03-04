import Frequency from '@/types/frequency';
import ReminderScheduleItem from '@/types/reminder-schedule-item';
import { DayTime, Schedule } from '@/types/schedule';
import Weekday from '@/types/weekday';
import { uuid } from '@/utils/uuid';

import { americanWeekdays } from '../../../config/constants/default-schedule-item';

const dayTimestamp = 24 * 60 * 60 * 1000;
const today = new Date();
const todayMidnight = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  0,
  0,
  0
).getTime();

function calcEverydaySchedule(
  startTimestamp: number,
  endTimestamp: number,
  times: DayTime[]
) {
  const result: ReminderScheduleItem[] = [];

  const timestampInterval = endTimestamp - startTimestamp;
  const quantityOfDays = Math.ceil(timestampInterval / dayTimestamp);

  for (let i = 0; i < quantityOfDays; i++) {
    times.forEach((time) => {
      const timestamp =
        startTimestamp +
        dayTimestamp * i +
        time.hour * 60 * 60 * 1000 +
        time.minute * 60 * 1000;
      if (timestamp >= todayMidnight) {
        result.push({
          id: uuid(),
          timestamp: timestamp,
          isTaken: null,
          notificationId: null,
        });
      }
    });
  }

  return result;
}

function calcEveryXDaysSchedule(
  startTimestamp: number,
  endTimestamp: number,
  interval: number,
  times: DayTime[]
) {
  const result: ReminderScheduleItem[] = [];

  const timestampInterval = endTimestamp - startTimestamp;
  const quantityOfTimes = Math.ceil(
    timestampInterval / (dayTimestamp * interval)
  );

  for (let i = 0; i < quantityOfTimes; i++) {
    times.forEach((time) => {
      const timestamp =
        startTimestamp +
        dayTimestamp * i * interval +
        time.hour * 60 * 60 * 1000 +
        time.minute * 60 * 1000;
      if (timestamp >= todayMidnight) {
        result.push({
          id: uuid(),
          timestamp: timestamp,
          isTaken: null,
          notificationId: null,
        });
      }
    });
  }

  return result;
}

function calcCyclicalSchedule(
  startTimestamp: number,
  endTimestamp: number,
  use: number,
  pause: number,
  times: DayTime[]
) {
  const result: ReminderScheduleItem[] = [];

  const intervalTimestamp = dayTimestamp * (use + pause);
  let currentStartTimestamp = startTimestamp;
  let timesOfCycles = 0;

  while (currentStartTimestamp <= endTimestamp) {
    for (let i = 0; i < use; i++) {
      times.forEach((time) => {
        const timestamp = time.hour * 60 * 60 * 1000 + time.minute * 60 * 1000;
        const timestampToSet =
          startTimestamp +
          dayTimestamp * i +
          intervalTimestamp * timesOfCycles +
          timestamp;

        if (timestampToSet <= endTimestamp && timestampToSet >= todayMidnight) {
          result.push({
            id: uuid(),
            timestamp: timestampToSet,
            isTaken: null,
            notificationId: null,
          });
        } else {
          return;
        }
      });
    }
    currentStartTimestamp += intervalTimestamp;
    timesOfCycles++;
  }

  return result;
}

function calcSpecificDaysSchedule(
  startTimestamp: number,
  endTimestamp: number,
  specificDays: Weekday[],
  times: DayTime[]
) {
  const result: ReminderScheduleItem[] = [];

  const intervalTimestamp = dayTimestamp * americanWeekdays.length;
  let currentStartTimestamp = startTimestamp;
  let innerStartTimestamp = startTimestamp;
  let startTimestampWeekday = new Date(innerStartTimestamp).getDay() - 1;
  if (startTimestampWeekday === -1) startTimestampWeekday = 6;
  const firstIntervalTimestamp =
    dayTimestamp * (americanWeekdays.length - startTimestampWeekday);
  let timesOfCycles = 0;
  let isTheFirstTime = true;

  while (currentStartTimestamp <= endTimestamp) {
    for (
      let i = isTheFirstTime ? startTimestampWeekday : 0;
      i < americanWeekdays.length;
      i++
    ) {
      const currentWeekday =
        americanWeekdays[new Date(innerStartTimestamp).getDay()];

      if (specificDays.includes(currentWeekday)) {
        times.forEach((time) => {
          const timestamp =
            time.hour * 60 * 60 * 1000 + time.minute * 60 * 1000;
          const timestampToSet =
            timesOfCycles === 0
              ? currentStartTimestamp +
                dayTimestamp * (i - startTimestampWeekday) +
                timestamp
              : currentStartTimestamp + dayTimestamp * i + timestamp;

          if (
            timestampToSet <= endTimestamp &&
            timestampToSet >= todayMidnight
          ) {
            result.push({
              id: uuid(),
              timestamp: timestampToSet,
              isTaken: null,
              notificationId: null,
            });
          }
        });
      }
      innerStartTimestamp += dayTimestamp;
    }
    currentStartTimestamp += isTheFirstTime
      ? firstIntervalTimestamp
      : intervalTimestamp;
    timesOfCycles++;
    isTheFirstTime = false;
  }

  return result;
}

export function changeSchedule(
  schedule: Schedule,
  oldSchedule: ReminderScheduleItem[]
) {
  const savedSchedule = oldSchedule.filter(
    (item) => item.timestamp < todayMidnight
  );

  const result: ReminderScheduleItem[] = [...savedSchedule];
  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);
  const startTimestamp = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    0,
    0,
    0
  ).getTime();
  const endTimestamp = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    23,
    59,
    59
  ).getTime();

  if (schedule.frequency === Frequency.everyDay) {
    result.push(
      ...calcEverydaySchedule(startTimestamp, endTimestamp, schedule.times)
    );
  }

  if (schedule.frequency === Frequency.everyXDays) {
    result.push(
      ...calcEveryXDaysSchedule(
        startTimestamp,
        endTimestamp,
        schedule.everyXDayInterval || 0,
        schedule.times
      )
    );
  }

  if (schedule.frequency === Frequency.cyclical) {
    result.push(
      ...calcCyclicalSchedule(
        startTimestamp,
        endTimestamp,
        schedule.cyclicalInterval?.use || 0,
        schedule.cyclicalInterval?.pause || 0,
        schedule.times
      )
    );
  }

  if (schedule.frequency === Frequency.specificDays) {
    result.push(
      ...calcSpecificDaysSchedule(
        startTimestamp,
        endTimestamp,
        schedule.specificDays || [],
        schedule.times
      )
    );
  }

  return result;
}
