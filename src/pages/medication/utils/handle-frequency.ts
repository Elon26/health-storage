import { weekdays } from '@/config/constants/default-schedule-item';
import Frequency from '@/types/frequency';
import { Schedule } from '@/types/schedule';

export function handleFrequency(currentScheduleItem: Schedule | undefined) {
  if (currentScheduleItem) {
    const currentFrequency = currentScheduleItem.frequency;

    if (currentFrequency === Frequency.everyDay) return 'Daily';

    if (
      currentFrequency === Frequency.everyXDays &&
      currentScheduleItem.everyXDayInterval
    ) {
      return `Every ${currentScheduleItem.everyXDayInterval} Day${currentScheduleItem.everyXDayInterval > 1 ? 's' : ''}`;
    }

    if (
      currentFrequency === Frequency.cyclical &&
      currentScheduleItem.cyclicalInterval
    ) {
      return `${currentScheduleItem.cyclicalInterval.use} day${currentScheduleItem.cyclicalInterval.use > 1 ? 's' : ''} on, ${currentScheduleItem.cyclicalInterval.pause} day${currentScheduleItem.cyclicalInterval.pause > 1 ? 's' : ''} off`;
    }

    if (
      currentFrequency === Frequency.specificDays &&
      currentScheduleItem.specificDays
    ) {
      const arr = currentScheduleItem.specificDays;
      if (!arr.length) return 'Never';
      const updatedArr: string[] = [];
      weekdays.forEach((weekday) => {
        if (arr.includes(weekday)) updatedArr.push(weekday.slice(0, 3));
      });
      return updatedArr.join(', ');
    }
  }

  return 'Unknown';
}
