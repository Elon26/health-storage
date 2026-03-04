import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import OnboardingImage from '@/images/onboarding-b1.png';
import { Page } from '@/ui/page';
import { UiText } from '@/ui/ui-text';

export function OnboardingB1() {
  return (
    <Page>
      <View className="gap-y-8 mt-15">
        <UiText className="text-center text-3xl font-medium mx-4">
          Keep files safe in a Secure Folder
        </UiText>

        <View className="items-center gap-y-2">
          <Image
            source={OnboardingImage}
            style={{ width: scaleX(272), height: scaleY(298) }}
          />
        </View>
      </View>
    </Page>
  );
}
