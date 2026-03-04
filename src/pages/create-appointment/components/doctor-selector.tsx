import { scaleY } from '@kirz/nativewind-scale';
import { useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useStorageValue } from '@/hooks/use-storage';
import ArrowDownIcon from '@/svg/arrow-down.svg';
import { UiText } from '@/ui/ui-text';

type Props = {
  selectedDoctorId: string;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  selectDoctor: (doctorId: string) => void;
};

export default function DoctorSelector({
  selectedDoctorId,
  isDropdownOpen,
  toggleDropdown,
  selectDoctor,
}: Props) {
  const doctors = useStorageValue('doctors');
  const sortedDoctors = doctors.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

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
      <UiText className="text-xs font-medium text-grayDark">Doctor</UiText>
      <View>
        <Pressable
          className="flex-row justify-between rounded-xl bg-white text-sm px-4 py-5"
          onPress={toggleDropdown}
        >
          {selectedDoctorId ? (
            <UiText className="text-sm">
              {sortedDoctors.find((doctor) => doctor.id === selectedDoctorId)
                ?.name || 'Unknown Doctor'}
            </UiText>
          ) : (
            <UiText className="text-sm text-grayDark">
              Select Your Doctor
            </UiText>
          )}
          <ArrowDownIcon />
        </Pressable>
        {isDropdownOpen && (
          <Animated.View
            className="absolute z-10 rounded-xl bg-white p-2 top-16 w-full"
            style={[{ boxShadow: '0px 5px 5px gray' }, animatedStyle]}
          >
            {sortedDoctors.length ? (
              <ScrollView style={{ maxHeight: scaleY(180) }}>
                {sortedDoctors.map((doctor) => (
                  <Pressable
                    key={doctor.id}
                    onPress={() => selectDoctor(doctor.id)}
                  >
                    <UiText className="text-sm p-2">{doctor.name}</UiText>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <UiText className="text-sm p-2">
                You haven't added any doctors yet
              </UiText>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}
