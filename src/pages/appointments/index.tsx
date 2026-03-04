import { scaleY } from '@kirz/nativewind-scale';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActionSheetIOS, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Empty from '@/components/empty';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorageValue } from '@/hooks/use-storage';
import { useTodaysTimeBorders } from '@/hooks/use-todays-time-borders';
import PlusIcon from '@/svg/plus.svg';
import Appointment from '@/types/appointment';
import Doctor from '@/types/doctor';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { Pressable } from '@/ui/pressable';

import UpcomingAppointments from './components/upcoming-appointments';
import YourDoctors from './components/your-doctors';

export default function AppointmentsPage() {
  const { todayMidnight } = useTodaysTimeBorders();
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();

  const insets = useSafeAreaInsets();
  const appointments = useStorageValue('appointments');
  const doctors = useStorageValue('doctors');
  const [sortedAppointments, setSortedAppointments] = useState<Appointment[]>(
    []
  );
  const [sortedDoctors, setSortedDoctors] = useState<Doctor[]>([]);

  useFocusEffect(
    useCallback(() => {
      const filteredAppointments = appointments.filter((appointment) => {
        return appointment.date >= todayMidnight;
      });
      const sortedAppointments = filteredAppointments.sort(
        (a, b) => a.date - b.date
      );
      setSortedAppointments(sortedAppointments);
    }, [appointments])
  );

  useFocusEffect(
    useCallback(() => {
      if (!doctors) return;

      const sortedDoctorsToSet = [...doctors].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      setSortedDoctors(sortedDoctorsToSet);
    }, [doctors])
  );

  function handleAddAppointments() {
    if (hasPremium) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Add appointment', 'Add doctor', 'Cancel'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            router.navigate('/appointments/create-appointment');
          } else if (buttonIndex === 1) {
            router.navigate('/doctors/create-doctor');
          }
        }
      );
    } else {
      showPaywall();
    }
  }

  return (
    <Page>
      <PageHeader pageName="Appointments">
        <Pressable
          className="items-center justify-center rounded-xl bg-primary size-10"
          onPress={handleAddAppointments}
        >
          <PlusIcon />
        </Pressable>
      </PageHeader>
      {sortedAppointments.length === 0 && doctors.length === 0 ? (
        <Empty />
      ) : (
        <ScrollView
          className="-mt-5 pt-5"
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 0 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
        >
          <View className="gap-y-5">
            {sortedAppointments.length > 0 && (
              <UpcomingAppointments sortedAppointments={sortedAppointments} />
            )}
            {sortedDoctors.length > 0 && (
              <YourDoctors sortedDoctors={sortedDoctors} />
            )}
          </View>
        </ScrollView>
      )}
    </Page>
  );
}
