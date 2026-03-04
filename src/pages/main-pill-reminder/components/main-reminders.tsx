import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';

import { useStorage } from '@/hooks/use-storage';
import { useTodaysTimeBorders } from '@/hooks/use-todays-time-borders';
import RestoreReminderItem from '@/types/notification-reminder-item';
import SpecificTimeMedication from '@/types/specific-time-medication';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import { getTodaysMedications } from '../utils/get-todays-medications';
import TodaysMedications from './todays-medicatios';

export default function MainReminders() {
  const [restoreReminder, setRestoreReminder] = useStorage('restoreReminder');

  const { todayMidnight, tomorrowMidnight } = useTodaysTimeBorders();
  const [medications, setMedications] = useStorage('medications');
  const [todaysMedications, setTodaysMedications] = useState<
    SpecificTimeMedication[]
  >(getTodaysMedications(medications, todayMidnight, tomorrowMidnight));

  useFocusEffect(
    useCallback(() => {
      setTodaysMedications(
        getTodaysMedications(medications, todayMidnight, tomorrowMidnight)
      );
    }, [medications, todayMidnight, tomorrowMidnight])
  );

  function changeSpecificTimeMedicationIsTakenStatus(
    parentId: string,
    timeItemId: string,
    newIsTakenStatus: boolean | null,
    oldIsTakenStatus: boolean | null
  ) {
    const updatedMedication = [...medications].find(
      (item) => item.id === parentId
    );

    if (updatedMedication) {
      const updatedMedicationSchedule = [...updatedMedication.schedule].map(
        (scheduleItem) => {
          if (scheduleItem.id === timeItemId) {
            scheduleItem.isTaken = newIsTakenStatus;
          }
          return scheduleItem;
        }
      );

      updatedMedication.schedule = updatedMedicationSchedule;

      if (newIsTakenStatus) {
        updatedMedication.currentStock -= updatedMedication.dose;
        if (updatedMedication.currentStock < 0) {
          updatedMedication.currentStock = 0;
        }

        if (
          updatedMedication.isStockTrackingActive &&
          updatedMedication.currentStock <= updatedMedication.reminderStockLimit
        ) {
          const restoreReminderItem = restoreReminder.find(
            (item) => item.id === updatedMedication.id
          );

          if (restoreReminderItem) {
            if (Date.now() > restoreReminderItem.timestamp + 60 * 60 * 1000) {
              restoreReminderItem.timestamp = Date.now();
              const updatedRestoreReminder = restoreReminder.map((item) => {
                return item.id === updatedMedication.id
                  ? restoreReminderItem
                  : item;
              });
              setRestoreReminder(updatedRestoreReminder);
              Alert.alert(
                'Restock needed',
                `${updatedMedication.name} — ${updatedMedication.currentStock !== 0 ? 'only' : ''} ${updatedMedication.currentStock} ${updatedMedication.unit}${updatedMedication.currentStock !== 1 ? 's' : ''} left.`
              );
            }
          } else {
            const newRestoreReminder: RestoreReminderItem = {
              id: updatedMedication.id,
              timestamp: Date.now(),
            };
            const updatedRestoreReminder = [...restoreReminder];
            updatedRestoreReminder.push(newRestoreReminder);
            setRestoreReminder(updatedRestoreReminder);
            Alert.alert(
              'Restock needed',
              `${updatedMedication.name} — ${updatedMedication.currentStock !== 0 ? 'only' : ''} ${updatedMedication.currentStock} ${updatedMedication.unit}${updatedMedication.currentStock !== 1 ? 's' : ''} left.`
            );
          }
        }
      }

      if (oldIsTakenStatus) {
        updatedMedication.currentStock += updatedMedication.dose;
      }

      const updatedMedications = [...medications].map((medication) =>
        medication.id === parentId ? updatedMedication : medication
      );
      setMedications(updatedMedications);
    }
  }

  return (
    <View className="gap-y-4">
      <View className="flex-row items-center justify-between">
        <UiText className="text-xl font-semibold">My reminders</UiText>
        {todaysMedications.length > 0 && (
          <Pressable
            className="rounded-3xl bg-primary px-3 py-2"
            onPress={() => router.navigate('/medications/create-medication')}
          >
            <UiText className="font-medium text-white">+ add</UiText>
          </Pressable>
        )}
      </View>
      {todaysMedications.length > 0 ? (
        <TodaysMedications
          todaysMedications={todaysMedications}
          changeSpecificTimeMedicationIsTakenStatus={
            changeSpecificTimeMedicationIsTakenStatus
          }
        />
      ) : (
        <View className="rounded-xl bg-white p-5">
          <UiText className="text-sm font-medium mb-1.5">
            No medication reminders for today
          </UiText>
          <UiText className="text-xs mb-5">
            Add a reminder and we’ll help you stay on schedule.
          </UiText>
          <Pressable
            className="rounded-xl bg-primary p-3"
            onPress={() => router.navigate('/medications/create-medication')}
          >
            <UiText className="text-center text-sm font-medium text-white">
              + Add reminder
            </UiText>
          </Pressable>
        </View>
      )}
    </View>
  );
}
