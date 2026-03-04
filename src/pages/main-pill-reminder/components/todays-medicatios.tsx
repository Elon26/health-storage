import { useEffect } from 'react';
import { View } from 'react-native';

import { useSetStorage } from '@/hooks/use-storage';
import { useTodaysTimeBorders } from '@/hooks/use-todays-time-borders';
import EveningIcon from '@/svg/evening.svg';
import MorningIcon from '@/svg/morning.svg';
import NoonIcon from '@/svg/noon.svg';
import SpecificTimeMedication from '@/types/specific-time-medication';
import { UiText } from '@/ui/ui-text';

import MedicationItem from './medication-item';

type Props = {
  todaysMedications: SpecificTimeMedication[];
  changeSpecificTimeMedicationIsTakenStatus: (
    parentId: string,
    timeItemId: string,
    newIsTakenStatus: boolean | null,
    oldIsTakenStatus: boolean | null
  ) => void;
};

export default function TodaysMedications({
  todaysMedications,
  changeSpecificTimeMedicationIsTakenStatus,
}: Props) {
  const setTodaysProgress = useSetStorage('todaysProgress');
  const { todayNoon, todayEvening } = useTodaysTimeBorders();

  const morningMedications: SpecificTimeMedication[] = [];
  const afternoonMedications: SpecificTimeMedication[] = [];
  const eveningMedications: SpecificTimeMedication[] = [];

  let completedMedicationsCounter = 0;
  todaysMedications.forEach((medication) => {
    if (medication.schedule.isTaken) {
      completedMedicationsCounter++;
    }

    if (medication.schedule.timestamp < todayNoon)
      morningMedications.push(medication);
    if (
      medication.schedule.timestamp >= todayNoon &&
      medication.schedule.timestamp < todayEvening
    )
      afternoonMedications.push(medication);
    if (medication.schedule.timestamp >= todayEvening)
      eveningMedications.push(medication);
  });

  useEffect(() => {
    if (todaysMedications.length) {
      setTodaysProgress(
        (completedMedicationsCounter / todaysMedications.length) * 100
      );
    }
  }, [todaysMedications]);

  return (
    <View className="gap-y-4">
      {morningMedications.length > 0 && (
        <View className="gap-y-2">
          <View className="flex-row items-center gap-x-1">
            <MorningIcon />
            <UiText className="text-sm text-grayDark">Morning</UiText>
          </View>
          <View className="gap-y-2">
            {morningMedications.map((medication) => (
              <MedicationItem
                key={medication.id}
                medication={medication}
                changeSpecificTimeMedicationIsTakenStatus={
                  changeSpecificTimeMedicationIsTakenStatus
                }
              />
            ))}
          </View>
        </View>
      )}
      {afternoonMedications.length > 0 && (
        <View className="gap-y-2">
          <View className="flex-row items-center gap-x-1">
            <NoonIcon width={16} height={16} />
            <UiText className="text-sm text-grayDark">Afternoon</UiText>
          </View>
          <View className="gap-y-2">
            {afternoonMedications.map((medication) => (
              <MedicationItem
                key={medication.id}
                medication={medication}
                changeSpecificTimeMedicationIsTakenStatus={
                  changeSpecificTimeMedicationIsTakenStatus
                }
              />
            ))}
          </View>
        </View>
      )}
      {eveningMedications.length > 0 && (
        <View className="gap-y-2">
          <View className="flex-row items-center gap-x-1">
            <EveningIcon />
            <UiText className="text-sm text-grayDark">Evening</UiText>
          </View>
          <View className="gap-y-2">
            {eveningMedications.map((medication) => (
              <MedicationItem
                key={medication.id}
                medication={medication}
                changeSpecificTimeMedicationIsTakenStatus={
                  changeSpecificTimeMedicationIsTakenStatus
                }
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
