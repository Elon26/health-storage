import { Dispatch, SetStateAction } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Frequency from '@/types/frequency';
import { Schedule } from '@/types/schedule';
import Weekday from '@/types/weekday';

import { CustomWeekdaysArea } from './custom-weekdays-area';
import { CycleSettingsArea } from './cycle-settings-area';
import FrequencySelector from './frequency-selector';
import { ReminderTimeArea } from './reminder-time-area';
import SelectDateItem from './select-date-item';
import { SelectIntervalItem } from './select-interval-item';

type Props = {
  currentScheduleItem: Schedule;
  setCurrentScheduleItem: Dispatch<SetStateAction<Schedule>>;
};

export function ReminderSecondScreen({
  currentScheduleItem,
  setCurrentScheduleItem,
}: Props) {
  const insets = useSafeAreaInsets();

  function handleSetFrequency(freq: Frequency) {
    const updatedScheduleItem = { ...currentScheduleItem };
    updatedScheduleItem.frequency = freq;
    updatedScheduleItem.everyXDayInterval =
      freq === Frequency.everyXDays ? 2 : null;
    updatedScheduleItem.cyclicalInterval =
      freq === Frequency.cyclical ? { use: 1, pause: 1 } : null;
    updatedScheduleItem.specificDays =
      freq === Frequency.specificDays ? [] : null;

    setCurrentScheduleItem(updatedScheduleItem);
  }

  function updateSchedule(updatedSchedule: Schedule) {
    setCurrentScheduleItem(updatedSchedule);
  }

  function handleSetDate(newDate: Date, type: 'Start' | 'End') {
    const updatedSchedule = { ...currentScheduleItem };
    const newDateWithoutTime = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );

    if (type === 'Start') {
      const endDateForHandle = new Date(updatedSchedule.endDate);
      const endDateWithoutTime = new Date(
        endDateForHandle.getFullYear(),
        endDateForHandle.getMonth(),
        endDateForHandle.getDate()
      );
      if (newDateWithoutTime > endDateWithoutTime) {
        Alert.alert(
          'Wrong date',
          'The start date should be before the end date'
        );
        return;
      } else {
        updatedSchedule.startDate = newDate;
      }
    }

    if (type === 'End') {
      const startDateForHandle = new Date(updatedSchedule.startDate);
      const startDateWithoutTime = new Date(
        startDateForHandle.getFullYear(),
        startDateForHandle.getMonth(),
        startDateForHandle.getDate()
      );

      if (newDateWithoutTime < startDateWithoutTime) {
        Alert.alert(
          'Wrong date',
          'The end date should be after the start date'
        );
        return;
      } else {
        updatedSchedule.endDate = newDate;
      }
    }

    updateSchedule(updatedSchedule);
  }

  function handleSelectXDayInterval(newInterval: number) {
    const updatedSchedule = { ...currentScheduleItem };
    updatedSchedule.everyXDayInterval = newInterval;
    updateSchedule(updatedSchedule);
  }

  function handleSelectUseCycleInterval(newInterval: number) {
    const updatedSchedule = { ...currentScheduleItem };

    if (updatedSchedule.cyclicalInterval) {
      updatedSchedule.cyclicalInterval.use = newInterval;
      updateSchedule(updatedSchedule);
    }
  }

  function handleSelectPauseCycleInterval(newInterval: number) {
    const updatedSchedule = { ...currentScheduleItem };

    if (updatedSchedule.cyclicalInterval) {
      updatedSchedule.cyclicalInterval.pause = newInterval;
      updateSchedule(updatedSchedule);
    }
  }

  function handleSelectWeekdays(newWeekdays: Weekday[]) {
    const updatedSchedule = { ...currentScheduleItem };
    updatedSchedule.specificDays = newWeekdays;
    updateSchedule(updatedSchedule);
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-y-5 mr-10">
        <FrequencySelector
          frequency={currentScheduleItem.frequency}
          setFrequency={handleSetFrequency}
        />
        {currentScheduleItem.frequency === Frequency.everyXDays &&
          currentScheduleItem.everyXDayInterval && (
            <SelectIntervalItem
              currentScheduleItem={currentScheduleItem}
              handleSelectXDayInterval={handleSelectXDayInterval}
            />
          )}
        {currentScheduleItem.frequency === Frequency.cyclical && (
          <CycleSettingsArea
            currentScheduleItem={currentScheduleItem}
            handleSelectUseCycleInterval={handleSelectUseCycleInterval}
            handleSelectPauseCycleInterval={handleSelectPauseCycleInterval}
          />
        )}
        {currentScheduleItem.frequency === Frequency.specificDays && (
          <CustomWeekdaysArea
            currentScheduleItem={currentScheduleItem}
            handleSelectWeekdays={handleSelectWeekdays}
          />
        )}
        <ReminderTimeArea
          currentScheduleItem={currentScheduleItem}
          updateScheduleItem={updateSchedule}
        />
        <SelectDateItem
          type="Start"
          date={currentScheduleItem.startDate}
          setNewDate={handleSetDate}
        />
        <SelectDateItem
          type="End"
          date={currentScheduleItem.endDate}
          setNewDate={handleSetDate}
        />
      </View>
    </ScrollView>
  );
}
