import { Dispatch, SetStateAction } from 'react';
import { ScrollView, View } from 'react-native';

import MedicalUnit from '@/types/medical-unit';
import { Schedule } from '@/types/schedule';

import { ReminderResumeArea } from './reminder-resume-area';
import StockTrackingArea from './stock-tracking-area';

type Props = {
  selectedIcon: string;
  medicationName: string;
  medicationDose: number;
  medicationUnit: MedicalUnit;
  currentScheduleItem: Schedule;
  note: string;
  setNote: Dispatch<SetStateAction<string>>;
  isStockTrackingActive: boolean;
  setIsStockTrackingActive: Dispatch<SetStateAction<boolean>>;
  currentStock: number;
  setCurrentStock: Dispatch<SetStateAction<number>>;
  reminderStockLimit: number;
  setReminderStockLimit: Dispatch<SetStateAction<number>>;
};

export function ReminderThirdScreen({
  selectedIcon,
  medicationName,
  medicationDose,
  medicationUnit,
  currentScheduleItem,
  note,
  setNote,
  isStockTrackingActive,
  setIsStockTrackingActive,
  currentStock,
  setCurrentStock,
  reminderStockLimit,
  setReminderStockLimit,
}: Props) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="gap-y-6 mr-10">
        <ReminderResumeArea
          selectedIcon={selectedIcon}
          medicationName={medicationName}
          medicationDose={medicationDose}
          medicationUnit={medicationUnit}
          currentScheduleItem={currentScheduleItem}
          note={note}
          setNote={setNote}
        />
        <StockTrackingArea
          isStockTrackingActive={isStockTrackingActive}
          setIsStockTrackingActive={setIsStockTrackingActive}
          medicationUnit={medicationUnit}
          medicationDose={medicationDose}
          currentStock={currentStock}
          setCurrentStock={setCurrentStock}
          reminderStockLimit={reminderStockLimit}
          setReminderStockLimit={setReminderStockLimit}
        />
      </View>
    </ScrollView>
  );
}
