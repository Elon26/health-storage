import Medication from '@/types/medication';
import SpecificTimeMedication from '@/types/specific-time-medication';
import { uuid } from '@/utils/uuid';

export function getTodaysMedications(
  medications: Medication[],
  todayMidnight: number,
  tomorrowMidnight: number
) {
  if (medications.length === 0) return [];

  const medicationForHandle = [...medications];
  const specificTimeMedications: SpecificTimeMedication[] = [];

  medicationForHandle.forEach((medication) => {
    medication.schedule.forEach((scheduleItem) => {
      specificTimeMedications.push({
        ...medication,
        parentId: medication.id,
        id: uuid(),
        schedule: scheduleItem,
      });
    });
  });

  const todaysMedications = [...specificTimeMedications].filter(
    (medication) => {
      return (
        medication.schedule.timestamp >= todayMidnight &&
        medication.schedule.timestamp < tomorrowMidnight
      );
    }
  );

  todaysMedications.sort((a, b) => a.schedule.timestamp - b.schedule.timestamp);

  return todaysMedications;
}
