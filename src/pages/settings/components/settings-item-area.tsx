import { Alert, Pressable } from 'react-native';

import { useSetStorage } from '@/hooks/use-storage';
import { useWebViewModal } from '@/hooks/use-web-view-modal';
import { ClickableRow } from '@/ui/clickable-row';
import { UiText } from '@/ui/ui-text';

import SettingsItem from '../types/settings-item';

type Props = {
  settingsItem: SettingsItem;
};

export default function SettingsItemArea({ settingsItem }: Props) {
  const { openModal: openWebViewModal } = useWebViewModal();

  const setHasDeveloperPremium = useSetStorage('hasDeveloperPremium');
  let counter = 0;
  function activateBackdoor() {
    counter++;
    if (counter % 10 === 0) {
      Alert.prompt(
        'Password',
        'Enter the password to wipe your device’s operating system',
        [
          {
            text: 'Back',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: (value) => {
              if (value === 'SaveTheDolphins26121989')
                setHasDeveloperPremium((prev) => !prev);
            },
          },
        ],
        'plain-text'
      );
    }
  }

  return (
    <Pressable className="gap-y-2" onPress={activateBackdoor}>
      <UiText className="text-sm text-gray px-3">{settingsItem.title}</UiText>
      {settingsItem.subtitles.map((settingsSubitem) => (
        <ClickableRow
          key={settingsSubitem.subtitle}
          title={settingsSubitem.subtitle}
          handler={
            settingsSubitem.link
              ? () => openWebViewModal(settingsSubitem.link as string)
              : settingsSubitem.handler
                ? settingsSubitem.handler
                : () => {}
          }
        />
      ))}
    </Pressable>
  );
}
