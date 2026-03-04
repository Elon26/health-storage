import { Env } from '@kirz/expo-env';
import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { colors } from '@/config/theme';
import { usePaywall } from '@/hooks/use-paywall';
import BgWithStars from '@/images/bg-with-stars.png';
import TopArrow from '@/images/top-arrow.png';
import ShineIcon from '@/svg/shine-lg.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export default function SettingsBanner() {
  const { showPaywall } = usePaywall();

  return (
    <Pressable style={{ height: scaleY(100) }} onPress={() => showPaywall()}>
      <Image
        source={BgWithStars}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        contentFit="fill"
      />
      <View className="flex-row items-center justify-between gap-x-3.5 px-5 h-full w-full">
        <View className="flex-1 gap-y-2">
          <View className="flex-row items-center gap-x-1">
            <UiText className="font-bold text-white">{Env.APP_NAME} PRO</UiText>
            <ShineIcon />
          </View>
          <UiText className="text-xs text-white">
            Unlock everything and take full control of your experience.
          </UiText>
        </View>
        <View className="flex-row items-center rounded-xl bg-white gap-x-1.5 px-2 py-1.5">
          <Image
            source={TopArrow}
            style={{ width: 16, height: 16 }}
            contentFit="contain"
          />
          <UiText
            className="text-xs font-semibold"
            style={{ color: colors.darkGreen.toString() }}
          >
            Upgrade
          </UiText>
        </View>
      </View>
    </Pressable>
  );
}
