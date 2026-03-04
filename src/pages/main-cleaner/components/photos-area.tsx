import { scaleX } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useCleanerAlbum } from '@/pages/gallery-cleaner/hooks/use-cleaner-album';
import ArrowRightWhiteIcon from '@/svg/arrow-right-white.svg';
import PhotosIcon from '@/svg/photos.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { numberInnerWrapper } from '@/utils/number-inner-wrapper';

export default function PhotosArea() {
  const [isLoading, setIsLoading] = useState(true);

  const similarPhotos = useCleanerAlbum('similarPhotos');
  const blurryPhotos = useCleanerAlbum('blurryPhotos');
  const screenshots = useCleanerAlbum('screenshots');

  const allPhoto = [];
  if (similarPhotos.uris) {
    allPhoto.push(...similarPhotos.uris.flat());
  }
  if (blurryPhotos.uris) {
    allPhoto.push(...blurryPhotos.uris.flat());
  }
  if (screenshots.uris) {
    allPhoto.push(...screenshots.uris.flat());
  }

  const quantityOfPhotos = allPhoto.length;

  const photosToShow = allPhoto.slice(0, 5);

  useEffect(() => {
    if (
      similarPhotos.status !== 'loading' &&
      blurryPhotos.status !== 'loading' &&
      screenshots.status !== 'loading'
    ) {
      setIsLoading(false);
    }
  }, [similarPhotos.status, blurryPhotos.status, screenshots.status]);

  return (
    <Pressable
      className="rounded-2xl bg-white gap-y-4 p-5"
      onPress={() => router.navigate('/gallery-cleaner')}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-3">
          <PhotosIcon />
          <View className="gap-y-1">
            <UiText className="font-semibold">Photos</UiText>
            <View className="flex-row items-center gap-x-1">
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <UiText className="text-xs text-grayDark">
                  {numberInnerWrapper(quantityOfPhotos)}
                </UiText>
              )}
              <UiText className="text-xs text-grayDark">
                item{quantityOfPhotos !== 1 && 's'}
              </UiText>
            </View>
          </View>
        </View>

        <View className="items-center justify-center rounded-2xl bg-primary h-7.5 w-12">
          <ArrowRightWhiteIcon />
        </View>
      </View>
      {photosToShow.length > 0 && (
        <View className="flex-row gap-x-1 mr-2">
          <View className="w-[50%]">
            <View className="overflow-hidden rounded-xl">
              <Image
                source={photosToShow[0]}
                style={{
                  width: scaleX(146),
                  height: scaleX(146),
                }}
                contentFit="cover"
              />
            </View>
          </View>
          <View className="w-[50%] gap-y-1">
            <View className="flex-row gap-x-1">
              <View className="w-[50%]">
                {photosToShow[1] && (
                  <View className="overflow-hidden rounded-xl">
                    <Image
                      source={photosToShow[1]}
                      style={{
                        width: scaleX(71),
                        height: scaleX(71),
                      }}
                      contentFit="cover"
                    />
                  </View>
                )}
              </View>
              <View className="w-[50%]">
                {photosToShow[2] && (
                  <View className="overflow-hidden rounded-xl">
                    <Image
                      source={photosToShow[2]}
                      style={{
                        width: scaleX(71),
                        height: scaleX(71),
                      }}
                      contentFit="cover"
                    />
                  </View>
                )}
              </View>
            </View>
            <View className="flex-row gap-x-1">
              <View className="w-[50%]">
                {photosToShow[3] && (
                  <View className="overflow-hidden rounded-xl">
                    <Image
                      source={photosToShow[3]}
                      style={{
                        width: scaleX(71),
                        height: scaleX(71),
                      }}
                      contentFit="cover"
                    />
                  </View>
                )}
              </View>
              <View className="w-[50%]">
                {photosToShow[4] && (
                  <View className="overflow-hidden rounded-xl">
                    <Image
                      source={photosToShow[4]}
                      style={{
                        width: scaleX(71),
                        height: scaleX(71),
                      }}
                      contentFit="cover"
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}
