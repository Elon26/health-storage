import { useAnalytics } from '@kirz/expo-toolkit';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import type { ExpoSimpleGalleryMethods } from 'expo-simple-gallery';
import { usePinSettings } from 'expo-with-pincode';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useModals } from '@/hooks/use-modals';
import { useStorage } from '@/hooks/use-storage';
import { usePrivateContactIds } from '@/modules/contacts-kit/react';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import { useSelectedContacts } from '../contacts-cleaner/hooks/use-selected-contacts';
import ContactsFolder from './components/contacts-folder';
import FolderSelector from './components/folder-selector';
import GalleryFolder from './components/gallery-folder';
import ItemsRow from './components/items-row';
import { useSecretFolderGallery } from './hooks/use-secret-folder-gallery';
import type { SecretFolderAsset } from './hooks/use-secret-folder-gallery/atom';

export function SecretFolderPage() {
  const { isPincodeSet } = usePinSettings();
  const { logEvent } = useAnalytics();
  const { openModal } = useModals();

  useEffect(() => {
    logEvent('secret_folder');
  }, [logEvent]);

  const [secretFolderModalIsShown, setSecretFolderModalIsShown] = useStorage(
    'secretFolderModalIsShown'
  );

  useFocusEffect(() => {
    if (!secretFolderModalIsShown && !isPincodeSet) {
      openModal('ProtectFilesModal');
      setSecretFolderModalIsShown(true);
    }
  });

  const [currentFolder, setCurrentFolder] = useState<'Photos' | 'Contacts'>(
    'Photos'
  );

  const { ids: contactIds } = usePrivateContactIds();

  const {
    selectAllContacts,
    deselectAllContacts,
    isAllSelected: isAllContactsSelected,
  } = useSelectedContacts(contactIds);

  const { assets } = useSecretFolderGallery();
  const [selectedAssets, setSelected] = useState<SecretFolderAsset[]>([]);

  const galleryRef = useRef<ExpoSimpleGalleryMethods>(null);

  const uris =
    assets
      ?.map(
        ({ uri, originalUri }: SecretFolderAsset) =>
          `${FileSystem.documentDirectory}${originalUri ?? uri}`
      )
      .filter((uri): uri is string => uri !== undefined) ?? [];

  const [isAllAssetsSelected, setIsAllAssetsSelected] = useState(
    selectedAssets.length > 0 && selectedAssets.length === uris.length
  );

  useEffect(() => {
    if (currentFolder === 'Contacts') {
      deselectAllContacts();
    }

    if (currentFolder === 'Photos') {
      galleryRef.current?.setSelected([]);
      setSelected([]);
      setIsAllAssetsSelected(false);
    }
  }, [currentFolder]);

  useEffect(() => {
    setIsAllAssetsSelected(
      selectedAssets.length > 0 && selectedAssets.length === uris.length
    );
  }, [selectedAssets, uris]);

  return (
    <Page>
      <PageHeader pageName="Secure Folder">
        {(currentFolder === 'Contacts' && contactIds.length === 0) ||
        (currentFolder === 'Photos' && assets.length === 0) ? (
          <View className="size-10" />
        ) : (
          <Pressable
            className="items-end justify-center size-10"
            onPress={() => {
              if (currentFolder === 'Contacts') {
                if (isAllContactsSelected) {
                  deselectAllContacts();
                } else {
                  selectAllContacts();
                }
              }
              if (currentFolder === 'Photos') {
                if (isAllAssetsSelected) {
                  galleryRef.current?.setSelected([]);
                } else {
                  galleryRef.current?.setSelected(uris);
                }
              }
            }}
          >
            <UiText
              className={twMerge(
                'text-sm font-medium -ml-12',
                (currentFolder === 'Contacts' && isAllContactsSelected) ||
                  (currentFolder === 'Photos' && isAllAssetsSelected)
                  ? 'text-red'
                  : 'text-primary'
              )}
            >
              {(currentFolder === 'Contacts' && isAllContactsSelected) ||
              (currentFolder === 'Photos' && isAllAssetsSelected)
                ? 'Deselect all'
                : 'Select all'}
            </UiText>
          </Pressable>
        )}
      </PageHeader>

      <FolderSelector
        folder={currentFolder}
        setCurrentFolder={setCurrentFolder}
      />

      <ItemsRow
        isPincodeSet={isPincodeSet}
        type={currentFolder}
        quantity={currentFolder === 'Photos' ? uris.length : contactIds.length}
      />

      <View className="flex-1">
        {currentFolder === 'Photos' && (
          <GalleryFolder
            galleryRef={galleryRef}
            selectedAssets={selectedAssets}
            setSelected={setSelected}
            setCurrentFolder={setCurrentFolder}
          />
        )}
        {currentFolder === 'Contacts' && <ContactsFolder />}
      </View>
    </Page>
  );
}
