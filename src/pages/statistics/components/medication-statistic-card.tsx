import { scaleX } from '@kirz/nativewind-scale';
import { ActionSheetIOS, View } from 'react-native';

import medicalUnits from '@/config/constants/medical-units';
import { colors } from '@/config/theme';
import { useStorage } from '@/hooks/use-storage';
import { MedicationCheckbox } from '@/pages/main-pill-reminder/components/medication-checkbox';
import Medication from '@/types/medication';
import ThisWeekWithTime from '@/types/this-week-with-time';
import { Pressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import { generateArrayOfOrders } from '@/utils/generate-array-of-orders';
import { uuid } from '@/utils/uuid';

type Props = {
  medication: Medication;
  thisWeekWithTimes: ThisWeekWithTime[];
};

export default function MedicationsStatisticCard({
  medication,
  thisWeekWithTimes,
}: Props) {
  const [medications, setMedications] = useStorage('medications');

  const currentUnit = medicalUnits.find(
    (unit) => medication.unit === unit.name
  );

  const thisWeekMedications = thisWeekWithTimes.map((item) => {
    item.schedule = [];
    medication.schedule.forEach((scheduleItem) => {
      if (
        scheduleItem.timestamp >= item.thisMidnight &&
        scheduleItem.timestamp < item.nextMidnight
      ) {
        item.schedule.push(scheduleItem);
      }
    });
    return item;
  });

  const quantityOfTimesPerDay = Math.max(
    ...thisWeekMedications.map((item) => item.schedule.length)
  );

  const arrayOfOrders = generateArrayOfOrders(quantityOfTimesPerDay);

  function handleChangeIsTakenStatus(
    scheduleId: string,
    weekdayName: string,
    order: string
  ) {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Mark as taken', 'Mark as skipped', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        title: `Update ${medication.name} status for the ${order} dose on ${weekdayName}?`,
        message: 'Choose how to mark this intake.',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          setNewStatus(scheduleId, true);
        } else if (buttonIndex === 1) {
          setNewStatus(scheduleId, false);
        }
      }
    );
  }

  function setNewStatus(scheduleId: string, newStatus: boolean) {
    let oldStatus: boolean | null = null;
    const updatedMedication = { ...medication };
    const updatedSchedule = updatedMedication.schedule.map((scheduleItem) => {
      if (scheduleItem.id === scheduleId) {
        oldStatus = scheduleItem.isTaken;
        scheduleItem.isTaken = newStatus;
      }
      return scheduleItem;
    });
    updatedMedication.schedule = updatedSchedule;

    if (newStatus) {
      updatedMedication.currentStock -= updatedMedication.dose;
      if (updatedMedication.currentStock < 0) {
        updatedMedication.currentStock = 0;
      }
    }

    if (oldStatus) {
      updatedMedication.currentStock += updatedMedication.dose;
    }

    const updateMedications = medications.map((medication) => {
      return medication.id === updatedMedication.id
        ? updatedMedication
        : medication;
    });
    setMedications(updateMedications);
  }

  return (
    <View className="rounded-2xl bg-white gap-y-4 p-5">
      <View className="gap-y-1">
        <UiText className="text-sm font-semibold">{medication.name}</UiText>
        <UiText className="text-xs text-grayDark">{`${medication.dose} ${currentUnit?.label || medicalUnits[0].label}`}</UiText>
      </View>
      <View className="flex-row justify-between">
        <View className="w-[12.5%] items-center justify-center gap-y-2">
          <UiText className="text-center text-xs p-0.5"> </UiText>
          {arrayOfOrders.map((item) => (
            <View
              key={uuid()}
              className="items-center justify-center text-center size-7"
            >
              <UiText className="text-xs">{item}</UiText>
            </View>
          ))}
        </View>
        {thisWeekMedications.map((weekMedications, index) =>
          index !== thisWeekMedications.length - 1 ? (
            <View
              key={weekMedications.weekdayName}
              className="w-[12.5%] items-center justify-center gap-y-2"
            >
              <UiText className="text-center text-xs px-1 py-0.5">
                {weekMedications.weekdayName.slice(0, 3)}
              </UiText>
              {arrayOfOrders.map((item, index) => {
                if (weekMedications.schedule.length === 0) {
                  return (
                    <View
                      key={uuid()}
                      className="items-center justify-center size-7"
                    >
                      <View className="bg-gray h-0.5 w-4" />
                    </View>
                  );
                } else {
                  const scheduleItem = weekMedications.schedule[index];

                  if (!scheduleItem) {
                    return (
                      <View
                        key={uuid()}
                        className="items-center justify-center size-7"
                      >
                        <View className="bg-gray h-0.5 w-4" />
                      </View>
                    );
                  }
                  if (scheduleItem && scheduleItem.isTaken === null) {
                    return (
                      <Pressable
                        key={uuid()}
                        className="items-center justify-center rounded-lg bg-grayLight size-7"
                        onPress={() =>
                          handleChangeIsTakenStatus(
                            scheduleItem.id,
                            weekMedications.weekdayName,
                            arrayOfOrders[index]
                          )
                        }
                      >
                        <UiText className="text-grayDark">?</UiText>
                      </Pressable>
                    );
                  }
                  if (scheduleItem && scheduleItem.isTaken !== null) {
                    return (
                      <Pressable
                        key={uuid()}
                        className="items-center justify-center size-7"
                        onPress={() =>
                          handleChangeIsTakenStatus(
                            scheduleItem.id,
                            weekMedications.weekdayName,
                            arrayOfOrders[index]
                          )
                        }
                      >
                        <MedicationCheckbox
                          currentStatus={
                            scheduleItem.isTaken ? 'Taken' : 'Not taken'
                          }
                        />
                      </Pressable>
                    );
                  }
                }
              })}
            </View>
          ) : (
            <View
              key={weekMedications.weekdayName}
              className="w-[12.5%] items-center justify-center gap-y-2"
            >
              <View className="rounded-xl bg-primary/20 px-1 py-0.5">
                <UiText className="text-xs font-semibold text-primary">
                  {weekMedications.weekdayName.slice(0, 3)}
                </UiText>
              </View>
              {arrayOfOrders.map(() => {
                if (weekMedications.schedule.length === 0) {
                  return (
                    <View
                      key={uuid()}
                      className="items-center justify-center size-7"
                    >
                      <View className="bg-gray h-0.5 w-4" />
                    </View>
                  );
                } else {
                  return (
                    <View
                      key={uuid()}
                      className="items-center justify-center rounded-lg border-2 border-primary size-7"
                    >
                      <SfSymbol
                        name="checkmark"
                        type="monochrome"
                        tintColor={colors.gray.toString()}
                        className="text-center text-xs"
                        size={scaleX(18)}
                        weight="semibold"
                      />
                    </View>
                  );
                }
              })}
            </View>
          )
        )}
      </View>
    </View>
  );
}
