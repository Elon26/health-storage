import { router } from 'expo-router';
import { View } from 'react-native';

import ArrowRightWhiteIcon from '@/svg/arrow-right-white.svg';
import PhotosIcon from '@/svg/photos.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export default function PhotosAreaWithoutPermission() {
  return (
    <Pressable
      className="rounded-2xl bg-white gap-y-4 p-5"
      onPress={() => router.navigate('/gallery-cleaner')}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-3">
          <PhotosIcon />
          <View className="gap-y-1">
            <UiText className="font-semibold">Photos</UiText>
            <View className="flex-row items-center gap-x-1">
              <UiText className="text-xs text-grayDark">N/A items</UiText>
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
