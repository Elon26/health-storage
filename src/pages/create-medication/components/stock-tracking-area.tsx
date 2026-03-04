import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Switch, TouchableOpacity, View } from 'react-native';

import { colors } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import MedicalUnit from '@/types/medical-unit';
import { UiText } from '@/ui/ui-text';

type Props = {
  isStockTrackingActive: boolean;
  setIsStockTrackingActive: Dispatch<SetStateAction<boolean>>;
  medicationUnit: MedicalUnit;
  medicationDose: number;
  currentStock: number;
  setCurrentStock: Dispatch<SetStateAction<number>>;
  reminderStockLimit: number;
  setReminderStockLimit: Dispatch<SetStateAction<number>>;
};

export default function StockTrackingArea({
  isStockTrackingActive,
  setIsStockTrackingActive,
  medicationUnit,
  medicationDose,
  currentStock,
  setCurrentStock,
  reminderStockLimit,
  setReminderStockLimit,
}: Props) {
  const { openModal, closeModal } = useModals();

  const [isCountableUnit, setIsCountableUnit] = useState(false);
  const [isStockTrackingEnable, setIsStockTrackingEnable] = useState(false);

  function checkCountability(medicationUnit: string) {
    return (
      medicationUnit === MedicalUnit.capsule ||
      medicationUnit === MedicalUnit.g ||
      medicationUnit === MedicalUnit.mcg ||
      medicationUnit === MedicalUnit.mg ||
      medicationUnit === MedicalUnit.ml ||
      medicationUnit === MedicalUnit.sachet ||
      medicationUnit === MedicalUnit.suppository ||
      medicationUnit === MedicalUnit.tablet ||
      medicationUnit === MedicalUnit.unit ||
      medicationUnit === MedicalUnit.vaginalCapsule
    );
  }

  function handleAddCurrentStock() {
    openModal('AddQuantityModal', {
      title: 'Enter tour current stock amount',
      close: () => closeModal('AddQuantityModal'),
      setValue: (stock) => {
        setCurrentStock(stock);
        closeModal('AddQuantityModal');
      },
    });
  }

  function handleAddReminderStockLimit() {
    openModal('AddQuantityModal', {
      title: 'Specify the refill threshold',
      close: () => closeModal('AddQuantityModal'),
      setValue: (stock) => {
        setReminderStockLimit(stock);
        closeModal('AddQuantityModal');
      },
    });
  }

  useEffect(() => {
    const currentCountability = checkCountability(medicationUnit);
    setIsCountableUnit(currentCountability);

    const currentStockTrackingAbility =
      currentCountability && medicationDose !== 0;
    setIsStockTrackingEnable(currentStockTrackingAbility);

    if (!currentStockTrackingAbility) setIsStockTrackingActive(false);
  }, [medicationUnit, medicationDose, setIsStockTrackingActive]);

  return (
    <View className="gap-y-2">
      <UiText className="text-xs font-medium text-grayDark">
        Stock tracking
      </UiText>
      <View className="flex-row items-center justify-between rounded-xl bg-white px-4 h-13">
        <UiText className="text-sm">Track Stock</UiText>
        <Switch
          value={isStockTrackingActive}
          trackColor={{
            false: colors.gray.toString(),
            true: colors.primary.toString(),
          }}
          onChange={() => setIsStockTrackingActive((prev) => !prev)}
          disabled={!isStockTrackingEnable}
        />
      </View>
      {!isCountableUnit && (
        <UiText className="text-center text-sm">
          The {medicationUnit} stock cannot be counted. Stock tracking is
          unavailable.
        </UiText>
      )}
      {isCountableUnit && !medicationDose && (
        <UiText className="text-center text-sm">
          You need to set the dose to track stock.
        </UiText>
      )}
      {isStockTrackingEnable && (
        <View className="gap-y-2">
          <TouchableOpacity
            className="flex-row items-center justify-between rounded-xl bg-white gap-x-2 px-4 h-13"
            onPress={isStockTrackingActive ? handleAddCurrentStock : () => {}}
          >
            <UiText className="text-sm">Current Stock</UiText>
            {isStockTrackingActive ? (
              <View className="flex-row items-center justify-center gap-x-2">
                <UiText className="rounded-lg bg-primary/20 text-sm text-primary px-2 py-1">
                  {currentStock}
                </UiText>
                <UiText className="text-sm">
                  {medicationUnit}
                  {currentStock !== 1 && 's'}
                </UiText>
              </View>
            ) : (
              <UiText className="text-sm">—</UiText>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-between rounded-xl bg-white gap-x-2 px-4 h-13"
            onPress={
              isStockTrackingActive ? handleAddReminderStockLimit : () => {}
            }
          >
            <UiText className="text-sm">Stock Reminder</UiText>
            {isStockTrackingActive ? (
              <View className="flex-row items-center justify-center gap-x-2">
                <UiText className="rounded-lg bg-primary/20 text-sm text-primary px-2 py-1">
                  {reminderStockLimit}
                </UiText>
                <UiText className="text-sm">
                  {medicationUnit}
                  {reminderStockLimit !== 1 && 's'}
                </UiText>
              </View>
            ) : (
              <UiText className="text-sm">—</UiText>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
