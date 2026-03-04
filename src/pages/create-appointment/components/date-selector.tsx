import { Pressable, View } from 'react-native';

import { useModals } from '@/hooks/use-modals';
import ArrowDownIcon from '@/svg/arrow-down.svg';
import { UiText } from '@/ui/ui-text';
import { isToday } from '@/utils/date-compare';

type Props = {
  selectedDate: number;
  selectDate: (timestamp: Date) => void;
};

export default function DateSelector({ selectedDate, selectDate }: Props) {
  const { openModal, closeModal } = useModals();
  const selectedDateToHandle = new Date(selectedDate);
  const isSelectedDateToday = isToday(selectedDateToHandle);

  async function handleSetStartDate() {
    openModal('CalendarModal', {
      startDate: selectedDateToHandle,
      close: () => closeModal('CalendarModal'),
      setDate: selectDate,
    });
  }

  return (
    <View className="gap-y-2">
      <UiText className="text-xs font-medium text-grayDark">Start Date</UiText>
      <View>
        <Pressable
          className="flex-row justify-between rounded-xl bg-white text-sm px-4 py-5"
          onPress={handleSetStartDate}
        >
          <UiText className="text-sm">
            {selectedDateToHandle.toLocaleDateString('en-EN', {
              month: 'long',
              day: 'numeric',
            })}
            {isSelectedDateToday ? ' (Today)' : ''}
          </UiText>
          <ArrowDownIcon />
        </Pressable>
      </View>
    </View>
  );
}
