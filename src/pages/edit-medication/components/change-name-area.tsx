import { Dispatch, SetStateAction } from 'react';
import { TextInput, View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type Props = {
  medicationName: string;
  setMedicationName: Dispatch<SetStateAction<string>>;
};

export default function ChangeNameArea({
  medicationName,
  setMedicationName,
}: Props) {
  return (
    <View className="gap-y-2.5">
      <UiText className="text-xs font-medium text-grayDark">
        Medication Name*
      </UiText>
      <TextInput
        className="rounded-xl bg-white text-sm px-4 py-5"
        value={medicationName}
        onChangeText={setMedicationName}
        placeholder="Enter medication name"
      />
    </View>
  );
}
