import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import DoctorImage from '@/images/doctor.png';
import ArrowRightWhiteIcon from '@/svg/arrow-right-white.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  doctorName: string | null;
  appointmentTitle: string;
  doctorId: string | null;
};

export default function AppointmentHeader({
  doctorName,
  appointmentTitle,
  doctorId,
}: Props) {
  return (
    <View>
      {doctorName && doctorId ? (
        <Pressable
          className="flex-row items-center justify-between gap-x-3 px-5"
          onPress={() =>
            router.navigate({
              pathname: '/doctors/[doctor]',
              params: {
                doctor: doctorId,
              },
            })
          }
        >
          <View className="flex-1 flex-row items-center gap-x-3">
            <Image
              source={DoctorImage}
              style={{ width: scaleY(48), height: scaleY(48) }}
              contentFit="contain"
            />
            <View className="flex-1 gap-y-1">
              <UiText className="text-sm font-semibold" numberOfLines={1}>
                {doctorName}
              </UiText>
              <UiText className="text-xs text-gray" numberOfLines={1}>
                {appointmentTitle}
              </UiText>
            </View>
          </View>
          <View className="items-center justify-center rounded-2xl bg-primary h-7.5 w-12">
            <ArrowRightWhiteIcon />
          </View>
        </Pressable>
      ) : (
        <View className="flex-row items-center justify-between gap-x-3 px-5">
          <View className="flex-row items-center gap-x-3">
            <Image
              source={DoctorImage}
              style={{ width: scaleY(48), height: scaleY(48) }}
              contentFit="contain"
            />
            <UiText className="text-sm font-semibold">
              {appointmentTitle}
            </UiText>
          </View>
        </View>
      )}
    </View>
  );
}
