import { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useModals } from '@/hooks/use-modals';
import { UiText } from '@/ui/ui-text';

type Props = {
  medicationDose: number;
  setMedicationDose: Dispatch<SetStateAction<number>>;
};

export default function ChangeDoseArea({
  medicationDose,
  setMedicationDose,
}: Props) {
  const { openModal, closeModal } = useModals();

  async function handleAddDosage() {
    openModal('AddQuantityModal', {
      title: 'Set your dose',
      close: () => closeModal('AddQuantityModal'),
      setValue: (dose) => {
        setMedicationDose(dose);
        closeModal('AddQuantityModal');
      },
    });
  }

  return (
    <View className="w-[50%] gap-y-2.5">
      <UiText className="text-xs font-medium text-grayDark">Dose</UiText>
      <TouchableOpacity
        className="rounded-xl bg-white px-4 py-5"
        onPress={handleAddDosage}
      >
        {medicationDose ? (
          <UiText className="text-sm">{medicationDose}</UiText>
        ) : (
          <UiText className="text-sm text-grayDark">Add dosage</UiText>
        )}
      </TouchableOpacity>
    </View>
  );
}
