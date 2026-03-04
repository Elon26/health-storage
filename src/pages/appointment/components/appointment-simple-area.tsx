import { View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type Props = {
  fieldName: string;
  fieldValue: string;
};

export default function AppointmentSimpleArea({
  fieldName,
  fieldValue,
}: Props) {
  return (
    <View className="flex-row justify-between px-5">
      <UiText className="text-xs font-medium text-grayDark">{fieldName}</UiText>
      <UiText className="text-sm">{fieldValue}</UiText>
    </View>
  );
}
