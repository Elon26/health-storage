import { Pressable, View } from 'react-native';

import { useModals } from '@/hooks/use-modals';
import ArrowDownIcon from '@/svg/arrow-down.svg';
import { UiText } from '@/ui/ui-text';

type Props = {
  selectedDate: number;
  selectTime: (time: Date) => void;
};

export default function TimeSelector({ selectedDate, selectTime }: Props) {
  const { openModal, closeModal } = useModals();
  let hour = new Date(selectedDate).getHours().toString();
  if (hour.length === 1) hour = '0' + hour;
  let minute = new Date(selectedDate).getMinutes().toString();
  if (minute.length === 1) minute = '0' + minute;

  async function handleSetTime() {
    openModal('TimeModal', {
      selectedDate: selectedDate,
      close: () => closeModal('TimeModal'),
      selectTime: selectTime,
    });
  }

  return (
    <View className="gap-y-2">
      <UiText className="text-xs font-medium text-grayDark">Time</UiText>
      <View>
        <Pressable
          className="flex-row justify-between rounded-xl bg-white text-sm px-4 py-5"
          onPress={handleSetTime}
        >
          <UiText className="text-sm">{`${hour}:${minute}`}</UiText>
          <ArrowDownIcon />
        </Pressable>
      </View>
    </View>
  );
}
