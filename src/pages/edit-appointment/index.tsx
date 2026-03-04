import { Env } from '@kirz/expo-env';
import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  cancelNotification,
  schedulePushNotification,
} from '@/hooks/use-notifications';
import { useStorage } from '@/hooks/use-storage';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

import AppointmentTitleArea from '../create-appointment/components/appointment-title-area';
import DateSelector from '../create-appointment/components/date-selector';
import DoctorSelector from '../create-appointment/components/doctor-selector';
import NoteTextArea from '../create-appointment/components/note-text-area';
import TimeSelector from '../create-appointment/components/time-selector';

type Props = {
  appointmentId: string | string[];
};

export default function EditAppointmentPage({ appointmentId }: Props) {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useStorage('appointments');

  const appointment = appointments.find(
    (appointment) => appointment.id === appointmentId
  );

  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
  const [title, setTitle] = useState(appointment?.title || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    appointment?.doctorId || ''
  );
  const [selectedDate, setSelectedDate] = useState<number>(
    appointment?.date || 0
  );
  const [note, setNote] = useState(appointment?.note || '');

  async function saveAppointment() {
    if (title && appointment) {
      const updatedAppointment = { ...appointment };
      updatedAppointment.title = title;
      updatedAppointment.doctorId = selectedDoctorId;
      updatedAppointment.date = selectedDate;
      updatedAppointment.note = note;

      if (selectedDate !== appointment.date) {
        if (updatedAppointment.dayNotificationId) {
          await cancelNotification(updatedAppointment.dayNotificationId);
          updatedAppointment.dayNotificationId = null;
        }

        if (updatedAppointment.hourNotificationId) {
          await cancelNotification(updatedAppointment.hourNotificationId);
          updatedAppointment.hourNotificationId = null;
        }

        const hourNotificationTimestamp = selectedDate - 60 * 60 * 1000;
        const dayNotificationTimestamp = selectedDate - 24 * 60 * 60 * 1000;

        if (hourNotificationTimestamp > Date.now()) {
          updatedAppointment.hourNotificationId =
            await schedulePushNotification(
              `${title} at ${new Date(selectedDate).toLocaleTimeString(
                'en-EN',
                {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )} today.`,
              `Don’t forget to mark your visit in the ${Env.APP_NAME} app after the appointment.`,
              new Date(hourNotificationTimestamp)
            );

          if (dayNotificationTimestamp > Date.now()) {
            updatedAppointment.dayNotificationId =
              await schedulePushNotification(
                `${title} at ${new Date(selectedDate).toLocaleTimeString(
                  'en-EN',
                  {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )} tomorrow.`,
                `Don’t forget to mark your visit in the ${Env.APP_NAME} app after the appointment.`,
                new Date(dayNotificationTimestamp)
              );
          }
        }
      }

      const updatedAppointments = [...appointments].map((appointment) => {
        return appointment.id === appointmentId
          ? updatedAppointment
          : appointment;
      });

      setAppointments(updatedAppointments);

      router.back();
    } else {
      Alert.alert('Missing information', 'Please enter Appointment Title');
    }
  }

  function toggleDoctorDropdown() {
    setIsDoctorDropdownOpen((prev) => !prev);
  }

  function selectDoctor(doctorId: string) {
    setSelectedDoctorId(doctorId);
    setIsDoctorDropdownOpen(false);
  }

  function selectDate(date: Date) {
    setSelectedDate(date.getTime());
  }

  function selectTime(date: Date) {
    setSelectedDate(date.getTime());
  }

  return (
    <Page>
      <Pressable
        onPress={() => {
          setIsDoctorDropdownOpen(false);
        }}
        className="flex-1 pb-4"
      >
        <PageHeader pageName="Edit Appointment" />
        <ScrollView
          className="-mt-5 pt-5"
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 0 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
        >
          <View className="flex-1 justify-between">
            <View className="gap-y-3">
              <AppointmentTitleArea title={title} setTitle={setTitle} />
              <DoctorSelector
                selectedDoctorId={selectedDoctorId}
                isDropdownOpen={isDoctorDropdownOpen}
                toggleDropdown={toggleDoctorDropdown}
                selectDoctor={selectDoctor}
              />

              <DateSelector
                selectedDate={selectedDate}
                selectDate={selectDate}
              />
              <TimeSelector
                selectedDate={selectedDate}
                selectTime={selectTime}
              />
              <NoteTextArea note={note} setNote={setNote} />
            </View>
            <UiButton className="self-center mt-6" onPress={saveAppointment}>
              <UiText className="text-white">Save</UiText>
            </UiButton>
          </View>
        </ScrollView>
      </Pressable>
    </Page>
  );
}
