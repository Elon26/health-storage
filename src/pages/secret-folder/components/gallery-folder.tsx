import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import * as FileSystem from 'expo-file-system';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { shareAsync } from 'expo-sharing';
import {
  type ExpoSimpleGalleryMethods,
  ExpoSimpleGalleryView,
} from 'expo-simple-gallery';
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useState,
} from 'react';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyList } from '@/components/empty-list';
import { FullscreenViewOverlayComponent } from '@/components/gallery/fullscreen-overlay';
import { ThumbnailOverlayComponent } from '@/components/gallery/thumbnail-overlay';
import { colors } from '@/config/theme';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { useStorage } from '@/hooks/use-storage';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { isNotNullOrUndefined } from '@/utils/array';
import { Deferred } from '@/utils/deferred';

import { useSecretFolderGallery } from '../hooks/use-secret-folder-gallery';
import type { SecretFolderAsset } from '../hooks/use-secret-folder-gallery/atom';

const FREE_LIMIT = 5;

type Props = {
  selectedAssets: SecretFolderAsset[];
  setSelected: Dispatch<SetStateAction<SecretFolderAsset[]>>;
  galleryRef: RefObject<ExpoSimpleGalleryMethods | null>;
  setCurrentFolder: Dispatch<SetStateAction<'Photos' | 'Contacts'>>;
};

export default function GalleryFolder({
  selectedAssets,
  setSelected,
  galleryRef,
}: Props) {
  const insets = useSafeAreaInsets();

  const hasPremium = useHasPremiumWithBackdoor();
  const { openModal } = useModals();
  const { logEvent } = useAnalytics();
  const [secretFolderLimit, setSecretFolderLimit] =
    useStorage('secretFolderLimit');

  const [adding, setAdding] = useState(false);

  const { assets, addAssets, deleteAssets } = useSecretFolderGallery({
    restoreAfterDeletePrompt: async () => {
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
    },
    sort: 'DESC',
  });

  const uris =
    assets
      ?.map(
        ({ uri, originalUri }: SecretFolderAsset) =>
          `${FileSystem.documentDirectory}${originalUri ?? uri}`
      )
      .filter((uri): uri is string => uri !== undefined) ?? [];

  const getAssetByUri = (uri: string) => {
    const relativeUri = uri.split('/').pop();
    return assets.find((a) => a.originalUri?.endsWith(relativeUri ?? ''));
  };

  const deleteByUri = async (uri: string) => {
    const foundAsset = getAssetByUri(uri);
    if (!foundAsset) {
      return false;
    }
    await deleteAssets([foundAsset.id]);
    return true;
  };

  function handleAdd() {
    if (!hasPremium && secretFolderLimit === 0) {
      openModal('LimitFilesModal', { count: FREE_LIMIT });
      return;
    }
    impactAsync(ImpactFeedbackStyle.Medium);
    setAdding(true);
    addAssets(hasPremium ? undefined : secretFolderLimit)
      .then((result) => {
        const count = result?.length;
        let newLimit = secretFolderLimit - (count ?? 0);

        if (!hasPremium && newLimit < 0) {
          newLimit = 0;
          openModal('LimitFilesModal', { count: FREE_LIMIT });
        } else if (count) {
          openModal('AddedFilesModal', { count });
        }
        if (!hasPremium) setSecretFolderLimit(newLimit);
      })
      .finally(() => {
        galleryRef.current?.setSelected([]);
        setSelected([]);
        setAdding(false);
      });

    logEvent('tap_add_to_secret_folder');
  }

  return (
    <View className="flex-1">
      {uris.length === 0 && <EmptyList text="Nothing here." />}
      {uris.length !== 0 && (
        <ExpoSimpleGalleryView
          assets={uris}
          columnsCount={3}
          contentContainerStyle={{
            paddingTop: 16,
            gap: 8,
            paddingBottom: scaleY(100),
          }}
          contextMenuOptions={[
            {
              title: 'Open',
              sfSymbol: 'arrowshape.turn.up.right',
              action: ({ index }) => galleryRef.current?.openImageViewer(index),
            },
            {
              title: 'Share',
              sfSymbol: 'square.and.arrow.up',
              action: async ({ uri }) => {
                shareAsync(uri);
              },
            },
            {
              title: 'Delete',
              attributes: ['destructive'],
              sfSymbol: 'trash',
              action: async ({ uri }) => {
                deleteByUri(uri);
              },
            },
          ]}
          fullscreenViewOverlayComponent={(props) => (
            <FullscreenViewOverlayComponent
              {...props}
              closeViewer={galleryRef.current?.closeImageViewer}
              deleteByUri={deleteByUri}
              total={uris.flat().length}
              withButtons
            />
          )}
          fullscreenViewOverlayStyle={{
            backgroundColor: colors.background.toString(),
          }}
          onSelectionChange={({ nativeEvent: { selected } }) => {
            const selectedAssets = selected
              .map((uri) => getAssetByUri(uri))
              .filter(isNotNullOrUndefined);
            setSelected(selectedAssets);
          }}
          ref={galleryRef}
          showMediaTypeIcon={false}
          style={{ flex: 1 }}
          thumbnailLongPressAction="preview"
          thumbnailOverlayComponent={ThumbnailOverlayComponent}
          thumbnailPanAction="select"
          thumbnailPressAction="select"
          thumbnailStyle={{ borderRadius: scaleX(16) }}
        />
      )}

      <View
        className="absolute items-center justify-center inset-x-4 bottom-0"
        style={{ paddingBottom: insets.bottom + scaleY(10) }}
      >
        {selectedAssets.length ? (
          <UiButton
            className="bg-red"
            disabled={adding}
            loading={adding}
            onPress={async () => {
              impactAsync(ImpactFeedbackStyle.Medium);
              if (selectedAssets.length === 0) {
                return;
              }
              try {
                setAdding(true);
                const ids = selectedAssets.map((asset) => asset.id);
                await deleteAssets(ids);
              } finally {
                galleryRef.current?.setSelected([]);
                setSelected([]);
                setAdding(false);
              }
            }}
          >
            <UiText className="font-semibold text-white">
              Delete {selectedAssets.length} Photo
              {selectedAssets.length === 1 ? '' : 's'}
            </UiText>
          </UiButton>
        ) : (
          <UiButton disabled={adding} loading={adding} onPress={handleAdd}>
            <UiText className="font-semibold text-white">Add</UiText>
          </UiButton>
        )}
      </View>
    </View>
  );
}
