import { View } from 'react-native';

import { Page } from '@/ui/page';
import { UiText } from '@/ui/ui-text';

import { OnboardingQuestion } from '../onboarding-question';

export function OnboardingA2() {
  return (
    <Page>
      <View className="gap-y-8 mt-20">
        <View className="gap-y-1 px-4">
          <UiText className="text-sm font-medium text-grayDark">
            Question 2
          </UiText>
          <UiText className="text-2xl font-medium">
            How often do you usually take your medications?
          </UiText>
        </View>

        <View className="gap-y-2">
          <OnboardingQuestion question="Once a day" />
          <OnboardingQuestion question="Several times a day" />
          <OnboardingQuestion question="On a recurring cycle" />
          <OnboardingQuestion question="Other" />
        </View>
      </View>
    </Page>
  );
}
