import { useLocalSearchParams } from 'expo-router';

import CreateAppointmentPage from '@/pages/create-appointment';

export default function CreateAppointmentScreen() {
  const { doctor } = useLocalSearchParams();

  return <CreateAppointmentPage doctorId={doctor} />;
}
