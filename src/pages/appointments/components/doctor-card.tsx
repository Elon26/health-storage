import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import DoctorImage from '@/images/doctor.png';
import ArrowRightWhiteIcon from '@/svg/arrow-right-white.svg';
import Doctor from '@/types/doctor';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: Props) {
  return (
    <Pressable
      className="flex-row items-center justify-between rounded-xl bg-white gap-x-3 gap-y-4 p-5"
      onPress={() =>
        router.navigate({
          pathname: '/doctors/[doctor]',
          params: {
            doctor: doctor.id,
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
            {doctor?.name || 'Unknown Doctor'}
          </UiText>
          {doctor?.specialty && (
            <UiText numberOfLines={1} className="text-xs text-gray">
              {doctor.specialty}
            </UiText>
          )}
        </View>
      </View>
      <View className="items-center justify-center rounded-2xl bg-primary h-7.5 w-12">
        <ArrowRightWhiteIcon />
      </View>
    </Pressable>
  );
}
