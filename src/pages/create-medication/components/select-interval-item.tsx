import { View } from 'react-native';

import { useModals } from '@/hooks/use-modals';
import { Schedule } from '@/types/schedule';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  currentScheduleItem: Schedule;
  handleSelectXDayInterval: (newInterval: number) => void;
};

export function SelectIntervalItem({
  currentScheduleItem,
  handleSelectXDayInterval,
}: Props) {
  const { openModal, closeModal } = useModals();

  async function handleSelectInterval() {
    openModal('SelectNumberModal', {
      close: () => closeModal('SelectNumberModal'),
      setNumber: handleSelectXDayInterval,
      selectedNumber: currentScheduleItem.everyXDayInterval || 2,
    });
  }

  return (
    <View className="-mt-3">
      <Pressable
        className="flex-row items-center justify-between rounded-xl bg-white text-sm p-4"
        onPress={handleSelectInterval}
      >
        <UiText className="text-sm">Interval</UiText>
        <View className="flex-row items-center justify-center gap-x-3">
          <View className="items-center justify-center rounded-lg bg-primary/20 px-2 py-1">
            <UiText className="text-sm text-primary">
              {currentScheduleItem.everyXDayInterval}
            </UiText>
          </View>
          <UiText className="text-sm">
            day{currentScheduleItem.everyXDayInterval === 1 ? '' : 's'}
          </UiText>
        </View>
      </Pressable>
    </View>
  );
}
