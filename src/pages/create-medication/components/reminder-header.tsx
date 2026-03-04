import { View } from 'react-native';

import BackIcon from '@/svg/back.svg';
import CloseIcon from '@/svg/close.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  isFirstScreen: boolean;
  handleBack: () => void;
};

export function ReminderHeader({ isFirstScreen, handleBack }: Props) {
  return (
    <View className="flex-row items-center justify-between mb-5 py-4">
      <Pressable
        className="items-center justify-center rounded-xl bg-white size-10"
        onPress={handleBack}
      >
        {isFirstScreen ? <CloseIcon /> : <BackIcon />}
      </Pressable>
      <UiText className="text-xl font-semibold">Add reminder</UiText>
      <View className="size-10" />
    </View>
  );
}
