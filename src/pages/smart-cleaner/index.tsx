import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { prettyBytes } from '@kirz/react-native-device-info';
import { RelativePathString, router } from 'expo-router';
import numbro from 'numbro';
import { useEffect, useRef } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { shadows } from '@/config/theme/shadows';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useLayoutInsets } from '@/hooks/use-layout-insets';
import { useModals } from '@/hooks/use-modals';
import { usePermissionAlert } from '@/hooks/use-permission-alert';
import { useStorage } from '@/hooks/use-storage';
import { CameraRoll, CleanerGalleryApiV2 } from '@/modules/cleaner-gallery';
import {
  mergeContacts,
  removeContact,
  useContactsIncomplete,
  useContactsSimilarByField,
} from '@/modules/contacts-kit/react';
import { useSelectedContacts } from '@/pages/contacts-cleaner/hooks/use-selected-contacts';
import {
  refetchAll,
  useAssets,
  useSelection,
} from '@/pages/gallery-cleaner/hooks/use-cleaner-album';
import type {
  GalleryCleanerAlbum,
  GalleryCleanerAlbumStatus,
} from '@/pages/gallery-cleaner/hooks/use-cleaner-album/types';
import { ButtonPrimary } from '@/ui/button-primary';
import { Checkbox } from '@/ui/checkbox';
import { ChevronRight } from '@/ui/chevron';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiText } from '@/ui/ui-text';
import { Deferred } from '@/utils/deferred';
import { uuid } from '@/utils/uuid';

import ResumeBanner from './components/resume-banner';
import { useTotalUsage } from './hooks/use-total-usage';

export function SmartCleanerPage() {
  const insets = useLayoutInsets();
  const { isLoading, items } = useTotalUsage();
  const { idGroups: duplicateContactsGroups, status: duplicateContactsStatus } =
    useContactsSimilarByField('any');

  const { ids: incompleteContactsGroups, status: incompleteContactsStatus } =
    useContactsIncomplete();
  const { logEvent } = useAnalytics();
  useEffect(() => {
    logEvent('smart_cleaner');
  }, [logEvent]);

  usePermissionAlert(
    'ios.permission.CONTACTS',
    'Access to contacts is required to use this feature.'
  );

  usePermissionAlert(
    'ios.permission.PHOTO_LIBRARY',
    'Access to Photo Library required to clean up your photos.'
  );

  return (
    <Page>
      <PageHeader pageName="Smart Cleaner" />
      <View
        className="flex-1 overflow-visible"
        style={{
          paddingTop: insets.top,
        }}
      >
        <ScrollView
          className="-mt-5 pt-5"
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 0 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
        >
          <ResumeBanner />
          <View className="rounded-4.5xl gap-2.5 w-full" style={shadows.sm}>
            {(
              [
                [
                  'Screenshots',
                  items.screenshots.items,
                  items.screenshots.status,
                  'screenshots',
                ],

                [
                  'Blurry Photos',
                  items.blurryPhotos.items,
                  items.blurryPhotos.status,
                  'blurryPhotos',
                ],
                [
                  'Similar Photos',
                  items.similarPhotos.items.flat(),
                  items.similarPhotos.status,
                  'similarPhotos',
                ],
              ] as [
                string,
                string[],
                GalleryCleanerAlbumStatus,
                GalleryCleanerAlbum,
              ][]
            ).map(([title, uris, status, albumName]) => (
              <CleanerGalleryRow
                albumName={albumName}
                key={albumName}
                status={status}
                title={title}
                uris={uris}
              />
            ))}
            <CleanerContactsRow
              name="Duplicate Contacts"
              path={'/contacts-cleaner-duplicates' as RelativePathString}
              groups={duplicateContactsGroups}
              status={duplicateContactsStatus}
            />
            <CleanerContactsRow
              name="Incomplete Contacts"
              path={'/contacts-cleaner-incomplete' as RelativePathString}
              groups={incompleteContactsGroups}
              status={incompleteContactsStatus}
            />
          </View>

          <View className="mt-7">
            <CleanButton isLoading={isLoading} />
          </View>
        </ScrollView>
      </View>
    </Page>
  );
}

