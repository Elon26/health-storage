import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { Dispatch, SetStateAction } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { twMerge } from 'tailwind-merge';

import medicalUnitIcons from '@/config/constants/medical-unit-icons';
import medicalUnits from '@/config/constants/medical-units';
import { useModals } from '@/hooks/use-modals';
import ArrowDownIcon from '@/svg/arrow-down.svg';
import MedicalUnit from '@/types/medical-unit';
import MedicalUnitIcon from '@/types/medical-unit-icon';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  selectedIcon: string;
  selectIcon: (icon: MedicalUnitIcon) => void;
  medicationName: string;
  setMedicationName: Dispatch<SetStateAction<string>>;
  medicationDose: number;
  setMedicationDose: Dispatch<SetStateAction<number>>;
  medicationUnit: MedicalUnit;
  setMedicationUnit: Dispatch<SetStateAction<MedicalUnit>>;
};

export function ReminderFirstScreen({
  selectedIcon,
  selectIcon,
  medicationName,
  setMedicationName,
  medicationDose,
  setMedicationDose,
  medicationUnit,
  setMedicationUnit,
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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-y-5 w-auto">
        <View className="gap-y-2.5 w-auto">
          <UiText className="text-xs font-medium text-grayDark">
            Select an icon
          </UiText>
          <ScrollView horizontal={true} className="-mb-3 pb-3 w-auto">
            <View className="flex-row gap-x-1.5 mr-10">
              {medicalUnitIcons.map((icon) => (
                <Pressable
                  key={icon.name}
                  className={twMerge(
                    'items-center justify-center rounded-3xl border-2 size-18',
                    selectedIcon === icon.name
                      ? 'border-primary bg-primary/20'
                      : 'border-grayLight bg-grayLight'
                  )}
                  onPress={() => selectIcon(icon.name)}
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
        <View className="gap-y-2.5 mr-11">
          <UiText className="text-xs font-medium text-grayDark">
            Medication Name*
          </UiText>
          <TextInput
            className="rounded-xl bg-white text-sm px-4 py-5"
            value={medicationName}
            onChangeText={setMedicationName}
            placeholder="Enter medication name"
            autoFocus
          />
        </View>
        <View className="flex-row gap-x-2 mx-7">
          <View className="w-[50%] gap-y-2.5 -ml-6">
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
          <View className="w-[50%] gap-y-2.5">
            <UiText className="text-xs font-medium text-grayDark">
              Choose Unit
            </UiText>
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
        </View>
      </View>
    </ScrollView>
  );
}
