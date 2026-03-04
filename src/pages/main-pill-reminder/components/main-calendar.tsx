import { router } from 'expo-router';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import CalendarIcon from '@/svg/calendar.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export default function MainCalendar() {
  const today = new Date();
  const days = [];
  for (let i = -2; i <= 3; i++) {
    days.push(new Date(today.getTime() + 24 * 3600 * 1000 * i));
  }

  return (
    <View className="gap-y-4">
      <View className="flex-row items-center justify-between">
        <UiText className="font-medium">
          {today.toLocaleDateString('en-EN', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </UiText>
        <Pressable
          className="items-center justify-center rounded-xl border border-gray bg-white size-9"
          onPress={() => router.navigate('/calendar')}
        >
          <CalendarIcon />
        </Pressable>
      </View>
      <View className="flex-row justify-between">
        {days.map((day, index) => (
          <View
            key={day.toString()}
            className={twMerge(
              'items-center justify-center rounded-2xl gap-y-2 h-16 w-12',
              index === 2 ? 'bg-primary' : 'bg-white'
            )}
          >
            <UiText
              className={twMerge(
                'text-xs font-medium',
                index === 2 && 'color-white'
              )}
            >
              {day.toLocaleDateString('en-EN', {
                weekday: 'short',
              })}
            </UiText>
            <UiText
              className={twMerge('font-bold', index === 2 && 'color-white')}
            >
              {day.toLocaleDateString('en-EN', {
                day: 'numeric',
              })}
            </UiText>
          </View>
        ))}
      </View>
    </View>
  );
}
