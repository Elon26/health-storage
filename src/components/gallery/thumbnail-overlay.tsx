import type { ThumbnailOverlayComponentProps } from 'expo-simple-gallery';
import { View } from 'react-native';

import { Checkbox } from '@/ui/checkbox';
import { UiText } from '@/ui/ui-text';

export function ThumbnailOverlayComponent({
  selected,
}: ThumbnailOverlayComponentProps) {
  return (
    <Checkbox
      checked={selected}
      className="pointer-events-none absolute m-4 right-1 bottom-1"
    />
  );
}

export function ThumbnailOverlayComponentWithBestLabel({
  selected,
  bestIndexes,
  index,
}: ThumbnailOverlayComponentProps & { bestIndexes: Set<number> }) {
  const isBest = bestIndexes.has(index);
  return (
    <>
      <Checkbox
        checked={selected}
        className="pointer-events-none absolute m-4 right-1 bottom-1"
      />
      {isBest && (
        <View className="absolute rounded-xl bg-primary left-2 px-2 top-2 py-1 w-auto">
          <UiText className="text-xs font-medium text-white">Best</UiText>
        </View>
      )}
    </>
  );
}
