import { scaleY } from '@kirz/nativewind-scale';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStorageValue } from '@/hooks/use-storage';
import { useTodaysTimeBorders } from '@/hooks/use-todays-time-borders';
import Medication from '@/types/medication';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiText } from '@/ui/ui-text';

import MedicationsCard from './components/medication-card';

export default function MedicationsPage() {
  const { todayMidnight } = useTodaysTimeBorders();
  const medications = useStorageValue('medications');
  const insets = useSafeAreaInsets();

  const currentMedications: Medication[] = [];
  const finishedMedications: Medication[] = [];

  medications.forEach((medication) => {
    const schedule = medication.schedule;
    const lastTimestamp = schedule[schedule.length - 1].timestamp;

    if (lastTimestamp < todayMidnight) {
      finishedMedications.push(medication);
    } else {
      currentMedications.push(medication);
    }
  });

  return (
    <Page>
      <PageHeader pageName="All Medications" />
      <ScrollView
        className="-mt-5 pt-5"
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
      >
        <View className="gap-y-5">
          {!currentMedications.length && !finishedMedications.length && (
            <UiText className="text-center font-medium">
              There are no medications yet
            </UiText>
          )}
          {currentMedications.length > 0 && (
            <View className="gap-y-2">
              <UiText className="font-medium text-grayDark">
                Current Medications
              </UiText>
              <View className="gap-y-2">
                {currentMedications.map((medication) => (
                  <MedicationsCard
                    key={medication.id}
                    medication={medication}
                  />
                ))}
              </View>
            </View>
          )}
          {finishedMedications.length > 0 && (
            <View className="gap-y-2">
              <UiText className="font-medium text-grayDark">
                Finished Medications
              </UiText>
              <View className="gap-y-2">
                {finishedMedications.map((medication) => (
                  <MedicationsCard
                    key={medication.id}
                    medication={medication}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </Page>
  );
}
