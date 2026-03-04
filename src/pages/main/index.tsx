import { router } from 'expo-router';
import { useEffect } from 'react';

import { useConfig } from '@/hooks/use-config';
import { DeveloperPurchasesProvider } from '@/hooks/use-developer-purchases';
import { NotificationProvider } from '@/hooks/use-notifications';
import { useSetStorage } from '@/hooks/use-storage';

export default function MainPage() {
  const { appType } = useConfig();
  const setIsNotificationRegistered = useSetStorage('isNotificationRegistered');

  useEffect(() => {
    setIsNotificationRegistered(false);
    if (appType === 'pill-reminder') {
      router.navigate('/pill-reminder');
    }
    if (appType !== 'pill-reminder') {
      router.navigate('/cleaner');
    }
  }, []);

  return (
    <DeveloperPurchasesProvider>
      <NotificationProvider>
        <></>
      </NotificationProvider>
    </DeveloperPurchasesProvider>
  );
}