type CleanerGalleryRowProps = {
  title: string;
  uris: string[];
  status: GalleryCleanerAlbumStatus;
  albumName: GalleryCleanerAlbum;
};

function CleanerGalleryRow({
  title,
  uris,
  status,
  albumName,
}: CleanerGalleryRowProps) {
  const { isSelected, select, deselect } = useSelection();
  const ids = uris.map((uri) => uri.replace('ph://', ''));
  const assets = useAssets(ids);
  const size = ids.reduce((acc, ids) => acc + (assets?.[ids]?.size ?? 0), 0);
  const { logEvent } = useAnalytics();

  useEffect(() => {
    logEvent(`${albumName}`);
  }, [albumName, logEvent]);

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between rounded-2xl bg-white gap-x-3 px-5 h-18 w-full"
      onPress={() =>
        router.navigate({
          pathname: '/gallery-cleaner-folder',
          params: { folder: albumName, origin: 'smartCleaner' },
        })
      }
    >
      <View className="flex-1 flex-row items-center gap-x-3">
        <Checkbox
          checked={isSelected(uris)}
          disabled={
            uris.length === 0 || status === 'loading' || status === 'error'
          }
          onChange={(selected) => {
            selected ? select(uris) : deselect(uris);
          }}
          isAltView
        />
        <View>
          <UiText className="text-base font-semibold">{title}</UiText>
          <View className="flex-row items-center mt-1">
            {status === 'loading' ? (
              <ActivityIndicator />
            ) : (
              <UiText className="text-xs text-grayDark">{uris.length}</UiText>
            )}
            <UiText className="text-xs text-grayDark">
              {' '}
              item
              {uris.length !== 1 ? 's' : ''}
            </UiText>
          </View>
        </View>
      </View>
      <View
        className="flex-row items-center justify-between rounded-2xl bg-primary gap-x-1 px-2 py-2"
        style={{ width: scaleX(84) }}
      >
        {status === 'loading' ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <UiText className="flex-1 text-center text-xs font-medium text-white">
            {prettyBytes(size)}
          </UiText>
        )}
        <ChevronRight />
      </View>
    </TouchableOpacity>
  );
}

type CleanerContactsRowProps = {
  name: string;
  path: RelativePathString;
  groups: string[] | string[][];
  status: GalleryCleanerAlbumStatus;
};

function CleanerContactsRow({
  name,
  path,
  groups,
  status,
}: CleanerContactsRowProps) {
  const items = groups.flat();

  const {
    selectGroupOfContacts,
    deselectGroupOfContacts,
    isGroupSelected,
    isNoneOfGroupSelected,
  } = useSelectedContacts(items);

  return (
    <TouchableOpacity
      key={uuid()}
      className="flex-row items-center justify-between rounded-2xl bg-white gap-x-3 px-5 h-18 w-full"
      onPress={() =>
        router.navigate({
          pathname: path,
          params: { origin: 'smartCleaner' },
        })
      }
    >
      <View className="flex-1 flex-row items-center gap-x-3">
        <Checkbox
          checked={
            isGroupSelected() ? true : isNoneOfGroupSelected() ? false : 'mix'
          }
          disabled={
            items.length === 0 || status === 'loading' || status === 'error'
          }
          onChange={(selected) => {
            selected ? selectGroupOfContacts() : deselectGroupOfContacts();
          }}
          isAltView
        />
        <View className="">
          <UiText className="text-base font-semibold">{name}</UiText>
          <UiText className="text-xs text-grayDark mt-1">
            {status === 'loading' ? '...' : items.length} contact
            {items.length !== 1 ? 's' : ''}
          </UiText>
        </View>
      </View>
      <View
        className="flex-row items-center justify-between rounded-2xl bg-primary gap-x-1 px-2 py-2"
        style={{ width: scaleX(84) }}
      >
        {status === 'loading' ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <UiText className="flex-1 text-center text-xs font-medium text-white">
            {prettyBytes(items.length * 1000)}
          </UiText>
        )}
        <ChevronRight />
      </View>
    </TouchableOpacity>
  );
}

