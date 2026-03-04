import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { colors } from '@/config/theme';
import { useStorageValue } from '@/hooks/use-storage';
import ArrowRightIcon from '@/svg/arrow-right.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export default function MainProgress() {
  const todaysProgress = useStorageValue('todaysProgress');

  return (
    <Pressable
      className="flex-row items-center rounded-xl bg-white gap-x-8 p-5"
      onPress={() => router.navigate('/statistics')}
    >
      <View>
        <AnimatedCircularProgress
          size={scaleY(60)}
          width={scaleX(5)}
          fill={todaysProgress}
          tintColor={colors.primary.toString()}
          backgroundColor={colors.background.toString()}
          rotation={0}
        />
        <View
          className="absolute items-center justify-center"
          style={{ height: scaleY(60), width: scaleY(60) }}
        >
          <UiText className="text-xs font-semibold">
            {Math.round(todaysProgress)}%
          </UiText>
        </View>
      </View>
      <View>
        <UiText className="font-semibold mb-2">Today’s progress</UiText>
        <UiText className="text-xs font-medium color-gray mb-3">
          Add your first medication to begin
        </UiText>
        <View className="flex-row items-center gap-x-1">
          <UiText className="text-sm font-semibold">See more details</UiText>
          <ArrowRightIcon />
        </View>
      </View>
    </Pressable>
  );
}
