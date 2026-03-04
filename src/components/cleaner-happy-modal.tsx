import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'moti';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HappyImage from '@/images/happyscreen.png';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import type { ModalStackParams } from './modals';

type CleanerHappyModalProps = ModalComponentProp<
  ModalStackParams,
  void,
  'CleanerHappyModal'
>;

export function CleanerHappyModal({ modal }: CleanerHappyModalProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { logEvent } = useAnalytics();
  useEffect(() => {
    logEvent('great_work');
  }, [logEvent]);
  return (
    <View
      className="bg-white px-10"
      style={{ width, height, paddingBottom: insets.bottom + scaleY(10) }}
    >
      <View className="flex-1 items-center justify-center gap-8">
        <Image
          source={HappyImage}
          style={{ width: scaleX(224), height: scaleX(224) }}
        />
        <View className="gap-1">
          <UiText className="text-center text-3xl font-semibold">
            Cleanup Complete
          </UiText>
        </View>

        <View className="items-center gap-2">{modal.params?.children}</View>
      </View>
      <Pressable
        className="rounded-2xl bg-primary py-4"
        onPress={() => modal.closeModal('CleanerHappyModal')}
      >
        <UiText className="text-center font-semibold text-white">
          Continue
        </UiText>
      </Pressable>
    </View>
  );
}
