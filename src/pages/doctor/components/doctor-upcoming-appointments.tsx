import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import { useTodaysTimeBorders } from '@/hooks/use-todays-time-borders';
import NotesImage from '@/images/notes.png';
import Appointment from '@/types/appointment';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import DoctorAppointmentCard from './doctor-appointment-card';

type Props = {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
};

export default function DoctorUpcomingAppointments({
  doctorId,
  doctorName,
  doctorSpecialty,
}: Props) {
  const { todayMidnight } = useTodaysTimeBorders();

  const appointments = useStorageValue('appointments');
  const [sortedDoctorLastAppointments, setSortedDoctorLastAppointments] =
    useState<Appointment[]>([]);
  const [sortedDoctorFutureAppointments, setSortedDoctorFutureAppointments] =
    useState<Appointment[]>([]);

  useFocusEffect(
    useCallback(() => {
      const doctorAppointments = appointments.filter(
        (appointment) => appointment.doctorId === doctorId
      );
      const sortedDoctorAppointments = doctorAppointments.sort(
        (a, b) => a.date - b.date
      );
      const sortedDoctorLastAppointments: Appointment[] = [];
      const sortedDoctorFutureAppointments: Appointment[] = [];

      sortedDoctorAppointments.forEach((appointment) => {
        if (appointment.date >= todayMidnight) {
          sortedDoctorFutureAppointments.push(appointment);
        } else {
          sortedDoctorLastAppointments.push(appointment);
        }
      });

      setSortedDoctorLastAppointments(sortedDoctorLastAppointments);
      setSortedDoctorFutureAppointments(sortedDoctorFutureAppointments);
    }, [appointments])
  );

  return (
    <View className="gap-y-2">
      <UiText className="text-sm color-grayDark">Upcoming Appointments</UiText>
      <View className="rounded-xl bg-white gap-y-4 p-5">
        <View className="flex-row items-center gap-x-3">
          <Image
            source={NotesImage}
            style={{ width: scaleY(48), height: scaleY(48) }}
            contentFit="contain"
          />

          <View className="flex-1 gap-y-1">
            <UiText className="text-sm font-semibold" numberOfLines={1}>
              {doctorName}
            </UiText>
            <UiText className="text-xs text-gray" numberOfLines={1}>
              {doctorSpecialty}
            </UiText>
          </View>
        </View>
        <View className="gap-y-2">
          {sortedDoctorFutureAppointments.length > 0 ? (
            sortedDoctorFutureAppointments.map((appointment) => (
              <DoctorAppointmentCard
                key={appointment.id}
                appointmentId={appointment.id}
                appointmentDate={new Date(appointment.date)}
              />
            ))
          ) : (
            <View className="gap-y-1.5 mb-3">
              <UiText className="text-sm font-medium">
                No upcoming appointments yet
              </UiText>
              <UiText className="text-xs">
                Add an appointment and we’ll remind you in time.
              </UiText>
            </View>
          )}
          <Pressable
            className="rounded-xl bg-primary p-3"
            onPress={() =>
              router.navigate({
                pathname: '/appointments/create-appointment',
                params: {
                  doctor: doctorId,
                },
              })
            }
          >
            <UiText className="text-center text-sm font-medium text-white">
              + Add appointment
            </UiText>
          </Pressable>
          {sortedDoctorLastAppointments.length > 0 && (
            <View className="gap-y-2">
              <UiText className="text-center text-sm font-bold my-2">
                Last appointments
              </UiText>
              {sortedDoctorLastAppointments.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment.id}
                  appointmentId={appointment.id}
                  appointmentDate={new Date(appointment.date)}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
