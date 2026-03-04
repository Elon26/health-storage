import { router } from 'expo-router';
import { View } from 'react-native';

import BackIcon from '@/svg/back.svg';

import { Pressable } from './pressable';
import { UiText } from './ui-text';

type Props = {
  pageName: string;
  children?: React.ReactNode;
};

export function PageHeader({ pageName, children }: Props) {
  return (
    <View className="flex-row items-center justify-between mb-5 py-4">
      <Pressable
        className="items-center justify-center rounded-xl bg-white size-10"
        onPress={() => router.back()}
      >
        <BackIcon />
      </Pressable>
      <UiText className="text-xl font-semibold">{pageName}</UiText>
      {children ? children : <View className="size-10" />}
    </View>
  );
}
