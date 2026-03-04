import { View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type Props = {
  fieldValue: string | null;
};

export default function AppointmentBigArea({ fieldValue }: Props) {
  return (
    <View>
      <View className="rounded-xl bg-background mx-4 p-3 h-32">
        {fieldValue ? (
          <UiText className="text-sm">{fieldValue}</UiText>
        ) : (
          <UiText className="text-sm text-grayDark">No notes added</UiText>
        )}
      </View>
    </View>
  );
}
