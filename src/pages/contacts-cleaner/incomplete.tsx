import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleY } from '@kirz/nativewind-scale';
import { useLocalSearchParams } from 'expo-router';
import { lazy, Suspense, useEffect, useState } from 'react';
import { ActionSheetIOS, Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/components/scan-loader';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { useStorage } from '@/hooks/use-storage';
import {
  removeContact,
  useContactsIncomplete,
} from '@/modules/contacts-kit/react';
import { ButtonPrimary } from '@/ui/button-primary';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiText } from '@/ui/ui-text';
import { Deferred } from '@/utils/deferred';

import { useSelectedContacts } from './hooks/use-selected-contacts';

const FlatContactsListView = lazy(
  () => import('./components/flat-contacts-list-view')
);

export function ContactsCleanerIncomplete() {
  const { origin } = useLocalSearchParams<{
    origin?: 'smartCleaner';
  }>();
  const originSmartCleaner = origin === 'smartCleaner';
  const insets = useSafeAreaInsets();
  const { openModal, closeModal } = useModals();
  const [contactsDeletionLimit, setContactsDeletionLimit] = useStorage(
    'contactsDeletionLimit'
  );
  const hasPremium = useHasPremiumWithBackdoor();

  const { ids, status, refetch } = useContactsIncomplete();
  const [isLoading, setIsLoading] = useState(false);
  const { logEvent } = useAnalytics();
  useEffect(() => {
    logEvent('incomplete_numbers');
  }, [logEvent]);
  const {
    selectedContacts,
    handleContactSelect,
    isContactSelected,
    selectAllContacts,
    deselectAllContacts,
    isAllSelected,
    setSelectionMode,
  } = useSelectedContacts(ids);

  useEffect(() => {
    setSelectionMode(true);
    if (originSmartCleaner) {
      return () => {};
    }

    deselectAllContacts();
    return () => {
      setSelectionMode(false);
      deselectAllContacts();
    };
  }, [setSelectionMode, deselectAllContacts, originSmartCleaner]);

  const handleDeleteContacts = async () => {
    const d = new Deferred();
    let limitDiff = 0;
    let contactsToDelete = Array.from(selectedContacts);

    if (!hasPremium) {
      if (contactsToDelete.length > contactsDeletionLimit) {
        openModal('LimitDeletionsModal', { count: 3 });

        if (contactsDeletionLimit === 0) {
          return false;
        }

        contactsToDelete = contactsToDelete.slice(0, contactsDeletionLimit);

        limitDiff = contactsDeletionLimit;
        setContactsDeletionLimit(0);
      } else {
        limitDiff = contactsToDelete.length;
        setContactsDeletionLimit(
          contactsDeletionLimit - contactsToDelete.length
        );
      }
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Cancel',
          `Delete ${contactsToDelete.length} contact${contactsToDelete.length === 1 ? 's' : ''}`,
        ],
        cancelButtonIndex: 0,
        title: 'Delete contacts',
        message:
          'Do you really want to delete selected contacts from your address book?',
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          setContactsDeletionLimit((prev) => prev + limitDiff);
        }
        if (buttonIndex === 1) {
          try {
            setIsLoading(true);
            await Promise.all(contactsToDelete.map((id) => removeContact(id)));
            d.resolve(true);
            deselectAllContacts();
          } catch (error) {
            setContactsDeletionLimit((prev) => prev + limitDiff);
            console.error('Error deleting contacts:', error);
            d.resolve(false);
          } finally {
            setIsLoading(false);
          }
        } else {
          d.resolve(false);
        }
      }
    );

    const r = await d.promise.catch(() => false);
    closeModal('CleaningModal', () => {
      if (r) {
        openModal('CleanerHappyModal', {
          children: (
            <UiText className="text-center">
              <UiText className="font-semibold">
                {contactsToDelete.length} contact
                {contactsToDelete.length === 1 ? '' : 's'}
              </UiText>{' '}
              <UiText className="text-sm opacity-70">deleted</UiText>
            </UiText>
          ),
        });
      }
    });
  };

  return (
    <Page>
      <PageHeader pageName="Incomplete">
        {status !== 'loading' && ids.length === 0 ? (
          <View className="size-10" />
        ) : (
          <Pressable
            className="items-end justify-center size-10"
            onPress={() => {
              if (isAllSelected) {
                deselectAllContacts();
              } else {
                selectAllContacts();
              }
            }}
          >
            <UiText
              className={twMerge(
                'text-sm font-medium -ml-12',
                isAllSelected ? 'text-red' : 'text-primary'
              )}
            >
              {isAllSelected ? 'Deselect all' : 'Select all'}
            </UiText>
          </Pressable>
        )}
      </PageHeader>
      <View className="-mt-2 mb-3">
        <UiText className="text-sm font-medium text-grayDark">
          {ids.length} contact{ids.length !== 1 && 's'}
        </UiText>
      </View>
      <Suspense fallback={<Loader />}>
        <Animated.View className="flex-1" entering={FadeIn}>
          <FlatContactsListView
            data={ids}
            handleContactSelect={handleContactSelect}
            isContactSelected={isContactSelected}
            isRefreshing={status === 'loading'}
            refresh={refetch}
            selectionMode={true}
            type="address-book"
          />
        </Animated.View>
      </Suspense>
      {!!selectedContacts.size && (
        <View
          className="absolute flex-row gap-2.5 inset-x-3 px-4 bottom-0"
          style={{ bottom: insets.bottom + scaleY(20) }}
        >
          <ButtonPrimary
            className="flex-1 bg-primary"
            disabled={selectedContacts.size < 1}
            label={`Delete ${selectedContacts.size} Contact${selectedContacts.size > 1 ? 's' : ''}`}
            loading={status === 'loading' || isLoading}
            onPress={handleDeleteContacts}
          />
        </View>
      )}
    </Page>
  );
}
