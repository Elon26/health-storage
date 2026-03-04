import { useLocalSearchParams } from 'expo-router';

import EditMedicationPage from '@/pages/edit-medication';

export default function EditAppointmentScreen() {
  const { medication } = useLocalSearchParams();

  return <EditMedicationPage medicationId={medication} />;
}
