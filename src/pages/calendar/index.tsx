import { scaleY } from '@kirz/nativewind-scale';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';

import CustomCalendar from './components/custom-calendar';
import TodaysPlan from './components/todays-plan';

export default function CalendarPage() {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(new Date());

  return (
    <Page>
      <PageHeader pageName="Calendar" />
      <ScrollView
        className="-mt-5 pt-5"
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
      >
        <View className="gap-y-8">
          <CustomCalendar
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          <TodaysPlan selectedDay={selectedDay} />
        </View>
      </ScrollView>
    </Page>
  );
}
