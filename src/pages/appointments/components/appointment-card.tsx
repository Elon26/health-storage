import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import NotesImage from '@/images/notes.png';
import ArrowRightWhiteIcon from '@/svg/arrow-right-white.svg';
import Appointment from '@/types/appointment';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { isToday, isTomorrow } from '@/utils/date-compare';

type Props = {
  appointment: Appointment;
};

export default function AppointmentCard({ appointment }: Props) {
  const doctors = useStorageValue('doctors');
  const doctor = doctors.find((doctor) => doctor.id === appointment.doctorId);
  const appointmentDate = new Date(appointment.date);

  return (
    <Pressable
      className="rounded-xl bg-white gap-y-4 p-5"
      onPress={() =>
        router.navigate({
          pathname: '/appointments/[appointment]',
          params: {
            appointment: appointment.id,
          },
        })
      }
    >
      <View className="flex-row items-center justify-between gap-x-3">
        <View className="flex-1 flex-row items-center gap-x-3">
          <Image
            source={NotesImage}
            style={{ width: scaleY(48), height: scaleY(48) }}
            contentFit="contain"
          />
          {doctor?.name ? (
            <View className="flex-1 gap-y-1">
              <UiText numberOfLines={1} className="text-sm font-semibold">
                {doctor.name}
              </UiText>
              <UiText numberOfLines={1} className="text-xs text-gray">
                {appointment.title}
              </UiText>
            </View>
          ) : (
            <UiText numberOfLines={1} className="flex-1 text-sm font-semibold">
              {appointment.title}
            </UiText>
          )}
        </View>
        <View className="items-center justify-center rounded-2xl bg-primary h-7.5 w-12">
          <ArrowRightWhiteIcon />
        </View>
      </View>
      <View className="rounded-xl bg-primary/20 p-3">
        <UiText className="text-center text-sm font-medium">
          {`${isToday(appointmentDate) === true ? 'Today, ' : ''}`}
          {`${isTomorrow(appointmentDate) === true ? 'Tomorrow, ' : ''}`}
          {appointmentDate.toLocaleString('en-EN', {
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </UiText>
      </View>
    </Pressable>
  );
}
