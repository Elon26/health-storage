import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import emptyDefault from '@/images/empty-page.png';
import EmptyContact from '@/svg/calendar.svg';
import EmptyMedia from '@/svg/calendar.svg';
import { UiText } from '@/ui/ui-text';

type EmptyListProps = {
  text: string;
  type?: 'default' | 'media' | 'contact';
};

export function EmptyList({ text, type = 'default' }: EmptyListProps) {
  return (
    <View className="flex-1 items-center justify-center gap-y-4">
      {type === 'default' && (
        <Image
          source={emptyDefault}
          style={{ width: scaleX(167), height: scaleY(136) }}
        />
      )}
      {type === 'media' && <EmptyMedia className="size-44" />}
      {type === 'contact' && <EmptyContact className="size-44" />}
      <UiText className="text-lg font-medium text-grayDark">{text}</UiText>
    </View>
  );
}
