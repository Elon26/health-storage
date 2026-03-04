import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { Dispatch, SetStateAction } from 'react';
import { ScrollView, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import medicalUnitIcons from '@/config/constants/medical-unit-icons';
import MedicalUnitIcon from '@/types/medical-unit-icon';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  medicationIcon: MedicalUnitIcon;
  setMedicationIcon: Dispatch<SetStateAction<MedicalUnitIcon>>;
};

export default function ChangeIconArea({
  medicationIcon,
  setMedicationIcon,
}: Props) {
  return (
    <View className="gap-y-2.5 w-auto">
      <UiText className="text-xs font-medium text-grayDark">
        Select an icon
      </UiText>
      <ScrollView horizontal={true} className="-mb-3 pb-3 w-auto">
        <View className="flex-row gap-x-1.5">
          {medicalUnitIcons.map((icon) => (
            <Pressable
              key={icon.name}
              className={twMerge(
                'items-center justify-center rounded-3xl border-2 size-18',
                medicationIcon === icon.name
                  ? 'border-primary bg-primary/20'
                  : 'border-grayLight bg-grayLight'
              )}
              onPress={() => setMedicationIcon(icon.name)}
            >
              <Image
                key={icon.name}
                source={icon.image}
                style={{ width: scaleY(50), height: scaleY(50) }}
                contentFit="contain"
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
