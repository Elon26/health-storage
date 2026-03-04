import { router } from 'expo-router';
import { View } from 'react-native';

import { usePrivateContactIds } from '@/modules/contacts-kit/react';
import { useSecretFolderGallery } from '@/pages/secret-folder/hooks/use-secret-folder-gallery';
import ArrowRightWhiteIcon from '@/svg/arrow-right-white.svg';
import SecurityIcon from '@/svg/security.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { numberInnerWrapper } from '@/utils/number-inner-wrapper';

export default function SecureFolderArea() {
  const { assets } = useSecretFolderGallery();
  const { ids } = usePrivateContactIds();
  const allCount = assets.length + ids.length;

  return (
    <Pressable
      className="rounded-2xl bg-white p-5"
      onPress={() => router.navigate('/secret-folder')}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-3">
          <SecurityIcon />
          <View className="gap-y-1">
            <UiText className="font-semibold">Secure Folder</UiText>
            <View className="flex-row items-center gap-x-1">
              <UiText className="text-xs text-grayDark">
                {numberInnerWrapper(allCount)}
              </UiText>
              <UiText className="text-xs text-grayDark">
                item{allCount !== 1 && 's'}
              </UiText>
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
