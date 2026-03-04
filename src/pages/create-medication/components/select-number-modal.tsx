import { scaleX } from '@kirz/nativewind-scale';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { ModalComponentProp } from 'react-native-modalfy';

import { ModalStackParams } from '@/components/modals';
import { WheelPicker } from '@/components/wheel-picker';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function SelectNumberModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'SelectNumberModal'>) {
  const { width } = useWindowDimensions();
  const close = () => params?.close();
  const selectedNumber = params?.selectedNumber;
  const setNumber = (interval: number) => params?.setNumber(interval);
  const [newNumber, setNewNumber] = useState<number>(selectedNumber || 1);

  return (
    <View
      className="rounded-3xl bg-white"
      style={{ width: width - scaleX(50) }}
    >
      <View className="items-center p-2">
        <WheelPicker
          min={1}
          max={90}
          onValueChange={setNewNumber}
          currentValue={newNumber}
        />
      </View>
      <View className="flex-row">
        <Pressable
          className="w-[50%] border-r border-t border-gray"
          onPress={close}
        >
          <UiText className="text-center py-3">Cancel</UiText>
        </Pressable>
        <Pressable
          className="w-[50%] border-t border-gray"
          onPress={() => {
            setNumber(newNumber);
            close();
          }}
        >
          <UiText className="text-center font-semibold py-3">Select</UiText>
        </Pressable>
      </View>
    </View>
  );
}
