import { Env } from '@kirz/expo-env';
import { router } from 'expo-router';
import { View } from 'react-native';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { usePaywall } from '@/hooks/use-paywall';
import SettingsIcon from '@/svg/settings.svg';
import ShineIcon from '@/svg/shine.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export default function MainPageHeader() {
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();

  return (
    <View className="flex-row items-center justify-between py-5">
      <UiText className="text-3xl font-semibold">{Env.APP_NAME}</UiText>
      <View className="flex-row items-center gap-x-4">
        {!hasPremium && (
          <Pressable
            className="flex-row items-center justify-center rounded-xl bg-primary gap-x-0.5 h-8 w-15"
            onPress={() => showPaywall()}
          >
            <ShineIcon />
            <UiText className="font-bold text-white">Pro</UiText>
          </Pressable>
        )}
        <Pressable
          className="items-center justify-center rounded-xl bg-white size-10"
          onPress={() => router.navigate('/settings')}
        >
          <SettingsIcon />
        </Pressable>
      </View>
    </View>
  );
}
