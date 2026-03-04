import { View } from 'react-native';

import { DayTime, Schedule } from '@/types/schedule';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import { AddTimeItem } from './add-time-item';
import { SelectedTimeItem } from './selected-time-item';

type Props = {
  currentScheduleItem: Schedule;
  updateScheduleItem: (updatedSchedule: Schedule) => void;
};

export function ReminderTimeArea({
  currentScheduleItem,
  updateScheduleItem,
}: Props) {
  function removeDayTime(dayTime: DayTime) {
    const updatedSchedule = { ...currentScheduleItem };

    const updatedReminders = updatedSchedule.times.filter(
      (currentReminder) =>
        currentReminder.hour !== dayTime.hour ||
        currentReminder.minute !== dayTime.minute
    );

    updatedSchedule.times = updatedReminders;
    updateScheduleItem(updatedSchedule);
  }

  function addDayTime(dayTime: DayTime) {
    const updatedSchedule = { ...currentScheduleItem };
    const updatedReminders = updatedSchedule.times;
    const isAlreadyExist = updatedReminders.find(
      (reminder) =>
        reminder.hour === dayTime.hour && reminder.minute === dayTime.minute
    );

    if (!isAlreadyExist) {
      updatedReminders.push(dayTime);
      const sortedUpdatedReminders = updatedReminders.sort(
        (a, b) =>
          +(
            a.hour.toString() +
            (a.minute < 10 ? '0' : '') +
            a.minute.toString()
          ) -
          +(
            b.hour.toString() +
            (b.minute < 10 ? '0' : '') +
            b.minute.toString()
          )
      );

      updatedSchedule.times = sortedUpdatedReminders;
      updateScheduleItem(updatedSchedule);
    }
  }

  return (
    <View>
      <View className="gap-y-2">
        <UiText className="text-xs font-medium text-grayDark">
          Reminder time
        </UiText>
        <View className="gap-y-2">
          {currentScheduleItem.times.map((dayTime: DayTime) => (
            <SelectedTimeItem
              key={uuid()}
              dayTime={dayTime}
              removeDayTime={removeDayTime}
            />
          ))}
          <AddTimeItem addDayTime={addDayTime} />
        </View>
      </View>
    </View>
  );
}
