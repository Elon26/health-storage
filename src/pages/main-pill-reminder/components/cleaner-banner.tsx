import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { prettyBytes, useStorageUsage } from '@kirz/react-native-device-info';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';

import ArrowIcon from '@/svg/arrow-top-right.svg';
import ShineIcon from '@/svg/shine-big.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export default function CleanerBanner() {
  const storageUsage = useStorageUsage();
  const [currentPercent, setCurrentPercent] = useState(0);

  useEffect(() => {
    setCurrentPercent(storageUsage.used / storageUsage.total);
  }, [storageUsage]);

  return (
    <Pressable
      className="overflow-hidden rounded-2xl p-5 mt-2"
      onPress={() => router.navigate('/cleaner')}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['#00DFBA', '#00D0C6']}
        style={{ position: 'absolute', inset: 0 }}
      />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-1">
          <UiText className="font-bold text-white">Time to clean up</UiText>
          <ShineIcon />
        </View>
        <View
          className="items-center justify-center rounded-2xl bg-white"
          style={{ width: scaleX(48), height: scaleY(30) }}
        >
          <ArrowIcon />
        </View>
      </View>
      {!isNaN(currentPercent) && (
        <View className="my-3">
          <Progress.Bar
            progress={currentPercent}
            width={null}
            height={12}
            borderRadius={12}
            color="#ffffff"
            borderColor="#41e1d1"
            unfilledColor="#41e1d1"
          />
        </View>
      )}
      <View className="flex-row items-center gap-x-1">
        <UiText className="text-xl font-semibold text-white">
          {prettyBytes(storageUsage.used)}
        </UiText>
        <UiText className="text-sm font-medium text-white">of</UiText>
        <UiText className="text-xl font-semibold text-white">
          {prettyBytes(storageUsage.total)}
        </UiText>
      </View>
      <View className="mt-4">
        <UiText className="text-xs text-white">
          Free up space and keep things running smoothly
        </UiText>
      </View>
    </Pressable>
  );
}
