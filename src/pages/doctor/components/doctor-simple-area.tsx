import { FunctionComponent } from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { UiText } from '@/ui/ui-text';

type Props = {
  Icon: FunctionComponent<SvgProps>;
  fieldValue: string;
};

export default function DoctorSimpleArea({ Icon, fieldValue }: Props) {
  return (
    <View className="flex-row items-center gap-x-3 px-5">
      <Icon />
      <UiText className="flex-1 text-sm">{fieldValue}</UiText>
    </View>
  );
}
