import { scaleX } from '@kirz/nativewind-scale';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';
import { twMerge } from 'tailwind-merge';

import type { ModalStackParams } from '@/components/modals';
import medicalUnits from '@/config/constants/medical-units';
import MedicalUnit from '@/types/medical-unit';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function ChooseUnitModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'ChooseUnitModal'>) {
  const { width } = useWindowDimensions();
  const setValue = (val: MedicalUnit) => params?.setValue(val);
  const close = () => params?.close();
  const selectedValue = params?.selectedValue;

  const [selectedUnit, setSelectedUnit] = useState(
    medicalUnits.find((unit) => unit.name === selectedValue) || medicalUnits[0]
  );

  return (
    <View
      className="rounded-3xl bg-white"
      style={{ width: width - scaleX(100) }}
    >
      <UiText className="text-center font-medium mt-5">Choose unit</UiText>
      <View className="flex-row flex-wrap justify-center gap-2 px-2 py-4">
        {Object.values(medicalUnits).map((unit) => (
          <Pressable
            key={unit.name}
            onPress={() => setSelectedUnit(unit)}
            className={twMerge(
              'rounded-2xl border-2 px-3 py-2',
              selectedUnit.name === unit.name
                ? 'border-primary bg-primary/20'
                : 'border-grayLight bg-grayLight'
            )}
          >
            <UiText>{unit.label}</UiText>
          </Pressable>
        ))}
      </View>
      <View className="flex-row">
        <Pressable
          className="w-[50%] border-r border-t border-gray"
          onPress={close}
        >
          <UiText className="text-center text-blue py-3">Cancel</UiText>
        </Pressable>
        <Pressable
          className="w-[50%] border-t border-gray"
          onPress={() => setValue(selectedUnit.name)}
        >
          <UiText className="text-center font-semibold text-blue py-3">
            OK
          </UiText>
        </Pressable>
      </View>
    </View>
  );
}
