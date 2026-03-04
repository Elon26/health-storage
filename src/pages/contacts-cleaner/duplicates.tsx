// src/pages/contacts-cleaner.tsx
import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleY } from '@kirz/nativewind-scale';
import { router, useLocalSearchParams } from 'expo-router';
import { lazy, Suspense, useEffect } from 'react';
import { ActionSheetIOS, Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/components/scan-loader';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { useStorage } from '@/hooks/use-storage';
import {
  mergeContacts,
  useContactsSimilarByField,
} from '@/modules/contacts-kit/react';
import { ButtonPrimary } from '@/ui/button-primary';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiText } from '@/ui/ui-text';
import { Deferred } from '@/utils/deferred';

import { useSelectedContacts } from './hooks/use-selected-contacts';

const GroupContactsListView = lazy(
  () => import('./components/group-contacts-list-view')
);

export function ContactsCleanerDuplicates() {
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
  const { logEvent } = useAnalytics();
  useEffect(() => {
    logEvent('dublicate_numbers');
  }, [logEvent]);
  const {
    idGroups: similarIds,
    status: similarStatus,
    refetch: refetchSimilar,
  } = useContactsSimilarByField('any');

  const contactIdsFlat = similarIds.flat();

  const {
    selectedContacts,
    handleContactSelect,
    isContactSelected,
    selectAllContacts,
    deselectAllContacts,
    isAllSelected,
    setSelectionMode,
  } = useSelectedContacts(contactIdsFlat);

  const mergeGroup = () => {
    const groups = similarIds;
    const mergeableGroups: string[][] = [];

    for (const group of groups) {
      const g: string[] = [];
      for (const id of group) {
        if (selectedContacts.has(id)) g.push(id);
      }
      if (g.length > 1) mergeableGroups.push(g);
    }

    if (mergeableGroups.length === 0) {
      return;
    }
    handleMerge(mergeableGroups);
  };

  const handleMerge = async (groups: string[][]) => {
    if (groups.length === 0) {
      return;
    }

    const d = new Deferred<boolean>();
    let limitDiff = 0;
    let contactsToMerge = groups;

    if (!hasPremium) {
      if (contactsToMerge.length > contactsDeletionLimit) {
        openModal('LimitDeletionsModal', { count: 3 });

        if (contactsDeletionLimit === 0) {
          return false;
        }

        contactsToMerge = contactsToMerge.slice(0, contactsDeletionLimit);

        limitDiff = contactsDeletionLimit;
        setContactsDeletionLimit(0);
      } else {
        limitDiff = contactsToMerge.length;
        setContactsDeletionLimit(
          contactsDeletionLimit - contactsToMerge.length
        );
      }
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Merge', 'Cancel'],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        title: 'Merge contacts',
        message: `Merge ${contactsToMerge.flat().length} contacts into ${contactsToMerge.length} contact${
          contactsToMerge.length === 1 ? '' : 's'
        }?`,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          setContactsDeletionLimit((prev) => prev + limitDiff);
        }
        if (buttonIndex === 0) {
          openModal('CleaningModal');
          try {
            await mergeContacts(contactsToMerge);
            deselectAllContacts();
            d.resolve(true);
          } catch (error) {
            setContactsDeletionLimit((prev) => prev + limitDiff);
            console.error('Error deleting contacts:', error);
            d.resolve(false);
          }
        }
        d.resolve(false);
      }
    );

    const r = await d.promise.catch(() => false);
    closeModal('CleaningModal', () => {
      if (r) {
        openModal('CleanerHappyModal', {
          children: (
            <UiText className="text-center">
              <UiText className="font-semibold">
                {contactsToMerge.flat().length} contact
                {contactsToMerge.flat().length === 1 ? '' : 's'}
              </UiText>{' '}
              <UiText className="text-sm opacity-70">merged</UiText>
            </UiText>
          ),
        });
      }
    });
  };

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

  return (
    <Page>
      <PageHeader pageName="Duplicates">
        {similarStatus !== 'loading' && similarIds.length === 0 ? (
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
          {similarIds.flat().length} contact
          {similarIds.flat().length !== 1 && 's'}
        </UiText>
      </View>
      <Suspense fallback={<Loader />}>
        <Animated.View className="flex-1" entering={FadeIn}>
          <GroupContactsListView
            data={similarIds}
            groupHeader={(group) => `${group.length} Duplicates`}
            handleContactSelect={handleContactSelect}
            isContactSelected={isContactSelected}
            isRefreshing={similarStatus === 'loading'}
            refresh={refetchSimilar}
          />
        </Animated.View>
      </Suspense>
      {selectedContacts.size > 0 && (
        <View
          className="absolute flex-row gap-2.5 inset-x-3 px-4 bottom-0"
          style={{ bottom: insets.bottom + scaleY(20) }}
        >
          <ButtonPrimary
            className="flex-1 bg-primary"
            disabled={selectedContacts.size < 2}
            label={`Merge ${selectedContacts.size} Contact${selectedContacts.size === 1 ? '' : 's'}`}
            onPress={() => {
              if (originSmartCleaner) {
                router.back();
                return;
              }
              mergeGroup();
            }}
          />
        </View>
      )}
    </Page>
  );
}
