import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { prettyBytes } from '@kirz/react-native-device-info';
import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import React, { type ComponentType, useEffect } from 'react';
import {
  ActivityIndicator,
  InteractionManager,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SvgProps } from 'react-native-svg';

import { usePermissionAlert } from '@/hooks/use-permission-alert';
import BlurryIcon from '@/svg/blurry-photos.svg';
import ScreenshotsIcon from '@/svg/screenshots.svg';
import SimilarIcon from '@/svg/similar-photos.svg';
import { ChevronRight } from '@/ui/chevron';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiText } from '@/ui/ui-text';

import { useAssets, useCleanerAlbum } from './hooks/use-cleaner-album';
import {
  AlbumName,
  type GalleryCleanerAlbum,
} from './hooks/use-cleaner-album/types';

export function GalleryCleaner() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { logEvent } = useAnalytics();
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      logEvent('gallery_cleaner');
    });
  }, [logEvent]);
  usePermissionAlert(
    'ios.permission.PHOTO_LIBRARY',
    'Access to Photo Library required to clean up your photos.'
  );

  React.useEffect(() => {
    navigation.setOptions({ title: 'Photos' });
  }, [navigation]);

  const visibleAlbums: GalleryCleanerAlbum[] = [
    'screenshots',
    'similarPhotos',
    'blurryPhotos',
  ];

  return (
    <Page>
      <PageHeader pageName="Photos" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
        className="-mt-5 pt-5"
      >
        <View className="gap-y-2">
          {visibleAlbums.map((albumKey) => (
            <AlbumRow albumKey={albumKey} key={albumKey} />
          ))}
        </View>
      </ScrollView>
    </Page>
  );
}

type IconProp = ComponentType<SvgProps>;

const iconByKey: Record<
  'screenshots' | 'similarPhotos' | 'blurryPhotos',
  IconProp
> = {
  screenshots: ScreenshotsIcon,
  similarPhotos: SimilarIcon,
  blurryPhotos: BlurryIcon,
};

function AlbumRow({ albumKey }: { albumKey: GalleryCleanerAlbum }) {
  const { uris, status } = useCleanerAlbum(albumKey);
  const groups = Array.isArray(uris) ? (uris as (string | string[])[]) : [];
  const flatUris: string[] = groups.flat() as string[];
  const Icon = iconByKey[albumKey as keyof typeof iconByKey] ?? ScreenshotsIcon;
  const ids = flatUris.map((uri) => uri.replace('ph://', ''));
  const assets = useAssets(ids);
  const size = ids.reduce((acc, id) => acc + (assets?.[id]?.size ?? 0), 0);

  return (
    <Pressable
      className="rounded-2xl bg-white gap-3 p-5"
      onPress={() =>
        router.navigate({
          pathname: '/gallery-cleaner-folder',
          params: { folder: albumKey },
        })
      }
    >
      <View className="flex-row items-center justify-between gap-3">
        <Icon className="size-6" />
        <View className="gap-1">
          <UiText className="font-medium">{AlbumName[albumKey]}</UiText>
          <View className="flex-row items-center">
            {status === 'loading' ? (
              <ActivityIndicator size="small" />
            ) : (
              <UiText className="text-xs text-grayDark">
                {flatUris.length}
              </UiText>
            )}
            <UiText className="text-xs text-grayDark">
              {' '}
              photo{flatUris.length !== 1 ? 's' : ''}
            </UiText>
          </View>
        </View>
        <View className="flex-1" />
        <View className="flex-row items-center justify-center rounded-2xl bg-primary gap-x-1 h-8 w-20">
          {status === 'loading' ? (
            <ActivityIndicator size="small" />
          ) : (
            <UiText className="text-xs font-medium text-white">
              {prettyBytes(size)}
            </UiText>
          )}
          <ChevronRight />
        </View>
      </View>

      {flatUris.length > 0 && (
        <View className="flex-row overflow-hidden gap-2">
          {flatUris.slice(0, 3).map((uri) => (
            <View key={uri} className="overflow-hidden rounded-2xl">
              <Image
                contentFit="cover"
                source={{ uri }}
                style={{ width: scaleX(106), height: scaleX(106) }}
              />
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}
