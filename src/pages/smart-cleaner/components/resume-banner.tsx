import { scaleY } from '@kirz/nativewind-scale';
import { prettyBytes, useStorageUsage } from '@kirz/react-native-device-info';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { shadows } from '@/config/theme/shadows';
import {
  useContactsIncomplete,
  useContactsSimilarByField,
} from '@/modules/contacts-kit/react';
import {
  useAssets,
  useCleanerAlbum,
} from '@/pages/gallery-cleaner/hooks/use-cleaner-album';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

export default function ResumeBanner() {
  const { used, total } = useStorageUsage();
  const screenshotsColor = '#84EDC3';
  const blurryPhotosColor = '#FFAACF';
  const similarPhotosColor = '#D1A9FF';
  const contactsColor = '#7BD3FF';

  const { uris: screenshots, status: screenshotsStatus } =
    useCleanerAlbum('screenshots');
  const { uris: blurryPhotos, status: blurryPhotosStatus } =
    useCleanerAlbum('blurryPhotos');
  const { uris: similarPhotos, status: similarPhotosStatus } =
    useCleanerAlbum('similarPhotos');
  const { idGroups: duplicateContactsGroups, status: duplicateContactsStatus } =
    useContactsSimilarByField('any');
  const { ids: incompleteContactsGroups, status: incompleteContactsStatus } =
    useContactsIncomplete();
  const [isAnyLoading, setIsAnyLoading] = useState(true);

  useEffect(() => {
    setIsAnyLoading(
      screenshotsStatus === 'loading' ||
        blurryPhotosStatus === 'loading' ||
        similarPhotosStatus === 'loading' ||
        duplicateContactsStatus === 'loading' ||
        incompleteContactsStatus === 'loading'
    );
  }, [
    screenshotsStatus,
    blurryPhotosStatus,
    similarPhotosStatus,
    duplicateContactsStatus,
    incompleteContactsStatus,
  ]);

  const screenshotsGroups = Array.isArray(screenshots)
    ? (screenshots as (string | string[])[])
    : [];
  const screenshotsFlatUris: string[] = screenshotsGroups.flat() as string[];
  const screenshotsIds = screenshotsFlatUris.map((uri) =>
    uri.replace('ph://', '')
  );
  const screenshotsAssets = useAssets(screenshotsIds);
  const screenshotsSize = screenshotsIds.reduce(
    (acc, id) => acc + (screenshotsAssets?.[id]?.size ?? 0),
    0
  );

  const blurryPhotosGroups = Array.isArray(blurryPhotos)
    ? (blurryPhotos as (string | string[])[])
    : [];
  const blurryPhotosFlatUris: string[] = blurryPhotosGroups.flat() as string[];
  const blurryPhotosIds = blurryPhotosFlatUris.map((uri) =>
    uri.replace('ph://', '')
  );
  const blurryPhotosAssets = useAssets(blurryPhotosIds);
  const blurryPhotosSize = blurryPhotosIds.reduce(
    (acc, id) => acc + (blurryPhotosAssets?.[id]?.size ?? 0),
    0
  );

  const similarPhotosGroups = Array.isArray(similarPhotos)
    ? (similarPhotos as (string | string[])[])
    : [];
  const similarPhotosFlatUris: string[] =
    similarPhotosGroups.flat() as string[];
  const similarPhotosIds = similarPhotosFlatUris.map((uri) =>
    uri.replace('ph://', '')
  );
  const similarPhotosAssets = useAssets(similarPhotosIds);
  const similarPhotosSize = similarPhotosIds.reduce(
    (acc, id) => acc + (similarPhotosAssets?.[id]?.size ?? 0),
    0
  );

  const contactsSize =
    (duplicateContactsGroups.flat().length +
      incompleteContactsGroups.flat().length) *
    1000;

  const totalSize =
    screenshotsSize + blurryPhotosSize + similarPhotosSize + contactsSize;

  return (
    <View
      className="items-center justify-center rounded-4.5xl bg-white p-5 mb-4 h-40 w-full"
      style={shadows.sm}
    >
      {isAnyLoading ? (
        <View className="items-center justify-center h-full">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View>
          <View className="flex-row items-center gap-x-1 pr-4">
            <UiText className="text-xl font-semibold">
              {prettyBytes(used)}
            </UiText>
            <UiText className="text-sm font-medium">of</UiText>
            <UiText className="text-xl font-semibold">
              {prettyBytes(total)}
            </UiText>
          </View>
          <View className="flex-row gap-x-0.5 mr-1 mb-2.5 mt-3.5">
            {[
              {
                size: (screenshotsSize / totalSize) * 100,
                color: screenshotsColor,
              },
              {
                size: (similarPhotosSize / totalSize) * 100,
                color: similarPhotosColor,
              },
              {
                size: (blurryPhotosSize / totalSize) * 100,
                color: blurryPhotosColor,
              },
              { size: (contactsSize / totalSize) * 100, color: contactsColor },
            ].map((item) => (
              <View
                className="rounded-sm"
                key={uuid()}
                style={{
                  width: `${item.size}%`,
                  height: scaleY(28),
                  backgroundColor: item.color,
                }}
              />
            ))}
          </View>
          <View className="flex-row flex-wrap gap-x-3 gap-y-1">
            {[
              { name: 'Screenshots', color: screenshotsColor },
              { name: 'Similar Photos', color: similarPhotosColor },
              { name: 'Blurry Photos', color: blurryPhotosColor },
              { name: 'Contacts', color: contactsColor },
            ].map((item) => (
              <View key={item.name} className="flex-row items-center gap-x-1">
                <View
                  className="rounded-sm size-2"
                  style={{ backgroundColor: item.color }}
                />
                <UiText className="text-xs">{item.name}</UiText>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
