import { View } from 'react-native';

import MinusIcon from '@/svg/minus.svg';
import { DayTime } from '@/types/schedule';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  dayTime: DayTime;
  removeDayTime: (dayTime: DayTime) => void;
};

export function SelectedTimeItem({ dayTime, removeDayTime }: Props) {
  return (
    <View className="flex-row items-center justify-between rounded-xl bg-white text-sm p-4">
      <View className="rounded-xl bg-primary/20">
        <UiText className="text-sm text-primary px-2 py-1">
          {`${dayTime.hour}:${dayTime.minute < 10 ? '0' : ''}${dayTime.minute}`}
        </UiText>
      </View>
      <Pressable
        className="items-center justify-center rounded-full bg-red size-6"
        onPress={() => removeDayTime(dayTime)}
      >
        <MinusIcon />
      </Pressable>
    </View>
  );
}
