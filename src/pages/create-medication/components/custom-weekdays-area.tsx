import { View } from 'react-native';

import { weekdays } from '@/config/constants/default-schedule-item';
import { Schedule } from '@/types/schedule';
import Weekday from '@/types/weekday';
import { UiText } from '@/ui/ui-text';

import { CustomWeekdayItem } from './custom-weekday-item';

type Props = {
  currentScheduleItem: Schedule;
  handleSelectWeekdays: (newWeekdays: Weekday[]) => void;
};

export function CustomWeekdaysArea({
  currentScheduleItem,
  handleSelectWeekdays,
}: Props) {
  function toggleWeekdaySelection(weekday: Weekday, isSelected: boolean) {
    let updatedWeekdays = currentScheduleItem.specificDays;

    if (updatedWeekdays) {
      if (isSelected) {
        const arr = updatedWeekdays.filter(
          (currentWeekday) => currentWeekday !== weekday
        );
        updatedWeekdays = arr;
      } else {
        updatedWeekdays.push(weekday);
      }
      handleSelectWeekdays(updatedWeekdays);
    }
  }

  return (
    <View>
      <View className="gap-y-2">
        <UiText className="text-xs font-medium text-grayDark">
          Custom Weekdays
        </UiText>
        <View className="flex-row justify-between rounded-xl bg-white gap-x-1.5 p-4">
          {weekdays.map((weekday) => {
            const isSelected =
              currentScheduleItem.specificDays?.includes(weekday) || false;
            return (
              <CustomWeekdayItem
                key={weekday}
                isSelected={isSelected}
                weekday={weekday}
                toggleWeekdaySelection={toggleWeekdaySelection}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}
