import { useLocalSearchParams } from 'expo-router';

import DoctorPage from '@/pages/doctor';

export default function GalleryCleanerAlbumScreen() {
  const { doctor } = useLocalSearchParams();

  return <DoctorPage doctorId={doctor} />;
}
