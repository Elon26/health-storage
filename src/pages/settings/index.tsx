import { scaleY } from '@kirz/nativewind-scale';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';

import SettingsBanner from './components/settings-banner';
import SettingsItemsArea from './components/settings-items-area';

export default function SettingsPage() {
  const insets = useSafeAreaInsets();
  const hasPremium = useHasPremiumWithBackdoor();

  return (
    <Page>
      <PageHeader pageName="Settings" />
      <ScrollView
        className="-mt-5 pt-5"
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
      >
        {!hasPremium && <SettingsBanner />}
        <SettingsItemsArea />
      </ScrollView>
    </Page>
  );
}