type CleanButtonProps = {
  isLoading: boolean;
};

function CleanButton({ isLoading }: CleanButtonProps) {
  const { ids: incompleteContactsGroups } = useContactsIncomplete();
  const [contactsDeletionLimit, setContactsDeletionLimit] = useStorage(
    'contactsDeletionLimit'
  );
  const [galleryDeletionLimit, setGalleryDeletionLimit] = useStorage(
    'galleryDeletionLimit'
  );

  const hasPremium = useHasPremiumWithBackdoor();
  const { openModal } = useModals();
  const { idGroups: contactsGroups } = useContactsSimilarByField('any');
  const { selectedContacts, deselectAllContacts } = useSelectedContacts(
    contactsGroups.flat()
  );
  const { clearSelection, selectedAssets } = useSelection();
  const { logEvent } = useAnalytics();
  const cleanedContactsCountRef = useRef(0);
  const deletedAssetsCountRef = useRef(0);
  const deletedAssetsSizeRef = useRef(0);
  let contactsToDelete = Array.from(selectedContacts).filter(
    (selectedContact) => incompleteContactsGroups.includes(selectedContact)
  );

  const mergeGroup = () => {
    const groups = contactsGroups;
    const mergeableGroups: string[][] = [];
    for (const group of groups) {
      const g: string[] = [];
      for (const id of group) {
        if (selectedContacts.has(id)) {
          g.push(id);
        }
      }
      if (g.length > 1) {
        mergeableGroups.push(g);
      }
    }
    if (mergeableGroups.length === 0 && contactsToDelete.length === 0) {
      return;
    }
    cleanedContactsCountRef.current =
      mergeableGroups.flat().length - mergeableGroups.length;
    return handleMerge(mergeableGroups);
  };

  const handleMerge = async (groups: string[][]) => {
    if (groups.length === 0 && contactsToDelete.length === 0) {
      return;
    }

    const d = new Deferred();

    let limitDiff = 0;
    let contactsToMerge = groups;

    if (!hasPremium) {
      if (
        contactsToDelete.length + contactsToMerge.length >
        contactsDeletionLimit
      ) {
        contactsToMerge = contactsToMerge.slice(0, contactsDeletionLimit);

        if (contactsToMerge.length <= contactsDeletionLimit) {
          if (contactsDeletionLimit - contactsToMerge.length === 0) {
            contactsToDelete = [];
          } else {
            contactsToDelete = contactsToDelete.slice(
              0,
              contactsDeletionLimit - contactsToMerge.length
            );
          }
        }

        limitDiff = contactsDeletionLimit;
        setContactsDeletionLimit(0);
      } else {
        limitDiff = contactsToMerge.length + contactsToDelete.length;
        setContactsDeletionLimit(
          contactsDeletionLimit -
            contactsToMerge.length -
            contactsToDelete.length
        );
      }
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          contactsToMerge.flat().length && contactsToDelete.length
            ? 'Merge and Delete'
            : contactsToMerge.flat().length
              ? 'Merge'
              : 'Delete',
          'Cancel',
        ],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        title:
          contactsToMerge.flat().length && contactsToDelete.length
            ? 'Merge and delete contacts'
            : contactsToMerge.flat().length
              ? 'Merge contacts'
              : 'Delete contacts',
        message:
          contactsToMerge.flat().length && contactsToDelete.length
            ? `Merge ${contactsToMerge.flat().length} contacts into ${contactsToMerge.length} contact${
                contactsToMerge.length === 1 ? '' : 's'
              } and delete ${contactsToDelete.length} contact${contactsToDelete.length > 1 ? 's' : ''}?`
            : contactsToMerge.flat().length
              ? `Merge ${contactsToMerge.flat().length} contacts into ${contactsToMerge.length} contact${
                  contactsToMerge.length === 1 ? '' : 's'
                }?`
              : `Delete ${contactsToDelete.length} contact${contactsToDelete.length > 1 ? 's' : ''}?`,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          setContactsDeletionLimit((prev) => prev + limitDiff);
        }
        if (buttonIndex === 0) {
          if (contactsToMerge.length !== 0) {
            await mergeContacts(contactsToMerge);
          }
          if (contactsToDelete.length !== 0) {
            await deleteContacts(contactsToDelete);
          }
          deselectAllContacts();
          d.resolve(true);
        }
        d.resolve(false);
      }
    );

    const r = await d.promise;

    if (!r) {
      cleanedContactsCountRef.current = 0;
    }
  };

  const deleteContacts = async (contactsToDelete: string[]) => {
    await Promise.all(contactsToDelete.map((id) => removeContact(id)));
  };

  const deleteByUri = async (uri: string | string[]) => {
    let urisArray = Array.isArray(uri) ? uri : [uri];

    let limitDiff = 0;

    if (!hasPremium) {
      if (urisArray.length > galleryDeletionLimit) {
        urisArray = urisArray.slice(0, galleryDeletionLimit);

        limitDiff = galleryDeletionLimit;
        setGalleryDeletionLimit(0);
      } else {
        limitDiff = urisArray.length;
        setGalleryDeletionLimit(galleryDeletionLimit - urisArray.length);
      }
    }

    const ids = urisArray.map((u) => u.replace('ph://', ''));
    try {
      const info = await CleanerGalleryApiV2.getDetails(ids);
      const { success } = await CameraRoll.deleteAssets(ids);
      if (success) {
        clearSelection();
        refetchAll();
        const size = info.reduce((acc, asset) => acc + (asset.size || 0), 0);
        deletedAssetsSizeRef.current = size;
        deletedAssetsCountRef.current = ids.length;
      } else {
        setGalleryDeletionLimit((prev) => prev + limitDiff);
        throw new Error('User denied deletion');
      }
      return true;
    } catch {}
    return false;
  };

  const handleClean = async () => {
    logEvent('smart_clean_delete');

    if (
      !hasPremium &&
      (selectedAssets.length > galleryDeletionLimit ||
        selectedContacts.size > contactsDeletionLimit)
    ) {
      openModal('LimitDeletionsModal', { count: 3 });
    }

    if (selectedContacts.size > 0 && contactsDeletionLimit > 0) {
      try {
        await mergeGroup();
      } catch {}
    }

    if (selectedAssets.length > 0 && galleryDeletionLimit > 0) {
      try {
        await deleteByUri(selectedAssets);
      } catch {}
    }

    const totalCleanedCount =
      deletedAssetsCountRef.current + cleanedContactsCountRef.current;
    const cleanedSizeString = numbro(deletedAssetsSizeRef.current).format({
      output: 'byte',
      base: 'binary',
      mantissa: 1,
    });
    if (totalCleanedCount > 0) {
      openModal('CleanerHappyModal', {
        children: (
          <UiText className="text-center text-sm text-gray">
            <UiText className="font-semibold text-primary">
              {totalCleanedCount} file{totalCleanedCount === 1 ? '' : 's'}{' '}
            </UiText>
            deleted and{' '}
            {deletedAssetsSizeRef.current ? (
              <UiText className="text-sm font-semibold text-primary">
                {cleanedSizeString}
              </UiText>
            ) : (
              'some'
            )}{' '}
            of storage freed
          </UiText>
        ),
      });
    }
    deletedAssetsSizeRef.current = 0;
    deletedAssetsCountRef.current = 0;
    cleanedContactsCountRef.current = 0;
  };

  return (
    <View>
      <ButtonPrimary
        className="bg-primary"
        disabled={
          isLoading || selectedAssets.length + selectedContacts.size === 0
        }
        label={
          selectedAssets.length + selectedContacts.size > 0
            ? `Delete ${selectedAssets.length + selectedContacts.size} item${selectedAssets.length + selectedContacts.size > 1 ? 's' : ''}`
            : 'Delete'
        }
        onPress={handleClean}
        loading={isLoading}
        style={{
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        }}
      />
    </View>
  );
}
