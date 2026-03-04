import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Weekday from '@/types/weekday';
import { Pressable } from '@/ui/pressable';

type Props = {
  isSelected: boolean;
  weekday: Weekday;
  toggleWeekdaySelection: (weekday: Weekday, isSelected: boolean) => void;
};

export function CustomWeekdayItem({
  isSelected,
  weekday,
  toggleWeekdaySelection,
}: Props) {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#F0F0F0', '#00D0C6']
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(progress.value, [0, 1], ['#23242B', '#ffffff']),
    };
  });

  return (
    <Pressable onPress={() => toggleWeekdaySelection(weekday, isSelected)}>
      <Animated.View
        className="items-center justify-center rounded-full size-9"
        style={animatedStyle}
      >
        <Animated.Text style={animatedTextStyle} className="font-medium">
          {weekday[0]}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
