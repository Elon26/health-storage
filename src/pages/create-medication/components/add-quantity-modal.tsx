import { scaleX } from '@kirz/nativewind-scale';
import { useState } from 'react';
import { TextInput, useWindowDimensions, View } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';

import type { ModalStackParams } from '@/components/modals';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function AddQuantityModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'AddQuantityModal'>) {
  const { width } = useWindowDimensions();
  const title = params?.title;
  const setValue = (val: number) => params?.setValue(val);
  const close = () => params?.close();

  const [quantity, setQuantity] = useState(0);

  return (
    <View
      className="rounded-3xl bg-white"
      style={{ width: width - scaleX(100) }}
    >
      <UiText className="text-center font-medium mb-3 mt-5">{title}</UiText>
      <TextInput
        className="rounded-lg border border-gray mx-4 p-2 mb-5"
        value={quantity ? quantity.toString() : ''}
        keyboardType="numeric"
        onChangeText={(text) => {
          const digitsOnly = text.replace(/[^0-9]/g, '');
          setQuantity(+digitsOnly);
        }}
        autoFocus
      />
      <View className="flex-row">
        <Pressable
          className="w-[50%] border-r border-t border-gray"
          onPress={close}
        >
          <UiText className="text-center text-blue py-3">Cancel</UiText>
        </Pressable>
        <Pressable
          className="w-[50%] border-t border-gray"
          onPress={() => setValue(quantity)}
        >
          <UiText className="text-center font-semibold text-blue py-3">
            OK
          </UiText>
        </Pressable>
      </View>
    </View>
  );
}
