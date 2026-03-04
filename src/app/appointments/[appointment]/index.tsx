import { useLocalSearchParams } from 'expo-router';

import AppointmentPage from '@/pages/appointment';

export default function GalleryCleanerAlbumScreen() {
  const { appointment } = useLocalSearchParams();

  return <AppointmentPage appointmentId={appointment} />;
}
