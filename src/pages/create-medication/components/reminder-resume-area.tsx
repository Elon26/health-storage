import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { Dispatch, SetStateAction } from 'react';
import { TextInput, View } from 'react-native';

import { weekdays } from '@/config/constants/default-schedule-item';
import medicalUnitIcons from '@/config/constants/medical-unit-icons';
import medicalUnits from '@/config/constants/medical-units';
import Frequency from '@/types/frequency';
import { Schedule } from '@/types/schedule';
import { Separator } from '@/ui/separator';
import { UiText } from '@/ui/ui-text';

type Props = {
  selectedIcon: string;
  medicationName: string;
  medicationDose: number;
  medicationUnit: string;
  currentScheduleItem: Schedule;
  note: string;
  setNote: Dispatch<SetStateAction<string>>;
};

export function ReminderResumeArea({
  selectedIcon,
  medicationName,
  medicationDose,
  medicationUnit,
  currentScheduleItem,
  note,
  setNote,
}: Props) {
  const icon = medicalUnitIcons.find((icon) => icon.name === selectedIcon);
  const medicalUnit = medicalUnits.find((unit) => unit.name === medicationUnit);
  const frequency = handleFrequency(currentScheduleItem);
  const times = handleTimes(currentScheduleItem);

  function handleFrequency(currentScheduleItem: Schedule) {
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

    return 'Unknown';
  }

  function handleTimes(currentScheduleItem: Schedule) {
    const times = currentScheduleItem.times.map(
      (item) => `${item.hour}:${item.minute < 10 ? '0' : ''}${item.minute}`
    );
    return times.join(' · ');
  }

  return (
    <View className="rounded-2xl bg-white">
      <View className="flex-row items-center gap-x-3 p-4">
        {icon && (
          <View className="items-center justify-center rounded-2xl bg-primary/20 size-12">
            <Image
              source={icon.image}
              style={{ width: scaleY(32), height: scaleY(32) }}
              contentFit="contain"
            />
          </View>
        )}
        <View className="flex-1 gap-y-1">
          <UiText className="text-sm font-semibold" numberOfLines={1}>
            {medicationName}
          </UiText>
          <UiText className="text-xs text-grayDark">
            {medicationDose} {medicalUnit?.label}
          </UiText>
        </View>
      </View>
      <Separator />
      <View className="flex-row justify-between px-4 py-5">
        <UiText className="text-xs font-medium text-grayDark">Frequency</UiText>
        <UiText className="text-right text-sm font-medium">{frequency}</UiText>
      </View>
      <Separator />
      <View className="flex-row items-center justify-between gap-x-4 px-4 py-5">
        <UiText className="text-xs font-medium text-grayDark">Schedule</UiText>
        <UiText className="flex-1 text-right text-sm font-medium">
          {times}
        </UiText>
      </View>
      <Separator />
      <View className="p-4">
        <TextInput
          className="rounded-xl bg-grayLight/50 text-sm p-3"
          style={{ height: scaleY(128) }}
          multiline={true}
          value={note}
          onChangeText={setNote}
          placeholder="Type your note here..."
        />
      </View>
    </View>
  );
}
