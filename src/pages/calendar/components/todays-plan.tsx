import { useEffect, useState } from 'react';
import { View } from 'react-native';

import medicalUnitIcons from '@/config/constants/medical-unit-icons';
import medicalUnits from '@/config/constants/medical-units';
import { useStorageValue } from '@/hooks/use-storage';
import DoctorImage from '@/images/doctor.png';
import { checkCurrentIsTakenStatus } from '@/pages/main-pill-reminder/utils/check-current-is-taken-status';
import { getTodaysMedications } from '@/pages/main-pill-reminder/utils/get-todays-medications';
import MedicalItemStatus from '@/types/medical-item-status';
import SpecificTimeMedication from '@/types/specific-time-medication';
import TodaysPlanItem from '@/types/todays-plan-item';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import TodaysPlanItemComp from './todays-plan-item-comp';

type Props = {
  selectedDay: Date;
};

export default function TodaysPlan({ selectedDay }: Props) {
  const medications = useStorageValue('medications');
  const appointments = useStorageValue('appointments');
  const doctors = useStorageValue('doctors');

  const [todaysPlanItems, setTodaysPlanItems] = useState<TodaysPlanItem[]>([]);

  function getsSelectedDayItems(selectedDay: Date) {
    const selectedDayMidnight = new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate()
    ).getTime();
    const selectedSecondDayMidnight = new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate() + 1
    ).getTime();

    const todaysMedications: SpecificTimeMedication[] = [
      ...getTodaysMedications(
        medications,
        selectedDayMidnight,
        selectedSecondDayMidnight
      ),
    ];

    const todaysAppointments = appointments.filter(
      (appointment) =>
        appointment.date >= selectedDayMidnight &&
        appointment.date < selectedSecondDayMidnight
    );

    const todaysMedicationsItems: TodaysPlanItem[] = todaysMedications.map(
      (todayMedication) => {
        const currentIcon = medicalUnitIcons.find(
          (icon) => todayMedication.icon === icon.name
        );
        const currentUnit = medicalUnits.find(
          (unit) => todayMedication.unit === unit.name
        );
        const isMissed = todayMedication.schedule.timestamp < Date.now();
        const currentStatus = checkCurrentIsTakenStatus(
          todayMedication.schedule.isTaken,
          isMissed
        );

        return {
          id: uuid(),
          icon: currentIcon?.image || medicalUnitIcons[0].image,
          title: todayMedication.name,
          subtitle: `${todayMedication.dose} ${currentUnit?.label || medicalUnits[0].label}`,
          timestamp: todayMedication.schedule.timestamp,
          time: new Date(todayMedication.schedule.timestamp).toLocaleTimeString(
            'en-EN',
            { hour12: false, hour: '2-digit', minute: '2-digit' }
          ),
          status: currentStatus,
          isMedication: true,
        };
      }
    );

    const todaysAppointmentsItems: TodaysPlanItem[] = todaysAppointments.map(
      (appointment) => {
        const doctor = doctors.find(
          (doctor) => doctor.id === appointment.doctorId
        );

        return {
          id: uuid(),
          icon: DoctorImage,
          title: doctor ? doctor.name : appointment.title,
          subtitle: doctor ? appointment.title : null,
          timestamp: appointment.date,
          time: new Date(appointment.date).toLocaleTimeString('en-EN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: MedicalItemStatus.empty,
          isMedication: false,
        };
      }
    );

    const todaysPlanItemsToSet = [
      ...todaysMedicationsItems,
      ...todaysAppointmentsItems,
    ];

    todaysPlanItemsToSet.sort((a, b) => a.timestamp - b.timestamp);

    setTodaysPlanItems(todaysPlanItemsToSet);
  }

  useEffect(() => {
    getsSelectedDayItems(selectedDay);
  }, [selectedDay]);

  return (
    <View className="gap-y-4">
      <UiText className="text-xl font-semibold">
        The plan for selected day
      </UiText>
      <View className="gap-y-2">
        {todaysPlanItems.length > 0 ? (
          todaysPlanItems.map((todaysPlanItem) => (
            <TodaysPlanItemComp
              key={todaysPlanItem.id}
              todaysPlanItem={todaysPlanItem}
            />
          ))
        ) : (
          <UiText>There are no appointments for selected day</UiText>
        )}
      </View>
    </View>
  );
}
