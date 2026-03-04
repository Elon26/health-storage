import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import medicalUnitIcons from '@/config/constants/medical-unit-icons';
import medicalUnits from '@/config/constants/medical-units';
import SpecificTimeMedication from '@/types/specific-time-medication';
import { Pressable as UiPressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import { checkCurrentIsTakenStatus } from '../utils/check-current-is-taken-status';
import { MedicationCheckbox } from './medication-checkbox';

type Props = {
  medication: SpecificTimeMedication;
  changeSpecificTimeMedicationIsTakenStatus: (
    parentId: string,
    timeItemId: string,
    newIsTakenStatus: boolean | null,
    oldIsTakenStatus: boolean | null
  ) => void;
};

export default function MedicationItem({
  medication,
  changeSpecificTimeMedicationIsTakenStatus,
}: Props) {
  const currentIcon = medicalUnitIcons.find(
    (icon) => medication.icon === icon.name
  );
  const currentUnit = medicalUnits.find(
    (unit) => medication.unit === unit.name
  );
  const isMissed = medication.schedule.timestamp < Date.now();
  const currentStatus = checkCurrentIsTakenStatus(
    medication.schedule.isTaken,
    isMissed
  );

  function toggleIsTaken(isTaken: boolean | null) {
    const newIsTaken =
      isTaken === null ? true : isTaken === true ? false : null;
    changeSpecificTimeMedicationIsTakenStatus(
      medication.parentId,
      medication.schedule.id,
      newIsTaken,
      isTaken
    );
  }

  return (
    <UiPressable
      className="flex-row items-center justify-between rounded-2xl bg-white gap-x-3 p-5"
      onPress={() =>
        router.navigate({
          pathname: '/medications/[medication]',
          params: {
            medication: medication.parentId,
          },
        })
      }
    >
      <View className="flex-1 flex-row items-center gap-x-3">
        {currentIcon && (
          <View className="items-center justify-center rounded-2xl bg-primary/20 size-12">
            <Image
              key={currentIcon.name}
              source={currentIcon.image}
              style={{ width: scaleY(32), height: scaleY(32) }}
              contentFit="contain"
            />
          </View>
        )}
        <View className="flex-1 gap-y-1">
          <UiText className="text-sm font-semibold" numberOfLines={1}>
            {medication.name}
          </UiText>
          <UiText className="text-xs text-grayDark">
            {medication.dose} {currentUnit?.label}
          </UiText>
        </View>
      </View>
      <Pressable
        className="flex-row items-center justify-between gap-x-3 w-28"
        onPress={() => toggleIsTaken(medication.schedule.isTaken)}
      >
        <View className="flex-1 gap-y-1">
          <UiText
            className={twMerge(
              'text-right text-xs font-medium',
              medication.schedule.isTaken === true
                ? 'text-primary'
                : medication.schedule.isTaken === false
                  ? 'text-red'
                  : isMissed
                    ? 'text-red'
                    : 'text-grayDark'
            )}
          >
            {currentStatus}
          </UiText>
          <UiText className="text-right text-sm font-semibold">
            {new Date(medication.schedule.timestamp).toLocaleTimeString(
              'en-EN',
              {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }
            )}
          </UiText>
        </View>
        <MedicationCheckbox currentStatus={currentStatus} />
      </Pressable>
    </UiPressable>
  );
}
