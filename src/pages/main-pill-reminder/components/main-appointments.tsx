import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorageValue } from '@/hooks/use-storage';
import { useTodaysTimeBorders } from '@/hooks/use-todays-time-borders';
import AppointmentCard from '@/pages/appointments/components/appointment-card';
import RightArrowIcon from '@/svg/arrow-right.svg';
import Appointment from '@/types/appointment';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export default function MainAppointments() {
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  const appointments = useStorageValue('appointments');
  const [sortedAppointments, setSortedAppointments] = useState<Appointment[]>(
    []
  );
  const { todayMidnight, tomorrowMidnight } = useTodaysTimeBorders();

  useFocusEffect(
    useCallback(() => {
      const filteredAppointments = appointments.filter((appointment) => {
        return (
          appointment.date >= todayMidnight &&
          appointment.date < tomorrowMidnight
        );
      });
      const sortedAppointments = filteredAppointments.sort(
        (a, b) => a.date - b.date
      );
      setSortedAppointments(sortedAppointments);
    }, [appointments])
  );

  return (
    <View className="gap-y-4">
      <View className="flex-row justify-between">
        <UiText className="text-xl font-semibold">My appointments</UiText>
        <Pressable
          className="flex-row items-center justify-between gap-x-1"
          onPress={() => router.navigate('/appointments')}
        >
          <UiText className="font-semibold">See all</UiText>
          <RightArrowIcon />
        </Pressable>
      </View>
      {sortedAppointments.length > 0 ? (
        sortedAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))
      ) : (
        <View className="rounded-xl bg-white p-5">
          <UiText className="text-sm font-medium mb-1.5">
            No appointments for today
          </UiText>
          <UiText className="text-xs mb-5">
            Add an appointment and we’ll remind you in time.
          </UiText>
          <Pressable
            className="rounded-xl bg-primary p-3"
            onPress={() =>
              hasPremium
                ? router.navigate('/appointments/create-appointment')
                : showPaywall()
            }
          >
            <UiText className="text-center text-sm font-medium text-white">
              + Add appointment
            </UiText>
          </Pressable>
        </View>
      )}
    </View>
  );
}
