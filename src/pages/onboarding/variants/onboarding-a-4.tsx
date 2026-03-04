import { scaleX } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import OnboardingImage from '@/images/onboarding-a4.png';
import { Page } from '@/ui/page';
import { UiText } from '@/ui/ui-text';

export function OnboardingA4() {
  return (
    <Page>
      <View className="gap-y-8 mt-20">
        <UiText className="text-3xl font-medium mx-4">
          Free up space — keep your device smooth
        </UiText>

        <View className="gap-y-2">
          <Image
            source={OnboardingImage}
            style={{ width: scaleX(345), height: scaleX(345) }}
          />
        </View>
      </View>
    </Page>
  );
}
