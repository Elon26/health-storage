import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConfig } from '@/hooks/use-config';
import { useModals } from '@/hooks/use-modals';
import { registerForPushNotificationsAsync } from '@/hooks/use-notifications';
import { useStorage } from '@/hooks/use-storage';
import SettingsIcon from '@/svg/settings.svg';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';

import CleanerBanner from './components/cleaner-banner';
import MainAppointments from './components/main-appointments';
import MainCalendar from './components/main-calendar';
import MainPageHeader from './components/main-page-header';
import MainProgress from './components/main-progress';
import MainReminders from './components/main-reminders';

export default function MainPillReminderPage() {
  const { appType } = useConfig();
  const insets = useSafeAreaInsets();
  const { currentModal } = useModals();
  const [isNotificationRegistered, setIsNotificationRegistered] = useStorage(
    'isNotificationRegistered'
  );

  useEffect(() => {
    if (
      !isNotificationRegistered &&
      !currentModal &&
      appType === 'pill-reminder'
    ) {
      registerForPushNotificationsAsync();
      setIsNotificationRegistered(true);
    }
  }, [isNotificationRegistered, currentModal, appType]);

  return (
    <Page>
      {appType === 'pill-reminder' ? (
        <MainPageHeader />
      ) : (
        <PageHeader pageName="Pill Reminder ">
          <Pressable
            className="items-center justify-center rounded-xl bg-white size-10"
            onPress={() => router.navigate('/settings')}
          >
            <SettingsIcon />
          </Pressable>
        </PageHeader>
      )}
      <ScrollView
        className="-mt-2.5 pt-2.5"
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
      >
        <View className="gap-y-4">
          <MainCalendar />
          <MainProgress />
          <MainAppointments />
          <MainReminders />
          {appType === 'pill-reminder' && <CleanerBanner />}
        </View>
      </ScrollView>
    </Page>
  );
}
