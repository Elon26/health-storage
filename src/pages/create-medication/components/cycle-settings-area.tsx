import { View } from 'react-native';

import { useModals } from '@/hooks/use-modals';
import { Schedule } from '@/types/schedule';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  currentScheduleItem: Schedule;
  handleSelectUseCycleInterval: (newInterval: number) => void;
  handleSelectPauseCycleInterval: (newInterval: number) => void;
};

export function CycleSettingsArea({
  currentScheduleItem,
  handleSelectUseCycleInterval,
  handleSelectPauseCycleInterval,
}: Props) {
  const { openModal, closeModal } = useModals();

  async function handleSelectInterval(type: 'use' | 'pause') {
    if (type === 'use') {
      openModal('SelectNumberModal', {
        close: () => closeModal('SelectNumberModal'),
        setNumber: handleSelectUseCycleInterval,
        selectedNumber: currentScheduleItem.cyclicalInterval?.use || 1,
      });
    }
    if (type === 'pause') {
      openModal('SelectNumberModal', {
        close: () => closeModal('SelectNumberModal'),
        setNumber: handleSelectPauseCycleInterval,
        selectedNumber: currentScheduleItem.cyclicalInterval?.pause || 1,
      });
    }
  }

  return (
    <View>
      <View className="gap-y-2">
        <UiText className="text-xs font-medium text-grayDark">
          Cycle Settings
        </UiText>
        <View className="gap-y-2">
          <Pressable
            className="flex-row items-center justify-between rounded-xl bg-white text-sm p-4"
            onPress={() => handleSelectInterval('use')}
          >
            <UiText className="text-sm">Use for</UiText>
            <View className="flex-row items-center justify-center gap-x-3">
              <View className="items-center justify-center rounded-lg bg-primary/20 px-2 py-1">
                <UiText className="text-sm text-primary">
                  {currentScheduleItem.cyclicalInterval?.use || 0}
                </UiText>
              </View>
              <UiText className="text-sm">
                day{currentScheduleItem.cyclicalInterval?.use === 1 ? '' : 's'}
              </UiText>
            </View>
          </Pressable>
          <Pressable
            className="flex-row items-center justify-between rounded-xl bg-white text-sm p-4"
            onPress={() => handleSelectInterval('pause')}
          >
            <UiText className="text-sm">Pause for</UiText>
            <View className="flex-row items-center justify-center gap-x-3">
              <View className="items-center justify-center rounded-lg bg-primary/20 px-2 py-1">
                <UiText className="text-sm text-primary">
                  {currentScheduleItem.cyclicalInterval?.pause || 0}
                </UiText>
              </View>
              <UiText className="text-sm">
                day
                {currentScheduleItem.cyclicalInterval?.pause === 1 ? '' : 's'}
              </UiText>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
