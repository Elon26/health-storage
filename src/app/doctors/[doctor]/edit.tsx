import { useLocalSearchParams } from 'expo-router';

import EditDoctorPage from '@/pages/edit-doctor';

export default function EditAppointmentScreen() {
  const { doctor } = useLocalSearchParams();

  return <EditDoctorPage doctorId={doctor} />;
}
