import { scaleY } from '@kirz/nativewind-scale';
import { Dispatch, SetStateAction } from 'react';
import { TextInput, View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type Props = {
  note: string;
  setNote: Dispatch<SetStateAction<string>>;
};

export default function NoteTextArea({ note, setNote }: Props) {
  return (
    <View className="gap-y-2">
      <UiText className="text-xs font-medium text-grayDark">
        Optional note
      </UiText>
      <TextInput
        className="rounded-xl bg-white text-sm px-4 py-5"
        style={{ height: scaleY(128) }}
        multiline={true}
        value={note}
        onChangeText={setNote}
        placeholder="Type your note here..."
      />
    </View>
  );
}
