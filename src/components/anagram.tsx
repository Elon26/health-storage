import type { RContact } from '@/modules/contacts-kit/react/types';
import { useState } from 'react';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { UiText } from '@/ui/ui-text';

type AnagramProps = {
  contact: RContact;
  className?: string;
};

export function Anagram({ contact, className }: AnagramProps) {
  const hasFirstAndLastName = contact.givenName && contact.familyName;
  const hasTwoWords = contact.givenName?.split(' ').length === 2;
  const hasFirstName = contact.givenName;

  const anagram = hasFirstAndLastName
    ? `${contact.givenName?.[0]}${contact.familyName?.[0]}`
    : hasTwoWords
      ? `${contact.givenName?.split(' ')[0][0]}${contact.givenName?.split(' ')[1][0]}`
      : `${(hasFirstName ?? 'U')[0]}`;

  const [fontSize, setFontSize] = useState(0);

  return (
    <View
      className={twMerge('items-center justify-center size-10 rounded-full bg-primary', className)}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setFontSize(width * 0.4);
      }}
    >
      <UiText className="uppercase text-center text-white" numberOfLines={1} style={{ fontSize }}>
        {anagram}
      </UiText>
    </View>
  );
}
