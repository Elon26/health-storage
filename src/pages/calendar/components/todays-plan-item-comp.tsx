import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import MedicalItemStatus from '@/types/medical-item-status';
import TodaysPlanItem from '@/types/todays-plan-item';
import { UiText } from '@/ui/ui-text';

type Props = {
  todaysPlanItem: TodaysPlanItem;
};

export default function TodaysPlanItemComp({ todaysPlanItem }: Props) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-white gap-x-2 p-5">
      <View className="flex-1 flex-row items-center gap-x-3">
        <View className="items-center justify-center rounded-2xl bg-primary/20 size-12">
          <Image
            source={todaysPlanItem.icon}
            style={{
              width: scaleY(todaysPlanItem.isMedication ? 32 : 48),
              height: scaleY(todaysPlanItem.isMedication ? 32 : 48),
            }}
            contentFit="contain"
          />
        </View>
        <View className="flex-1 gap-y-1">
          <UiText className="text-sm font-semibold" numberOfLines={1}>
            {todaysPlanItem.title}
          </UiText>
          {todaysPlanItem.subtitle && (
            <UiText className="text-xs text-grayDark" numberOfLines={1}>
              {todaysPlanItem.subtitle}
            </UiText>
          )}
        </View>
      </View>
      <View className="gap-y-1">
        <UiText className="text-right text-sm font-semibold">
          {todaysPlanItem.time}
        </UiText>
        {todaysPlanItem.status !== MedicalItemStatus.empty && (
          <UiText
            className={twMerge(
              'rounded-2xl text-right text-2xs font-semibold px-1.5 py-1',
              todaysPlanItem.status === MedicalItemStatus.taken &&
                'bg-primary/20 text-primary',
              (todaysPlanItem.status === MedicalItemStatus.notTaken ||
                todaysPlanItem.status === MedicalItemStatus.missed) &&
                'bg-red/20 text-red',
              todaysPlanItem.status === MedicalItemStatus.upcoming &&
                'bg-grayDark/20 text-grayDark'
            )}
          >
            {todaysPlanItem.status}
          </UiText>
        )}
      </View>
    </View>
  );
}
