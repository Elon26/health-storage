import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

type Props = {
  numberOfScreen: number;
};

export function ReminderProgressBar({ numberOfScreen }: Props) {
  return (
    <View className="flex-row -mx-1 pb-8">
      <View className="w-[33.33%] px-1 h-2">
        <View className="rounded-full bg-primary h-full w-full" />
      </View>

      <View className="w-[33.33%] px-1 h-2">
        <View
          className={twMerge(
            'rounded-full h-full w-full',
            numberOfScreen >= 2 ? 'bg-primary' : 'bg-grayDark/20'
          )}
        />
      </View>

      <View className="w-[33.33%] px-1 h-2">
        <View
          className={twMerge(
            'rounded-full h-full w-full',
            numberOfScreen === 3 ? 'bg-primary' : 'bg-grayDark/20'
          )}
        />
      </View>
    </View>
  );
}
