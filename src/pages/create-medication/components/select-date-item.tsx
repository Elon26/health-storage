import { Pressable, View } from 'react-native';

import { useModals } from '@/hooks/use-modals';
import ArrowDownIcon from '@/svg/arrow-down.svg';
import { UiText } from '@/ui/ui-text';
import { isToday } from '@/utils/date-compare';

type Props = {
  type: 'Start' | 'End';
  date: Date;
  setNewDate: (newDate: Date, type: 'Start' | 'End') => void;
};

export default function SelectDateItem({ type, date, setNewDate }: Props) {
  const { openModal, closeModal } = useModals();
  const startDateToHandle = new Date(date);
  const isStartDateToday = isToday(startDateToHandle);

  async function handleSetStartDate() {
    openModal('CalendarModal', {
      startDate: startDateToHandle,
      close: () => closeModal('CalendarModal'),
      setDate: (newDate) => setNewDate(newDate, type),
    });
  }

  return (
    <View className="gap-y-2">
      <UiText className="text-xs font-medium text-grayDark">{type} Date</UiText>
      <View>
        <Pressable
          className="flex-row justify-between rounded-xl bg-white text-sm px-4 py-5"
          onPress={handleSetStartDate}
        >
          <UiText className="text-sm">
            {startDateToHandle.toLocaleDateString('en-EN', {
              month: 'long',
              day: 'numeric',
            })}
            {isStartDateToday ? ' (Today)' : ''}
          </UiText>
          <ArrowDownIcon />
        </Pressable>
      </View>
    </View>
  );
}
