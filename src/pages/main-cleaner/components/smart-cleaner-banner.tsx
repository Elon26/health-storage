import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { prettyBytes, useStorageUsage } from '@kirz/react-native-device-info';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';

import { colors } from '@/config/theme';
import ShineIcon from '@/svg/shine-big-green.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

export default function SmartCleanerBanner() {
  const storageUsage = useStorageUsage();
  const [currentPercent, setCurrentPercent] = useState(0);

  useEffect(() => {
    setCurrentPercent(storageUsage.used / storageUsage.total);
  }, [storageUsage]);

  return (
    <View className="flex-row items-center rounded-2xl bg-primary gap-x-5 p-5">
      <View>
        <CircularProgress
          size={scaleY(96)}
          width={scaleX(8)}
          fill={100 - Math.round(currentPercent * 100)}
          tintColor="#41e1d1"
          backgroundColor={colors.background.toString()}
          rotation={0}
        />
        <View
          className="absolute items-center justify-center"
          style={{ height: scaleY(96), width: scaleY(96) }}
        >
          <UiText className="text-xl font-semibold text-white">
            {Math.round(currentPercent * 100)}%
          </UiText>
        </View>
      </View>
      <View>
        <View className="mb-1">
          <UiText className="font-semibold text-white">Storage Used</UiText>
        </View>
        <View className="flex-row items-center gap-x-1 pr-4 mb-4">
          <UiText className="font-semibold text-white">
            {prettyBytes(storageUsage.used)}
          </UiText>
          <UiText className="text-sm font-medium text-white">of</UiText>
          <UiText className="font-semibold text-white">
            {prettyBytes(storageUsage.total)}
          </UiText>
        </View>
        <UiButton
          className="flex-row bg-white gap-x-1 w-auto"
          onPress={() => router.navigate('/smart-cleaner')}
        >
          <UiText className="text-sm font-medium">Smart Clean</UiText>
          <ShineIcon />
        </UiButton>
      </View>
    </View>
  );
}
