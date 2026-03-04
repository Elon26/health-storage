import { router } from 'expo-router';

import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { isToday, isTomorrow } from '@/utils/date-compare';

type Props = {
  appointmentId: string;
  appointmentDate: Date;
};

export default function DoctorAppointmentCard({
  appointmentId,
  appointmentDate,
}: Props) {
  return (
    <Pressable
      className="rounded-xl bg-primary/20 p-3"
      onPress={() =>
        router.navigate({
          pathname: '/appointments/[appointment]',
          params: {
            appointment: appointmentId,
          },
        })
      }
    >
      <UiText className="text-center text-sm font-medium">
        {`${isToday(appointmentDate) === true ? 'Today, ' : ''}`}
        {`${isTomorrow(appointmentDate) === true ? 'Tomorrow, ' : ''}`}
        {appointmentDate.toLocaleString('en-EN', {
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </UiText>
    </Pressable>
  );
}
