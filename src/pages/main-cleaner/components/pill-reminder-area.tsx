import { scaleX } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import PillReminderImage from '@/images/pill-reminder.png';
import ArrowRightWhiteIcon from '@/svg/arrow-right-white.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export default function PillReminderArea() {
  return (
    <Pressable
      className="rounded-2xl bg-white p-5"
      onPress={() => router.navigate('/pill-reminder')}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-3">
          <Image
            source={PillReminderImage}
            style={{ width: scaleX(48), height: scaleX(48) }}
          />
          <View className="gap-y-1">
            <UiText className="font-semibold">Pill Reminder</UiText>
            <View className="">
              <UiText className="text-xs text-grayDark">
                Keep track of your
              </UiText>
              <UiText className="text-xs text-grayDark">medications</UiText>
            </View>
          </View>
        </View>

        <View className="items-center justify-center rounded-2xl bg-primary h-7.5 w-12">
          <ArrowRightWhiteIcon />
        </View>
      </View>
    </Pressable>
  );
}
