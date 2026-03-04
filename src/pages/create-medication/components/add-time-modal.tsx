import { scaleX } from '@kirz/nativewind-scale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { ModalComponentProp } from 'react-native-modalfy';

import { ModalStackParams } from '@/components/modals';
import { DayTime } from '@/types/schedule';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function AddTimeModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'AddTimeModal'>) {
  const { width } = useWindowDimensions();
  const close = () => params?.close();
  const [newDayTime, setNewDayTime] = useState<DayTime>({ hour: 8, minute: 0 });
  const addDayTime = (dayTime: DayTime) => params?.addDayTime(dayTime);

  return (
    <View
      className="rounded-3xl bg-white"
      style={{ width: width - scaleX(50) }}
    >
      <View className="items-center p-2">
        <DateTimePicker
          value={new Date(1989, 11, 26, newDayTime.hour, newDayTime.minute)}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(_, date?: Date | undefined) =>
            setNewDayTime({
              hour: date?.getHours() || 0,
              minute: date?.getMinutes() || 0,
            })
          }
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
            addDayTime(newDayTime);
            close();
          }}
        >
          <UiText className="text-center font-semibold py-3">Add</UiText>
        </Pressable>
      </View>
    </View>
  );
}
