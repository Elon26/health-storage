import { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, View } from 'react-native';

import medicalUnits from '@/config/constants/medical-units';
import { useModals } from '@/hooks/use-modals';
import ArrowDownIcon from '@/svg/arrow-down.svg';
import MedicalUnit from '@/types/medical-unit';
import { UiText } from '@/ui/ui-text';

type Props = {
  medicationUnit: MedicalUnit;
  setMedicationUnit: Dispatch<SetStateAction<MedicalUnit>>;
};

export default function ChangeUnitArea({
  medicationUnit,
  setMedicationUnit,
}: Props) {
  const { openModal, closeModal } = useModals();

  async function handleChooseUnit() {
    openModal('ChooseUnitModal', {
      selectedValue: medicationUnit,
      close: () => closeModal('ChooseUnitModal'),
      setValue: (unit: MedicalUnit) => {
        setMedicationUnit(unit);
        closeModal('ChooseUnitModal');
      },
    });
  }

  return (
    <View className="w-[50%] gap-y-2.5">
      <UiText className="text-xs font-medium text-grayDark">Choose Unit</UiText>
      <TouchableOpacity
        className="flex-row justify-between rounded-xl bg-white px-4 py-5"
        onPress={handleChooseUnit}
      >
        <UiText className="text-sm">
          {
            (
              medicalUnits.find((unit) => unit.name === medicationUnit) ||
              medicalUnits[0]
            ).label
          }
        </UiText>
        <ArrowDownIcon />
      </TouchableOpacity>
    </View>
  );
}
