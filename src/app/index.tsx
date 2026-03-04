import { useAnalytics } from '@kirz/expo-toolkit';
import type { CommonActions, NavigationRoute } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { AnimationLoader } from '@/components/animation-loader';
import { useStorageValue } from '@/hooks/use-storage';

type ResetState = Parameters<(typeof CommonActions)['reset']>['0'];

type ResetExpected = Readonly<{
  key: string;
  index: number;
  routeNames: never[];
  history?: unknown[] | undefined;
  routes: NavigationRoute<never, never>[];
  type: string;
  stale: false;
}>;

export default function Index() {
  const isOnboardingFinished = useStorageValue('isOnboardingFinished');
  const navigation = useNavigation();
  const { logEvent } = useAnalytics();

  const initialNavigationState = useMemo<ResetState>(() => {
    logEvent('af_app_launch');

    if (!isOnboardingFinished) {
      return { routes: [{ name: 'onboarding' }] };
    }

    return { routes: [{ name: 'main' }] };
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.reset(initialNavigationState as ResetExpected);
    }, [navigation, initialNavigationState])
  );

  return <AnimationLoader />;
}
