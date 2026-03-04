import { router } from 'expo-router';
import { ActionSheetIOS, Alert, View } from 'react-native';

import { useStorage, useStorageValue } from '@/hooks/use-storage';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { Pressable } from '@/ui/pressable';
import { Separator } from '@/ui/separator';

import AppointmentBigArea from './components/appointment-big-area';
import AppointmentHeader from './components/appointment-header';
import AppointmentSimpleArea from './components/appointment-simple-area';

type Props = {
  appointmentId: string | string[];
};

export default function AppointmentPage({ appointmentId }: Props) {
  const [appointments, setAppointments] = useStorage('appointments');
  const doctors = useStorageValue('doctors');
  const appointment = appointments.find(
    (appointment) => appointment.id === appointmentId
  );
  const doctor = doctors.find((doctor) => doctor.id === appointment?.doctorId);

  function handlePress() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Edit', 'Delete', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          Alert.alert(
            'Delete this appointment?',
            'This appointment will be permanently removed from your list.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  setAppointments((prev) => {
                    return prev.filter((item) => item.id !== appointmentId);
                  });
                  router.back();
                },
              },
            ]
          );
        } else if (buttonIndex === 0) {
          router.navigate({
            pathname: '/appointments/[appointment]/edit',
            params: {
              appointment: appointmentId.toString(),
            },
          });
        }
      }
    );
  }

  return (
    <Page>
      <PageHeader pageName="Appointment details">
        <Pressable
          className="flex-row items-center justify-center rounded-xl bg-white gap-x-0.5 size-10"
          onPress={handlePress}
        >
          <View className="rounded-full bg-black size-1" />
          <View className="rounded-full bg-black size-1" />
          <View className="rounded-full bg-black size-1" />
        </Pressable>
      </PageHeader>
      <View className="rounded-xl bg-white gap-y-4 py-5">
        <AppointmentHeader
          doctorId={doctor?.id || null}
          doctorName={doctor?.name || null}
          appointmentTitle={appointment?.title || 'Unknown appointment'}
        />
        <Separator />
        <AppointmentSimpleArea
          fieldName="Date"
          fieldValue={
            appointment
              ? new Date(appointment.date).toLocaleDateString('en-EN', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Unknown date'
          }
        />
        <Separator />
        <AppointmentSimpleArea
          fieldName="Time"
          fieldValue={
            appointment
              ? new Date(appointment.date).toLocaleTimeString('en-EN', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Unknown date'
          }
        />
        <Separator />
        <AppointmentBigArea fieldValue={appointment?.note || null} />
      </View>
    </Page>
  );
}
