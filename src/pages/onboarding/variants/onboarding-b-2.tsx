import { scaleX } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import OnboardingImage from '@/images/onboarding-b2.png';
import { Page } from '@/ui/page';
import { UiText } from '@/ui/ui-text';

export function OnboardingB2() {
  return (
    <Page>
      <View className="gap-y-8 mt-15">
        <UiText className="text-center text-3xl font-medium mx-4">
          Delete duplicate photos in one tap
        </UiText>

        <View className="items-center gap-y-2">
          <Image
            source={OnboardingImage}
            style={{ width: scaleX(334), height: scaleX(334) }}
          />
        </View>
      </View>
    </Page>
  );
}
