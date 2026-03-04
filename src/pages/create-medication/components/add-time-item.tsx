import { View } from 'react-native';

import { useModals } from '@/hooks/use-modals';
import PlusIcon from '@/svg/plus-small.svg';
import { DayTime } from '@/types/schedule';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  addDayTime: (dayTime: DayTime) => void;
};

export function AddTimeItem({ addDayTime }: Props) {
  const { openModal, closeModal } = useModals();

  async function handleAddTime() {
    openModal('AddTimeModal', {
      close: () => closeModal('AddTimeModal'),
      addDayTime: addDayTime,
    });
  }

  return (
    <View>
      <Pressable
        className="flex-row items-center justify-between rounded-xl bg-white text-sm p-4"
        onPress={handleAddTime}
      >
        <UiText className="text-sm">Add Time</UiText>
        <View className="items-center justify-center rounded-full bg-primary size-6">
          <PlusIcon />
        </View>
      </Pressable>
    </View>
  );
}
