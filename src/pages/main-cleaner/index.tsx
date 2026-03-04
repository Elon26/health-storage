import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConfig } from '@/hooks/use-config';
import { useModals } from '@/hooks/use-modals';
import { registerForPushNotificationsAsync } from '@/hooks/use-notifications';
import { useStorage } from '@/hooks/use-storage';
import SettingsIcon from '@/svg/settings.svg';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { Pressable } from '@/ui/pressable';

import MainPageHeader from '../main-pill-reminder/components/main-page-header';
import ContactsArea from './components/contacts-area';
import ContactsAreaWithoutPermission from './components/contacts-area-without-permission';
import PhotosArea from './components/photos-area';
import PhotosAreaWithoutPermission from './components/photos-area-without-permission';
import PillReminderArea from './components/pill-reminder-area';
import SecureFolderArea from './components/secure-folder-area';
import SmartCleanerBanner from './components/smart-cleaner-banner';

export default function MainCleanerPage() {
  const { appType } = useConfig();
  const insets = useSafeAreaInsets();
  const { currentModal } = useModals();
  const [isNotificationRegistered, setIsNotificationRegistered] = useStorage(
    'isNotificationRegistered'
  );
  const [isPhotosPermissionAsked] = useStorage('isPhotosPermissionAsked');
  const [isContactsPermissionAsked] = useStorage('isContactsPermissionAsked');
  const [isReadyToShow, setIsReadyToShow] = useState(false);

  useEffect(() => {
    if (
      !isNotificationRegistered &&
      !currentModal &&
      appType !== 'pill-reminder'
    ) {
      registerForPushNotificationsAsync();
      setIsNotificationRegistered(true);
      setIsReadyToShow(true);
    }
  }, [isNotificationRegistered, currentModal, appType]);

  return (
    <Page>
      {appType === 'pill-reminder' ? (
        <PageHeader pageName="Cleaner">
          <Pressable
            className="items-center justify-center rounded-xl bg-white size-10"
            onPress={() => router.navigate('/settings')}
          >
            <SettingsIcon />
          </Pressable>
        </PageHeader>
      ) : (
        <MainPageHeader />
      )}
      <ScrollView
        className="-mt-2.5 pt-2.5"
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
      >
        {(appType === 'pill-reminder' || isReadyToShow) && (
          <View className="gap-y-2">
            <SmartCleanerBanner />
            {isPhotosPermissionAsked ? (
              <PhotosArea />
            ) : (
              <PhotosAreaWithoutPermission />
            )}
            {appType !== 'pill-reminder' && <PillReminderArea />}
            {isContactsPermissionAsked ? (
              <ContactsArea />
            ) : (
              <ContactsAreaWithoutPermission />
            )}
            <SecureFolderArea />
          </View>
        )}
      </ScrollView>
    </Page>
  );
}
