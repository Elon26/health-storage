import { scaleX } from '@kirz/nativewind-scale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { ModalComponentProp } from 'react-native-modalfy';

import { ModalStackParams } from '@/components/modals';
import { UiText } from '@/ui/ui-text';

export default function TimeModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'TimeModal'>) {
  const { width } = useWindowDimensions();
  const close = () => params?.close();
  const selectTime = (time: Date) => params?.selectTime(time);
  const selectedDate = params?.selectedDate || new Date();

  const [selectedTime, setSelectedTime] = useState<Date>(
    new Date(selectedDate)
  );

  return (
    <View
      className="items-center rounded-3xl bg-white"
      style={{ width: width - scaleX(50) }}
    >
      <DateTimePicker
        value={new Date(selectedTime)}
        mode="time"
        is24Hour={true}
        display="spinner"
        onChange={(_, date?: Date | undefined) => setSelectedTime(date as Date)}
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
          onPress={() => {
            selectTime(selectedTime);
            close();
          }}
        >
          <UiText className="text-center font-semibold text-blue py-3">
            OK
          </UiText>
        </Pressable>
      </View>
    </View>
  );
}
