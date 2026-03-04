import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActionSheetIOS, Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import medicalUnitIcons from '@/config/constants/medical-unit-icons';
import medicalUnits from '@/config/constants/medical-units';
import { useStorage } from '@/hooks/use-storage';
import { Schedule } from '@/types/schedule';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { Pressable } from '@/ui/pressable';
import { Separator } from '@/ui/separator';
import { UiText } from '@/ui/ui-text';

import { handleFrequency } from './utils/handle-frequency';

type Props = {
  medicationId: string | string[];
};

export default function MedicationPage({ medicationId }: Props) {
  const insets = useSafeAreaInsets();
  const [medications, setMedications] = useStorage('medications');

  const medication = medications.find(
    (medication) => medication.id === medicationId
  );

  function handlePress() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Edit', 'Delete', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          Alert.alert(
            'Delete medication?',
            'This will permanently remove it from your list and cannot be undone.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  router.back();
                  setMedications((prev) => {
                    return prev.filter((item) => item.id !== medicationId);
                  });
                },
              },
            ]
          );
        } else if (buttonIndex === 0) {
          router.navigate({
            pathname: '/medications/[medication]/edit',
            params: {
              medication: medicationId.toString(),
            },
          });
        }
      }
    );
  }

  const icon = medicalUnitIcons.find((icon) => icon.name === medication?.icon);
  const medicalUnit = medicalUnits.find(
    (unit) => unit.name === medication?.unit
  );
  const frequency = handleFrequency(medication?.scheduleData);
  const times = handleTimes(medication?.scheduleData);

  function handleTimes(currentScheduleItem: Schedule | undefined) {
    if (currentScheduleItem) {
      const times = currentScheduleItem.times.map(
        (item) => `${item.hour}:${item.minute < 10 ? '0' : ''}${item.minute}`
      );
      return times.join(' · ');
    }
  }

  return (
    <Page>
      <PageHeader pageName="Medication details">
        <Pressable
          className="flex-row items-center justify-center rounded-xl bg-white gap-x-0.5 size-10"
          onPress={handlePress}
        >
          <View className="rounded-full bg-black size-1" />
          <View className="rounded-full bg-black size-1" />
          <View className="rounded-full bg-black size-1" />
        </Pressable>
      </PageHeader>
      <ScrollView
        className="-mt-5 pt-5"
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
      >
        <View className="rounded-2xl bg-white">
          <View className="flex-row items-center gap-x-3 p-4">
            {icon && (
              <View className="items-center justify-center rounded-2xl bg-primary/20 size-12">
                <Image
                  source={icon.image}
                  style={{ width: scaleY(32), height: scaleY(32) }}
                  contentFit="contain"
                />
              </View>
            )}
            <View className="flex-1 gap-y-1">
              <UiText className="text-sm font-semibold">
                {medication?.name}
              </UiText>
              <UiText className="text-xs text-grayDark">
                {medication?.dose} {medicalUnit?.label}
              </UiText>
            </View>
          </View>
          <Separator />
          <View className="flex-row justify-between px-4 py-5">
            <UiText className="text-xs font-medium text-grayDark">
              Frequency
            </UiText>
            <UiText className="text-right text-sm font-medium">
              {frequency}
            </UiText>
          </View>
          <Separator />
          <View className="flex-row items-center justify-between gap-x-4 px-4 py-5">
            <UiText className="text-xs font-medium text-grayDark">
              Schedule
            </UiText>
            <UiText className="flex-1 text-right text-sm font-medium">
              {times}
            </UiText>
          </View>
          <Separator />
          <View className="flex-row items-center justify-between gap-x-4 px-4 py-5">
            <UiText className="text-xs font-medium text-grayDark">
              Start Date
            </UiText>
            <UiText className="flex-1 text-right text-sm font-medium">
              {new Date(
                medication?.scheduleData.startDate || 0
              ).toLocaleDateString('en-EN', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </UiText>
          </View>
          <Separator />
          <View className="flex-row items-center justify-between gap-x-4 px-4 py-5">
            <UiText className="text-xs font-medium text-grayDark">
              End Date
            </UiText>
            <UiText className="flex-1 text-right text-sm font-medium">
              {new Date(
                medication?.scheduleData.endDate || 0
              ).toLocaleDateString('en-EN', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </UiText>
          </View>
          {medication?.isStockTrackingActive && <Separator />}
          {medication?.isStockTrackingActive && (
            <View className="flex-row items-center justify-between gap-x-4 px-4 py-5">
              <UiText className="text-xs font-medium text-grayDark">
                Current Stock
              </UiText>
              <UiText className="flex-1 text-right text-sm font-medium">
                {medication?.currentStock}
              </UiText>
            </View>
          )}
          {medication?.note && <Separator />}
          {medication?.note && (
            <View className="p-4">
              <UiText className="rounded-xl bg-grayLight text-sm p-3">
                {medication.note}
              </UiText>
            </View>
          )}
        </View>
      </ScrollView>
    </Page>
  );
}
