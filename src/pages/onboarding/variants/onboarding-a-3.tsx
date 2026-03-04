import { View } from 'react-native';

import { Page } from '@/ui/page';
import { UiText } from '@/ui/ui-text';

import { OnboardingQuestion } from '../onboarding-question';

export function OnboardingA3() {
  return (
    <Page>
      <View className="gap-y-8 mt-20">
        <View className="gap-y-1 px-4">
          <UiText className="text-sm font-medium text-grayDark">
            Question 3
          </UiText>
          <UiText className="text-2xl font-medium">
            What type of medication do you take most often?
          </UiText>
        </View>

        <View className="gap-y-2">
          <OnboardingQuestion question="Tablets" />
          <OnboardingQuestion question="Capsules" />
          <OnboardingQuestion question="Drops" />
          <OnboardingQuestion question="Other" />
        </View>
      </View>
    </Page>
  );
}
