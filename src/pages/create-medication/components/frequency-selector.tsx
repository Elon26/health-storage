import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import frequencyObjects from '@/config/constants/frequency';
import ArrowDownIcon from '@/svg/arrow-down.svg';
import Frequency from '@/types/frequency';
import { Separator } from '@/ui/separator';
import { UiText } from '@/ui/ui-text';

type Props = {
  frequency: Frequency;
  setFrequency: (freq: Frequency) => void;
};

export default function FrequencySelector({ frequency, setFrequency }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentFrequency = frequencyObjects[frequency].label;

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (isDropdownOpen) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [isDropdownOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="gap-y-2">
      <UiText className="text-xs font-medium text-grayDark">Frequency</UiText>
      <View>
        <Pressable
          className="flex-row justify-between rounded-xl bg-white text-sm px-4 py-5"
          onPress={() => setIsDropdownOpen((prev) => !prev)}
        >
          <UiText className="text-sm">{currentFrequency}</UiText>
          <ArrowDownIcon />
        </Pressable>
        {isDropdownOpen && (
          <Animated.View
            className="absolute z-10 rounded-xl bg-white top-16 w-full"
            style={[{ boxShadow: '0px 5px 5px gray' }, animatedStyle]}
          >
            {Object.values(frequencyObjects).map((frequencyObject, index) => (
              <Pressable
                key={frequencyObject.name}
                onPress={() => {
                  setFrequency(frequencyObject.name);
                  setIsDropdownOpen(false);
                }}
              >
                {index !== 0 && <Separator />}
                <UiText className="text-center py-3.5">
                  {frequencyObject.label}
                </UiText>
              </Pressable>
            ))}
          </Animated.View>
        )}
      </View>
    </View>
  );
}
