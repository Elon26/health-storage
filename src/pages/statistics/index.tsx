import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { americanWeekdays } from '@/config/constants/default-schedule-item';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorageValue } from '@/hooks/use-storage';
import { useTodaysTimeBorders } from '@/hooks/use-todays-time-borders';
import FakeStatImage from '@/images/fake-stat.png';
import Medication from '@/types/medication';
import ThisWeekWithTime from '@/types/this-week-with-time';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiText } from '@/ui/ui-text';

import MedicationsStatisticCard from './components/medication-statistic-card';

const dayTimestamp = 24 * 60 * 60 * 1000;

export default function StatisticsPage() {
  const { showPaywall } = usePaywall();
  const { todayMidnight, tomorrowMidnight } = useTodaysTimeBorders();
  const hasPremium = useHasPremiumWithBackdoor();
  const medications = useStorageValue('medications');
  const insets = useSafeAreaInsets();

  const currentMedications: Medication[] = [];

  medications.forEach((medication) => {
    const schedule = medication.schedule;
    const lastTimestamp = schedule[schedule.length - 1].timestamp;

    if (lastTimestamp >= todayMidnight) {
      currentMedications.push(medication);
    }
  });

  const todayWeekday = new Date().getDay();
  const thisWeek: string[] = [
    ...americanWeekdays.slice(todayWeekday + 1),
    ...americanWeekdays.slice(0, todayWeekday + 1),
  ];

  const thisWeekWithTimes: ThisWeekWithTime[] = [];

  for (let i = 0; i < thisWeek.length; i++) {
    thisWeekWithTimes.push({
      weekdayName: thisWeek[i],
      thisMidnight: todayMidnight - dayTimestamp * (thisWeek.length - 1 - i),
      nextMidnight: tomorrowMidnight - dayTimestamp * (thisWeek.length - 1 - i),
      schedule: [],
    });
  }

  return (
    <Page>
      <PageHeader pageName="Statistics" />
      {hasPremium ? (
        <ScrollView
          className="-mt-5 pt-5"
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 0 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
        >
          {!currentMedications.length && (
            <UiText className="text-center font-medium">
              There is no data yet
            </UiText>
          )}
          <View className="gap-y-5">
            {currentMedications.length > 0 && (
              <View className="gap-y-3">
                {currentMedications.map((medication) => (
                  <MedicationsStatisticCard
                    key={medication.id}
                    medication={medication}
                    thisWeekWithTimes={thisWeekWithTimes}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <Pressable onPress={() => showPaywall()}>
          <Image source={FakeStatImage} style={{ height: scaleY(314) }} />
        </Pressable>
      )}
    </Page>
  );
}
