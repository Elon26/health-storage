import { Env } from '@kirz/expo-env';
import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { schedulePushNotification } from '@/hooks/use-notifications';
import { useSetStorage } from '@/hooks/use-storage';
import Appointment from '@/types/appointment';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import AppointmentTitleArea from './components/appointment-title-area';
import DateSelector from './components/date-selector';
import DoctorSelector from './components/doctor-selector';
import NoteTextArea from './components/note-text-area';
import TimeSelector from './components/time-selector';

type Props = {
  doctorId: string | string[] | undefined;
};

export default function CreateAppointmentPage({ doctorId }: Props) {
  const insets = useSafeAreaInsets();
  const setAppointments = useSetStorage('appointments');

  const today = new Date();
  const todayMorning = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    8
  );

  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    (doctorId as string) || ''
  );
  const [selectedDate, setSelectedDate] = useState<number>(
    todayMorning.getTime()
  );
  const [note, setNote] = useState('');

  async function saveAppointment() {
    if (title) {
      const newAppointment: Appointment = {
        id: uuid(),
        title,
        doctorId: selectedDoctorId,
        date: selectedDate,
        note,
        hourNotificationId: null,
        dayNotificationId: null,
      };

      const hourNotificationTimestamp = selectedDate - 60 * 60 * 1000;
      const dayNotificationTimestamp = selectedDate - 24 * 60 * 60 * 1000;

      if (hourNotificationTimestamp > Date.now()) {
        newAppointment.hourNotificationId = await schedulePushNotification(
          `${title} at ${new Date(selectedDate).toLocaleTimeString('en-EN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          })} today.`,
          `Don’t forget to mark your visit in the ${Env.APP_NAME} app after the appointment.`,
          new Date(hourNotificationTimestamp)
        );

        if (dayNotificationTimestamp > Date.now()) {
          newAppointment.dayNotificationId = await schedulePushNotification(
            `${title} at ${new Date(selectedDate).toLocaleTimeString('en-EN', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })} tomorrow.`,
            `Don’t forget to mark your visit in the ${Env.APP_NAME} app after the appointment.`,
            new Date(dayNotificationTimestamp)
          );
        }
      }

      setAppointments((prev) => {
        prev.push(newAppointment);
        return prev;
      });

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
        <PageHeader pageName="Add Appointment" />
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
