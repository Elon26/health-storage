import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import medicalUnitIcons from '@/config/constants/medical-unit-icons';
import { handleFrequency } from '@/pages/medication/utils/handle-frequency';
import ArrowRightWhiteIcon from '@/svg/arrow-right-white.svg';
import Medication from '@/types/medication';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  medication: Medication;
};

export default function MedicationsCard({ medication }: Props) {
  const currentIcon = medicalUnitIcons.find(
    (icon) => medication.icon === icon.name
  );

  const frequency = handleFrequency(medication.scheduleData);

  return (
    <Pressable
      className="flex-row items-center justify-between rounded-2xl bg-white p-5"
      onPress={() =>
        router.navigate({
          pathname: '/medications/[medication]',
          params: {
            medication: medication.id,
          },
        })
      }
    >
      <View className="flex-1 flex-row items-center gap-x-3">
        <View className="items-center justify-center rounded-2xl bg-primary/20 size-12">
          <Image
            source={currentIcon?.image}
            style={{
              width: scaleY(32),
              height: scaleY(32),
            }}
            contentFit="contain"
          />
        </View>
        <View className="flex-1 gap-y-1">
          <UiText className="text-sm font-semibold" numberOfLines={1}>
            {medication.name}
          </UiText>

          <UiText className="text-xs text-grayDark">{frequency}</UiText>
        </View>
      </View>
      <View className="items-center justify-center rounded-2xl bg-primary h-7.5 w-12">
        <ArrowRightWhiteIcon />
      </View>
    </Pressable>
  );
}
