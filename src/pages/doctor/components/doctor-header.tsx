import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import DoctorImage from '@/images/doctor.png';
import { UiText } from '@/ui/ui-text';

type Props = {
  doctorName: string;
  doctorSpecialty: string;
};

export default function DoctorHeader({ doctorName, doctorSpecialty }: Props) {
  return (
    <View className="flex-row items-center gap-x-3 px-5">
      <Image
        source={DoctorImage}
        style={{ width: scaleY(48), height: scaleY(48) }}
        contentFit="contain"
      />
      <View className="flex-1 gap-y-1">
        <UiText className="text-sm font-semibold">{doctorName}</UiText>
        <UiText className="text-xs text-gray">{doctorSpecialty}</UiText>
      </View>
    </View>
  );
}
