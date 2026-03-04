import { scaleX } from '@kirz/nativewind-scale';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { SfSymbol } from '@/ui/sf-symbol';

type Props = {
  currentStatus: 'Taken' | 'Not taken' | 'Missed' | 'Upcoming';
};

export function MedicationCheckbox({ currentStatus }: Props) {
  return (
    <View
      className={twMerge(
        'rounded-lg border-2 size-7',
        currentStatus === 'Taken'
          ? 'border-primary'
          : currentStatus === 'Upcoming'
            ? 'border-gray'
            : 'border-red'
      )}
    >
      <View className="size-6">
        {currentStatus === 'Taken' && (
          <View className="absolute items-center justify-center rounded-sm bg-primary inset-0 size-6">
            <SfSymbol
              name="checkmark"
              type="monochrome"
              tintColor="#ffffff"
              size={scaleX(18)}
              weight="semibold"
            />
          </View>
        )}

        {currentStatus === 'Not taken' && (
          <View className="absolute items-center justify-center rounded-sm bg-red inset-0 size-6">
            <SfSymbol
              name="xmark"
              type="monochrome"
              tintColor="#ffffff"
              size={scaleX(18)}
              weight="semibold"
            />
          </View>
        )}
      </View>
    </View>
  );
}
