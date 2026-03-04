import { useLocalSearchParams } from 'expo-router';

import MedicationPage from '@/pages/medication';

export default function GalleryCleanerAlbumScreen() {
  const { medication } = useLocalSearchParams();

  return <MedicationPage medicationId={medication} />;
}
