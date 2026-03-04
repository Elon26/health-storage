import { Env } from '@kirz/expo-env';
import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { defaultScheduleItem } from '@/config/constants/default-schedule-item';
import { schedulePushNotification } from '@/hooks/use-notifications';
import { useSetStorage } from '@/hooks/use-storage';
import MedicalUnit from '@/types/medical-unit';
import MedicalUnitIcon from '@/types/medical-unit-icon';
import Medication from '@/types/medication';
import ReminderScheduleItem from '@/types/reminder-schedule-item';
import { Schedule } from '@/types/schedule';
import { Page } from '@/ui/page';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import { ReminderFirstScreen } from './components/reminder-first-screen';
import { ReminderHeader } from './components/reminder-header';
import { ReminderProgressBar } from './components/reminder-progress-bar';
import { ReminderSecondScreen } from './components/reminder-second-screen';
import { ReminderThirdScreen } from './components/reminder-third-screen';
import { calcSchedule } from './utils/calc-schedule';

const { width } = Dimensions.get('window');

export default function CreateMedicationPage() {
  const insets = useSafeAreaInsets();
  const setMedications = useSetStorage('medications');

  const [numberOfScreen, setNumberOfScreen] = useState(1);
  const offset = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const [medicationIcon, setMedicationIcon] = useState<MedicalUnitIcon>(
    MedicalUnitIcon.capsule
  );
  const [medicationName, setMedicationName] = useState('');
  const [medicationDose, setMedicationDose] = useState(0);
  const [medicationUnit, setMedicationUnit] = useState<MedicalUnit>(
    MedicalUnit.capsule
  );
  const [currentScheduleItem, setCurrentScheduleItem] = useState<Schedule>(
    JSON.parse(JSON.stringify(defaultScheduleItem))
  );
  const [note, setNote] = useState('');
  const [isStockTrackingActive, setIsStockTrackingActive] = useState(false);
  const [currentStock, setCurrentStock] = useState(0);
  const [reminderStockLimit, setReminderStockLimit] = useState(0);

  function handleBack() {
    if (numberOfScreen === 1) {
      router.back();
    } else {
      const prevScreen = numberOfScreen - 1;
      // eslint-disable-next-line react-compiler/react-compiler
      offset.value = withTiming(-width * (prevScreen - 1), { duration: 300 });
      setNumberOfScreen(prevScreen);
    }
  }

  function handleNext() {
    if (numberOfScreen === 1 && !medicationName) {
      Alert.alert('Missing information', 'Please enter Medication Name');
      return;
    }

    const nextScreen = numberOfScreen + 1;
    offset.value = withTiming(-width * (nextScreen - 1), { duration: 300 });
    setNumberOfScreen(nextScreen);
  }

  async function createNotifications(schedule: ReminderScheduleItem[]) {
    const requests = schedule.map((scheduleItem) =>
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

    const responses = await Promise.all(requests);

    const updatedSchedule = schedule.map((item, index) => {
      item.notificationId = responses[index] as string | null;
      return item;
    });

    return updatedSchedule;
  }

  async function handleSave() {
    const medicationSchedule = calcSchedule(currentScheduleItem);
    const medicationScheduleWithNotifications =
      await createNotifications(medicationSchedule);

    const medication: Medication = {
      id: uuid(),
      icon: medicationIcon,
      name: medicationName,
      dose: medicationDose,
      unit: medicationUnit,
      schedule: medicationScheduleWithNotifications,
      note,
      scheduleData: currentScheduleItem,
      isStockTrackingActive,
      currentStock,
      reminderStockLimit,
    };

    setMedications((prev) => {
      prev.push(medication);
      return prev;
    });

    router.back();
  }

  return (
    <Page>
      <ReminderHeader
        isFirstScreen={numberOfScreen === 1}
        handleBack={handleBack}
      />
      <View
        className="flex-1 justify-between overflow-hidden gap-y-5"
        style={{ marginBottom: 0, paddingBottom: insets.bottom + scaleY(16) }}
      >
        <View className="flex-1">
          <ReminderProgressBar numberOfScreen={numberOfScreen} />

          <Animated.View
            className="flex-1"
            style={[{ flexDirection: 'row', width: width * 3 }, animatedStyle]}
          >
            <View style={{ width }}>
              <ReminderFirstScreen
                selectedIcon={medicationIcon}
                selectIcon={(icon) => setMedicationIcon(icon)}
                medicationName={medicationName}
                setMedicationName={setMedicationName}
                medicationDose={medicationDose}
                setMedicationDose={setMedicationDose}
                medicationUnit={medicationUnit}
                setMedicationUnit={setMedicationUnit}
              />
            </View>
            <View style={{ width }}>
              <ReminderSecondScreen
                currentScheduleItem={currentScheduleItem}
                setCurrentScheduleItem={setCurrentScheduleItem}
              />
            </View>
            <View style={{ width }}>
              <ReminderThirdScreen
                selectedIcon={medicationIcon}
                medicationName={medicationName}
                medicationDose={medicationDose}
                medicationUnit={medicationUnit}
                currentScheduleItem={currentScheduleItem}
                note={note}
                setNote={setNote}
                isStockTrackingActive={isStockTrackingActive}
                setIsStockTrackingActive={setIsStockTrackingActive}
                currentStock={currentStock}
                setCurrentStock={setCurrentStock}
                reminderStockLimit={reminderStockLimit}
                setReminderStockLimit={setReminderStockLimit}
              />
            </View>
          </Animated.View>
        </View>

        <View className="items-center">
          <UiButton onPress={numberOfScreen !== 3 ? handleNext : handleSave}>
            <UiText className="text-white">
              {numberOfScreen !== 3 ? 'Next' : 'Save'}
            </UiText>
          </UiButton>
        </View>
      </View>
    </Page>
  );
}
