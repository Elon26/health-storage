import { Dispatch, SetStateAction } from 'react';
import { Pressable, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { twMerge } from 'tailwind-merge';

import { useStorageValue } from '@/hooks/use-storage';
import { useTodaysTimeBorders } from '@/hooks/use-todays-time-borders';
import ArrowLeftIcon from '@/svg/arrow-left.svg';
import ArrowRightIcon from '@/svg/arrow-right.svg';
import CalendarDate from '@/types/calendar-date';
import MedicalItemStatus from '@/types/medical-item-status';
import Medication from '@/types/medication';
import ReminderScheduleItem from '@/types/reminder-schedule-item';
import { UiText } from '@/ui/ui-text';

type Props = {
  selectedDay: Date;
  setSelectedDay: Dispatch<SetStateAction<Date>>;
};

export default function CustomCalendar({ selectedDay, setSelectedDay }: Props) {
  const { tomorrowMidnight } = useTodaysTimeBorders();
  const medications = useStorageValue('medications');

  function checkTotalTakenStatus(
    date: CalendarDate,
    medications: Medication[]
  ): MedicalItemStatus {
    const scheduleItems: ReminderScheduleItem[] = [];

    const startDayDate = new Date(
      date.year,
      date.month - 1,
      date.day
    ).getTime();
    const endDayDate = new Date(
      date.year,
      date.month - 1,
      date.day,
      23,
      59,
      59
    ).getTime();

    medications.forEach((medication) => {
      scheduleItems.push(
        ...medication.schedule.filter(
          (scheduleItem) =>
            scheduleItem.timestamp >= startDayDate &&
            scheduleItem.timestamp <= endDayDate
        )
      );
    });

    if (scheduleItems.length === 0) return MedicalItemStatus.empty;
    if (tomorrowMidnight <= startDayDate) return MedicalItemStatus.upcoming;

    return scheduleItems.every((item) => item.isTaken === true)
      ? MedicalItemStatus.taken
      : MedicalItemStatus.missed;
  }

  return (
    <Calendar
      current={
        selectedDay.getFullYear().toString() +
        '-' +
        (selectedDay.getMonth() + 1).toString() +
        '-' +
        selectedDay.getDate()
      }
      style={{ borderRadius: 24, overflow: 'hidden' }}
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
        state: string;
      }) => {
        const isSelectedDay =
          date.year === selectedDay.getFullYear() &&
          date.month === selectedDay.getMonth() + 1 &&
          date.day === selectedDay.getDate();
        const totalTakenStatus = checkTotalTakenStatus(date, medications);

        return (
          <Pressable
            className={twMerge(
              'items-center justify-center rounded-xl gap-y-2.5 h-12 w-10',
              isSelectedDay && 'bg-primary'
            )}
            onPress={() =>
              setSelectedDay(new Date(date.year, date.month - 1, date.day))
            }
          >
            <UiText
              style={{
                color:
                  state === 'disabled'
                    ? '#B9B9B9'
                    : isSelectedDay
                      ? 'white'
                      : 'black',
              }}
            >
              {date.day}
            </UiText>
            <View
              className={twMerge(
                'rounded-full size-1',
                isSelectedDay
                  ? totalTakenStatus === 'Empty'
                    ? 'bg-primary'
                    : 'bg-white'
                  : totalTakenStatus === 'Taken'
                    ? 'bg-primary'
                    : totalTakenStatus === 'Missed'
                      ? 'bg-red'
                      : totalTakenStatus === 'Upcoming'
                        ? 'bg-gray'
                        : 'bg-white'
              )}
            />
          </Pressable>
        );
      }}
      renderArrow={(direction: string) => (
        <View className="items-center justify-center rounded-xl bg-background size-7">
          {direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        </View>
      )}
    />
  );
}
