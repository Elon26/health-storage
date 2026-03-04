import { scaleX } from '@kirz/nativewind-scale';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ModalComponentProp } from 'react-native-modalfy';
import { twMerge } from 'tailwind-merge';

import { ModalStackParams } from '@/components/modals';
import ArrowLeftGreenIcon from '@/svg/arrow-left-green.svg';
import ArrowRightGreenIcon from '@/svg/arrow-right-green.svg';
import CalendarDate from '@/types/calendar-date';
import { UiText } from '@/ui/ui-text';

export default function CalendarModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'CalendarModal'>) {
  const { width } = useWindowDimensions();
  const close = () => params?.close();
  const setDate = (newDate: Date) => params?.setDate(newDate);
  const startDate = params?.startDate || new Date();

  const startDateYear = startDate.getFullYear();
  const startDateMonth = startDate.getMonth() + 1;
  const startDateDay = startDate.getDate();

  return (
    <View
      className="rounded-3xl bg-white p-2"
      style={{ width: width - scaleX(50) }}
    >
      <Calendar
        style={{ borderRadius: 24, overflow: 'hidden' }}
        current={
          startDateYear.toString() +
          '-' +
          startDateMonth.toString() +
          '-' +
          startDateDay
        }
        firstDay={1}
        theme={{
          textMonthFontWeight: 'bold',
          monthTextColor: '#23242B',
          arrowColor: '#23242B',
          textSectionTitleColor: '#23242B',
          textSectionTitleFontWeight: '700',
        }}
        dayComponent={({
          date,
          state,
        }: {
          date: CalendarDate;
          state: String;
        }) => {
          const today = new Date();
          const isToday =
            date.year === today.getFullYear() &&
            date.month === today.getMonth() + 1 &&
            date.day === today.getDate();
          const isSelectedDay =
            date.year === startDateYear &&
            date.month === startDateMonth &&
            date.day === startDateDay;

          return (
            <Pressable
              className={twMerge(
                'items-center justify-center rounded-full border gap-y-2.5 size-8',
                isToday ? 'bg-primary' : '',
                isSelectedDay ? 'border-primary' : 'border-white'
              )}
              onPress={() => {
                setDate(new Date(date.timestamp));
                close();
              }}
            >
              <UiText
                style={{
                  color:
                    state === 'disabled'
                      ? '#B9B9B9'
                      : isToday
                        ? 'white'
                        : 'black',
                }}
              >
                {date.day}
              </UiText>
            </Pressable>
          );
        }}
        renderArrow={(direction: string) => (
          <View className="items-center justify-center rounded-xl size-7">
            {direction === 'left' ? (
              <ArrowLeftGreenIcon />
            ) : (
              <ArrowRightGreenIcon />
            )}
          </View>
        )}
      />
    </View>
  );
}
