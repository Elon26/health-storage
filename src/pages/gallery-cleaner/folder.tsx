import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { prettyBytes } from '@kirz/react-native-device-info';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { getAssetInfoAsync } from 'expo-media-library';
import { router, useLocalSearchParams } from 'expo-router';
import { shareAsync } from 'expo-sharing';
import {
  type ExpoSimpleGalleryMethods,
  ExpoSimpleGalleryView,
  type ThumbnailOverlayComponentProps,
} from 'expo-simple-gallery';
import numbro from 'numbro';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { difference, isNonNullish } from 'remeda';
import { twMerge } from 'tailwind-merge';

import { EmptyList } from '@/components/empty-list';
import { FullscreenViewOverlayComponent } from '@/components/gallery/fullscreen-overlay';
import { ThumbnailOverlayComponentWithBestLabel } from '@/components/gallery/thumbnail-overlay';
import { Loader } from '@/components/scan-loader';
import { colors } from '@/config/theme';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { useStorage } from '@/hooks/use-storage';
import { CameraRoll, CleanerGalleryApiV2 } from '@/modules/cleaner-gallery';
import { ButtonPrimary } from '@/ui/button-primary';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiText } from '@/ui/ui-text';
import { assert } from '@/utils/assert';

import {
  refetchAll,
  useAssets,
  useCleanerAlbum,
  useSelection,
} from './hooks/use-cleaner-album';
import {
  AlbumName,
  type GalleryCleanerAlbum,
  GalleryCleanerAvailableAlbums,
} from './hooks/use-cleaner-album/types';

