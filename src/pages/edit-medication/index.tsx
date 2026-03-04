import { Env } from '@kirz/expo-env';
import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { defaultScheduleItem } from '@/config/constants/default-schedule-item';
import medicalUnitIcons from '@/config/constants/medical-unit-icons';
import medicalUnits from '@/config/constants/medical-units';
import {
  cancelNotification,
  schedulePushNotification,
} from '@/hooks/use-notifications';
import { useStorage } from '@/hooks/use-storage';
import MedicalUnit from '@/types/medical-unit';
import MedicalUnitIcon from '@/types/medical-unit-icon';
import ReminderScheduleItem from '@/types/reminder-schedule-item';
import { Schedule } from '@/types/schedule';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

import { ReminderTimeArea } from '../create-medication/components/reminder-time-area';
import SelectDateItem from '../create-medication/components/select-date-item';
import StockTrackingArea from '../create-medication/components/stock-tracking-area';
import ChangeDoseArea from './components/change-dose-area';
import ChangeIconArea from './components/change-icon-area';
import ChangeNameArea from './components/change-name-area';
import ChangeUnitArea from './components/change-unit-area';
import { changeSchedule } from './utils/change-schedule';

type Props = {
  medicationId: string | string[];
};

export default function EditMedicationPage({ medicationId }: Props) {
  const insets = useSafeAreaInsets();

  const [medications, setMedications] = useStorage('medications');
  const medication = medications.find(
    (medication) => medication.id === medicationId
  );
  const originIcon = medicalUnitIcons.find(
    (icon) => icon.name === medication?.icon
  );
  const originMedicalUnit = medicalUnits.find(
    (unit) => unit.name === medication?.unit
  );

  const [medicationIcon, setMedicationIcon] = useState<MedicalUnitIcon>(
    originIcon?.name || MedicalUnitIcon.capsule
  );
  const [medicationName, setMedicationName] = useState(medication?.name || '');
  const [medicationDose, setMedicationDose] = useState(medication?.dose || 0);
  const [medicationUnit, setMedicationUnit] = useState<MedicalUnit>(
    originMedicalUnit?.name || MedicalUnit.capsule
  );
  const [currentScheduleItem, setCurrentScheduleItem] = useState<Schedule>(
    medication?.scheduleData || JSON.parse(JSON.stringify(defaultScheduleItem))
  );
  const [
    currentStockTrackingActiveStatus,
    setCurrentStockTrackingActiveStatus,
  ] = useState(medication?.isStockTrackingActive || false);
  const [currentStock, setCurrentStock] = useState(
    medication?.currentStock || 0
  );
  const [currentReminderStockLimit, setCurrentReminderStockLimit] = useState(
    medication?.reminderStockLimit || 0
  );

  function updateSchedule(updatedSchedule: Schedule) {
    setCurrentScheduleItem(updatedSchedule);
  }

  function handleSetDate(newDate: Date, type: 'Start' | 'End') {
    const updatedSchedule = { ...currentScheduleItem };
    const newDateWithoutTime = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );

    if (type === 'Start') {
      const endDateForHandle = new Date(updatedSchedule.endDate);
      const endDateWithoutTime = new Date(
        endDateForHandle.getFullYear(),
        endDateForHandle.getMonth(),
        endDateForHandle.getDate()
      );
      if (newDateWithoutTime > endDateWithoutTime) {
        Alert.alert(
          'Wrong date',
          'The start date should be before the end date'
        );
        return;
      } else {
        updatedSchedule.startDate = newDate;
      }
    }

    if (type === 'End') {
      const startDateForHandle = new Date(updatedSchedule.startDate);
      const startDateWithoutTime = new Date(
        startDateForHandle.getFullYear(),
        startDateForHandle.getMonth(),
        startDateForHandle.getDate()
      );

      if (newDateWithoutTime < startDateWithoutTime) {
        Alert.alert(
          'Wrong date',
          'The end date should be after the start date'
        );
        return;
      } else {
        updatedSchedule.endDate = newDate;
      }
    }

    updateSchedule(updatedSchedule);
  }

  async function updateNotifications(schedule: ReminderScheduleItem[]) {
    const requestsToRemove = schedule.map((scheduleItem) =>
      scheduleItem.timestamp > Date.now() && scheduleItem.notificationId
        ? cancelNotification(scheduleItem.notificationId)
        : new Promise((resolve) => {
            resolve(null);
          })
    );
    const requestsToSet = schedule.map((scheduleItem) =>
      scheduleItem.timestamp > Date.now()
        ? schedulePushNotification(
            'Time to take care of your health',
            `Take ${medicationName} and mark it in the ${Env.APP_NAME} app.`,
            new Date(scheduleItem.timestamp)
          )
        : new Promise((resolve) => {
            resolve(null);
          })
    );

    await Promise.all(requestsToRemove);
    const responses = await Promise.all(requestsToSet);

    const updatedSchedule = schedule.map((item, index) => {
      item.notificationId = responses[index] as string | null;
      return item;
    });

    return updatedSchedule;
  }

  async function handleSave() {
    if (!medicationName) {
      Alert.alert('Missing information', 'Please enter Medication Name');
      return;
    }

    const currentMedication =
      medications.find((medication) => medication.id === medicationId) ||
      medications[0];
    const updatedMedication = { ...currentMedication };

    const medicationSchedule = changeSchedule(
      currentScheduleItem,
      updatedMedication.schedule
    );

    const medicationScheduleWithUpdatedNotifications =
      await updateNotifications(medicationSchedule);

    updatedMedication.icon = medicationIcon;
    updatedMedication.name = medicationName;
    updatedMedication.dose = medicationDose;
    updatedMedication.unit = medicationUnit;
    updatedMedication.schedule = medicationScheduleWithUpdatedNotifications;
    updatedMedication.scheduleData = currentScheduleItem;
    updatedMedication.isStockTrackingActive = currentStockTrackingActiveStatus;
    updatedMedication.currentStock = currentStock;
    updatedMedication.reminderStockLimit = currentReminderStockLimit;

    setMedications(() => {
      const updatedArr = medications.map((oldMedication) => {
        return oldMedication.id === medicationId
          ? updatedMedication
          : oldMedication;
      });
      return updatedArr;
    });

    router.back();
  }

  return (
    <Page>
      <PageHeader pageName="Edit Medication" />
      <ScrollView
        className="-mt-2.5 pt-2.5"
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
      >
        <View className="gap-y-8">
          <View className="gap-y-3">
            <ChangeIconArea
              medicationIcon={medicationIcon}
              setMedicationIcon={setMedicationIcon}
            />
            <ChangeNameArea
              medicationName={medicationName}
              setMedicationName={setMedicationName}
            />
            <View className="flex-row gap-x-2 mx-2">
              <ChangeDoseArea
                medicationDose={medicationDose}
                setMedicationDose={setMedicationDose}
              />
              <ChangeUnitArea
                medicationUnit={medicationUnit}
                setMedicationUnit={setMedicationUnit}
              />
            </View>
          </View>
          <View className="gap-y-8">
            <ReminderTimeArea
              currentScheduleItem={currentScheduleItem}
              updateScheduleItem={updateSchedule}
            />
            <SelectDateItem
              type="Start"
              date={currentScheduleItem.startDate}
              setNewDate={handleSetDate}
            />
            <SelectDateItem
              type="End"
              date={currentScheduleItem.endDate}
              setNewDate={handleSetDate}
            />
            <StockTrackingArea
              isStockTrackingActive={currentStockTrackingActiveStatus}
              setIsStockTrackingActive={setCurrentStockTrackingActiveStatus}
              medicationUnit={medicationUnit}
              medicationDose={medicationDose}
              currentStock={currentStock}
              setCurrentStock={setCurrentStock}
              reminderStockLimit={currentReminderStockLimit}
              setReminderStockLimit={setCurrentReminderStockLimit}
            />
          </View>
          <View className="items-center">
            <UiButton onPress={handleSave}>
              <UiText className="text-white">Save</UiText>
            </UiButton>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}
