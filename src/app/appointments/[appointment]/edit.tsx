import { useLocalSearchParams } from 'expo-router';

import EditAppointmentPage from '@/pages/edit-appointment';

export default function EditAppointmentScreen() {
  const { appointment } = useLocalSearchParams();

  return <EditAppointmentPage appointmentId={appointment} />;
}