export function GalleryCleanerFolder() {
  const { folder, origin } = useLocalSearchParams<{
    folder?: GalleryCleanerAlbum;
    origin?: 'smartCleaner';
  }>();
  const originSmartCleaner = origin === 'smartCleaner';
  assert(!!folder);
  assert(GalleryCleanerAvailableAlbums.includes(folder as GalleryCleanerAlbum));
  const { openModal, closeModal } = useModals();
  const { uris, status } = useCleanerAlbum(folder);
  const { selectedAssets, setSelection, clearSelection, isSelected } =
    useSelection();
  const hasPremium = useHasPremiumWithBackdoor();
  const insets = useSafeAreaInsets();
  const { logEvent } = useAnalytics();
  const [galleryDeletionLimit, setGalleryDeletionLimit] = useStorage(
    'galleryDeletionLimit'
  );
  const ids = uris.flat().map((uri) => uri.replace('ph://', ''));
  const assets = useAssets(ids);
  const size = ids.reduce((acc, id) => acc + (assets?.[id]?.size ?? 0), 0);
  const headerRow = `${ids.length} item${ids.length !== 1 && 's'} ${prettyBytes(size)}`;

  useEffect(() => {
    logEvent(`${folder}`);
  }, [folder, logEvent]);
  const galleryRef = useRef<ExpoSimpleGalleryMethods>(null);

  const bestIndexes = useMemo(() => {
    const best = new Set<number>();
    if (!Array.isArray(uris[0])) {
      return best;
    }
    let indexOfFirstEl = 0;
    for (const group of uris) {
      best.add(indexOfFirstEl);
      indexOfFirstEl += group.length;
    }
    return best;
  }, [uris]);

  useEffect(() => {
    if (originSmartCleaner) {
      return () => {};
    }
    clearSelection();
    return clearSelection;
  }, [clearSelection, originSmartCleaner]);

  const deleteByUri = async (uri: string | string[]) => {
    let urisArray = Array.isArray(uri) ? uri : [uri];
    let limitDiff = 0;

    if (!hasPremium) {
      if (urisArray.length > galleryDeletionLimit) {
        openModal('LimitDeletionsModal', { count: 3 });

        if (galleryDeletionLimit === 0) {
          return false;
        }

        urisArray = urisArray.slice(0, galleryDeletionLimit);

        limitDiff = galleryDeletionLimit;
        setGalleryDeletionLimit(0);
      } else {
        limitDiff = urisArray.length;
        setGalleryDeletionLimit(galleryDeletionLimit - urisArray.length);
      }
    }

    openModal('CleaningModal');

    const ids = urisArray.map((u) => u.replace('ph://', ''));
    try {
      const info = await CleanerGalleryApiV2.getDetails(ids);
      const { success } = await CameraRoll.deleteAssets(ids);
      if (success) {
        galleryRef.current?.setSelected([]);
        clearSelection();
        refetchAll();
        const size = info.reduce((acc, asset) => acc + (asset.size || 0), 0);
        closeModal('CleaningModal');
        openModal('CleanerHappyModal', {
          children: (
            <UiText className="text-center text-sm text-grayDark">
              <UiText className="font-semibold text-primary">
                {ids.length} file{ids.length === 1 ? '' : 's'}
              </UiText>{' '}
              deleted and{' '}
              {size ? (
                <UiText className="font-semibold text-primary">
                  {numbro(size).format({
                    output: 'byte',
                    base: 'binary',
                    mantissa: 1,
                  })}
                </UiText>
              ) : (
                'some'
              )}{' '}
              of storage freed
            </UiText>
          ),
        });
      } else {
        setGalleryDeletionLimit((prev) => prev + limitDiff);
        throw new Error('User denied deletion');
      }
      return true;
    } catch {
      closeModal('CleaningModal');
    }
    return false;
  };

  const thumbnailOverlayComponent = useCallback(
    (props: ThumbnailOverlayComponentProps) => (
      <ThumbnailOverlayComponentWithBestLabel
        bestIndexes={bestIndexes}
        {...props}
      />
    ),
    [bestIndexes]
  );

  return (
    <Page>
      <PageHeader
        pageName={
          folder ? AlbumName[folder as keyof typeof AlbumName] : 'Gallery'
        }
      >
        {status !== 'loading' && uris.length === 0 ? (
          <View className="size-10" />
        ) : (
          <Pressable
            className="items-end justify-center size-10"
            onPress={() => {
              if (isSelected(uris.flat()) === true) {
                galleryRef.current?.setSelected([]);
                clearSelection();
              } else {
                const diff = difference(uris.flat(), selectedAssets);
                galleryRef.current?.setSelected([...selectedAssets, ...diff]);
              }
            }}
          >
            <UiText
              className={twMerge(
                'text-sm font-medium -ml-12',
                isSelected(uris.flat()) === true ? 'text-red' : 'text-primary'
              )}
            >
              {isSelected(uris.flat()) === true ? 'Deselect all' : 'Select all'}
            </UiText>
          </Pressable>
        )}
      </PageHeader>
      <UiText
        className={twMerge(
          'text-sm font-medium text-grayDark',
          folder !== 'similarPhotos' && 'mb-5'
        )}
      >
        {headerRow}
      </UiText>
      <View className="flex-1">
        {status === 'loading' && <Loader />}
        {status !== 'loading' && uris.length === 0 && (
          <EmptyList text="Nothing to clean here." />
        )}
        {status !== 'loading' && uris.length !== 0 && (
          <ExpoSimpleGalleryView
            assets={uris}
            columnsCount={3}
            contentContainerStyle={{
              paddingBottom: insets.bottom + scaleY(64),
              gap: 4,
            }}
            contextMenuOptions={[
              {
                title: 'Open',
                sfSymbol: 'arrowshape.turn.up.right',
                action: ({ index }) =>
                  galleryRef.current?.openImageViewer(index),
              },
              {
                title: 'Share',
                sfSymbol: 'square.and.arrow.up',
                action: async ({ uri }) => {
                  const asset = await getAssetInfoAsync(
                    uri.replace('ph://', '')
                  );
                  if (!asset?.localUri) {
                    return;
                  }
                  shareAsync(asset.localUri);
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
                bestIndexes={bestIndexes}
                closeViewer={galleryRef.current?.closeImageViewer}
                deleteByUri={deleteByUri}
                total={uris.flat().length}
              />
            )}
            fullscreenViewOverlayStyle={{
              backgroundColor: colors.background.toString(),
            }}
            initiallySelected={selectedAssets}
            onSelectionChange={({ nativeEvent: { selected } }) => {
              setSelection(selected);
            }}
            ref={galleryRef}
            sectionHeaderComponent={(props) => {
              const item = uris[props.index];
              const groupAssets: string[] = Array.isArray(item) ? item : [item];

              const allSelected = groupAssets.every((uri: string) =>
                selectedAssets.includes(uri)
              );

              return (
                <View className="flex-row items-center justify-between pr-12 mt-4 h-10">
                  <UiText className="flex-1 text-sm font-semibold">
                    {groupAssets.length} items
                  </UiText>
                  <Pressable
                    onPress={() => {
                      if (allSelected) {
                        galleryRef.current?.setSelected(
                          selectedAssets.filter((s) => !groupAssets.includes(s))
                        );
                      } else {
                        galleryRef.current?.setSelected([
                          ...new Set([...selectedAssets, ...groupAssets]),
                        ]);
                      }
                    }}
                  >
                    <UiText
                      className={twMerge(
                        'text-right text-sm font-medium',
                        allSelected ? 'color-red' : 'color-primary'
                      )}
                    >
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </UiText>
                  </Pressable>
                </View>
              );
            }}
            sectionHeaderStyle={{ height: scaleY(64) }}
            showMediaTypeIcon={false}
            style={{ flex: 1 }}
            thumbnailLongPressAction="preview"
            thumbnailOverlayComponent={thumbnailOverlayComponent}
            thumbnailPanAction="select"
            thumbnailPressAction="select"
            thumbnailStyle={{
              borderRadius: scaleX(16),
            }}
          />
        )}
        {selectedAssets.length > 0 && (
          <View
            className="absolute flex-row gap-2.5 inset-x-3 bottom-0"
            style={{ bottom: insets.bottom + scaleX(20) }}
          >
            <ButtonPrimary
              className="flex-1 bg-primary"
              disabled={selectedAssets.length === 0 || status === 'loading'}
              label={[
                'Delete',
                selectedAssets.length
                  ? `${selectedAssets.length} Photo${selectedAssets.length === 1 ? '' : 's'}`
                  : null,
              ]
                .filter(isNonNullish)
                .join(' ')}
              onPress={async () => {
                if (selectedAssets.length === 0) {
                  return;
                }
                impactAsync(ImpactFeedbackStyle.Medium);
                if (originSmartCleaner) {
                  router.back();
                } else {
                  await deleteByUri(selectedAssets);
                }
              }}
              style={{
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
              }}
            />
          </View>
        )}
      </View>
    </Page>
  );
}
