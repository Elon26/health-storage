import { View } from 'react-native';

import settingsItems from '../constants/settings-items';
import SettingsItemArea from './settings-item-area';

export default function SettingsItemsArea() {
  return (
    <View className="gap-y-6 my-6">
      {settingsItems.map((settingsItem) => (
        <SettingsItemArea
          key={settingsItem.title}
          settingsItem={settingsItem}
        />
      ))}
    </View>
  );
}
