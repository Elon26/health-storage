import { View } from 'react-native';

import Appointment from '@/types/appointment';
import { UiText } from '@/ui/ui-text';

import AppointmentCard from './appointment-card';

type Props = {
  sortedAppointments: Appointment[];
};

export default function UpcomingAppointments({ sortedAppointments }: Props) {
  return (
    <View className="gap-y-2">
      <UiText className="text-sm color-grayDark">Upcoming Appointments</UiText>
      {sortedAppointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </View>
  );
}
