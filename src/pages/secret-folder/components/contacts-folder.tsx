import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleY } from '@kirz/nativewind-scale';
import { Suspense, useEffect, useState } from 'react';
import {
  Alert,
  InteractionManager,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { groupBy } from 'remeda';

import { EmptyList } from '@/components/empty-list';
import { Loader } from '@/components/scan-loader';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { useStorage } from '@/hooks/use-storage';
import {
  createOrImportPrivateContact,
  deletePrivateContacts,
  usePrivateCnContacts,
  usePrivateContactIds,
} from '@/modules/contacts-kit/react';
import GroupContactsListView from '@/pages/contacts-cleaner/components/group-contacts-list-view';
import { useSelectedContacts } from '@/pages/contacts-cleaner/hooks/use-selected-contacts';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { isNotNullOrUndefined } from '@/utils/array';
import { Deferred } from '@/utils/deferred';

const FREE_LIMIT = 5;

export default function ContactsFolder() {
  const hasPremium = useHasPremiumWithBackdoor();
  const [secretFolderLimit, setSecretFolderLimit] =
    useStorage('secretFolderLimit');

  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const { logEvent } = useAnalytics();
  const { ids, refetch, status } = usePrivateContactIds();
  const contacts = usePrivateCnContacts();

  const [zipped, setZipped] = useState<[string, string[]][]>([]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const groupedByAlphabet = groupBy(ids, (id) => {
        const { familyName, givenName } = contacts[id] ?? {};
        return (familyName ?? givenName ?? '#').charAt(0).toUpperCase();
      });

      const z = Object.entries(groupedByAlphabet).sort(([a], [b]) =>
        a.localeCompare(b)
      );
      setZipped(z);
      setLoading(false);
    });
  }, [contacts, ids]);

  const {
    selectedContacts,
    handleContactSelect,
    isContactSelected,
    setSelectedContacts,
  } = useSelectedContacts(ids);

  const { openModal } = useModals();

  const handleAddContact = async () => {
    if (!hasPremium && secretFolderLimit === 0) {
      openModal('LimitFilesModal', { count: FREE_LIMIT });
      return;
    }
    setLoading(true);
    try {
      const contacts = await createOrImportPrivateContact({
        limit: hasPremium ? undefined : secretFolderLimit,
      });
      const filtered = contacts.filter(isNotNullOrUndefined);
      let newLimit = secretFolderLimit - filtered.length;
      if (!hasPremium && newLimit < 0) {
        newLimit = 0;
        openModal('LimitFilesModal', { count: FREE_LIMIT });
      } else if (filtered.length > 0) {
        openModal('AddedFilesModal', { count: filtered.length });
      }
      if (!hasPremium) setSecretFolderLimit(newLimit);
    } finally {
      setLoading(false);
    }
    logEvent('tap_add_to_secret_folder');
  };

  const handleDeleteContacts = async () => {
    setLoading(true);
    try {
      await deletePrivateContacts(Array.from(selectedContacts), async () => {
        const d = new Deferred<boolean>();
        Alert.alert(
          'Are you sure you want to delete?',
          'This action is permanent. Deleted files can’t be restored.',
          [
            {
              text: 'Cancel',
              onPress: () => d.reject(),
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => d.resolve(false),
              style: 'destructive',
            },
          ]
        );
        return await d.promise;
      });
      setSelectedContacts(new Set<string>());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setSelectedContacts(new Set<string>());
    };
  }, [setSelectedContacts]);

  return (
    <View className="flex-1">
      {!ids.length && <EmptyList text="Nothing here." />}
      {ids.length > 0 && (
        <Suspense fallback={<Loader />}>
          <Animated.View className="flex-1" entering={FadeIn}>
            <GroupContactsListView
              data={zipped.map((group) => group[1])}
              groupHeader={(_, index) => zipped[index][0]}
              handleContactSelect={handleContactSelect}
              isContactSelected={isContactSelected}
              isRefreshing={status === 'loading'}
              refresh={refetch}
              type="private-contacts"
            />
          </Animated.View>
        </Suspense>
      )}
      <View
        className="absolute inset-x-2 bottom-0"
        style={{ paddingBottom: insets.bottom + scaleY(10) }}
      >
        {selectedContacts.size ? (
          <TouchableOpacity
            className="items-center justify-center overflow-hidden rounded-2xl bg-red h-13 w-full"
            disabled={selectedContacts.size === 0 || loading}
            onPress={handleDeleteContacts}
          >
            <UiText className="text-base font-semibold text-white">
              Delete {selectedContacts.size} Contact
              {selectedContacts.size === 1 ? '' : 's'}
            </UiText>
          </TouchableOpacity>
        ) : (
          <UiButton
            className="w-full"
            disabled={loading}
            loading={loading}
            onPress={handleAddContact}
          >
            <UiText className="text-base font-semibold text-white">Add</UiText>
          </UiButton>
        )}
      </View>
    </View>
  );
}
