import { Dispatch, SetStateAction } from 'react';
import { TextInput, View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type Props = {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
};

export default function AppointmentTitleArea({ title, setTitle }: Props) {
  return (
    <View className="gap-y-2">
      <UiText className="text-xs font-medium text-grayDark">
        Appointment title*
      </UiText>
      <TextInput
        className="rounded-xl bg-white text-sm px-4 py-5"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter appointment title"
        autoFocus
      />
    </View>
  );
}
