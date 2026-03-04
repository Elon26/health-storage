import { View } from 'react-native';

import Doctor from '@/types/doctor';
import { UiText } from '@/ui/ui-text';

import DoctorCard from './doctor-card';

type Props = {
  sortedDoctors: Doctor[];
};

export default function YourDoctors({ sortedDoctors }: Props) {
  return (
    <View className="gap-y-2">
      <UiText className="text-sm color-grayDark">Your Doctors</UiText>
      {sortedDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </View>
  );
}
