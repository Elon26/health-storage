import { router } from 'expo-router';
import { View } from 'react-native';

import { useContactIds } from '@/modules/contacts-kit/react';
import ArrowRightWhiteIcon from '@/svg/arrow-right-white.svg';
import ContactsIcon from '@/svg/contacts.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { numberInnerWrapper } from '@/utils/number-inner-wrapper';

export default function ContactsArea() {
  const { ids } = useContactIds();
  const allCount = ids.length;

  return (
    <Pressable
      className="rounded-2xl bg-white p-5"
      onPress={() => router.navigate('/contacts-cleaner')}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-3">
          <ContactsIcon />
          <View className="gap-y-1">
            <UiText className="font-semibold">Contacts</UiText>
            <View className="flex-row items-center gap-x-1">
              <UiText className="text-xs text-grayDark">
                {numberInnerWrapper(allCount)}
              </UiText>
              <UiText className="text-xs text-grayDark">
                contact{allCount !== 1 && 's'}
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
