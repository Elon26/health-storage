import { View } from 'react-native';

import { Page } from '@/ui/page';
import { UiText } from '@/ui/ui-text';

import { OnboardingQuestion } from '../onboarding-question';

export function OnboardingA1() {
  return (
    <Page>
      <View className="gap-y-8 mt-20">
        <View className="gap-y-1 px-4">
          <UiText className="text-sm font-medium text-grayDark">
            Question 1
          </UiText>
          <UiText className="text-2xl font-medium">
            What kinds of medications would you like to track?
          </UiText>
        </View>

        <View className="gap-y-2">
          <OnboardingQuestion question="Daily medications" />
          <OnboardingQuestion question="Vitamins and supplements" />
          <OnboardingQuestion question="Pills taken as needed" />
        </View>
      </View>
    </Page>
  );
}
