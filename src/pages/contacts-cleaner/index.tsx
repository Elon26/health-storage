import { useAnalytics } from '@kirz/expo-toolkit';
import { router } from 'expo-router';
import { type ComponentType, useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { usePermissionAlert } from '@/hooks/use-permission-alert';
import {
  useContactIds,
  useContactsIncomplete,
  useContactsSimilarByField,
} from '@/modules/contacts-kit/react';
import AllContactsIcon from '@/svg/all-contacts.svg';
import DuplicatesIcon from '@/svg/duplicates-contacts.svg';
import IncompleteIcon from '@/svg/incomplete-contacts.svg';
import { ChevronRight } from '@/ui/chevron';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiText } from '@/ui/ui-text';

export function ContactsCleaner() {
  usePermissionAlert(
    'ios.permission.CONTACTS',
    'Access to contacts is required to use this feature.'
  );
  const { logEvent } = useAnalytics();
  useEffect(() => {
    logEvent('contact_cleaner');
  }, [logEvent]);

  const { ids: allIds, status: allStatus } = useContactIds();
  const { idGroups, status } = useContactsSimilarByField('any');
  const { ids: incompleteIds, status: incompleteStatus } =
    useContactsIncomplete();

  const allCount = allIds.length;

  return (
    <Page>
      <PageHeader pageName="Contacts" />
      <View className="gap-3 pb-10">
        <CategoryItem
          count={idGroups.length}
          icon={DuplicatesIcon}
          isLoading={status === 'loading'}
          onPress={() => router.navigate('/contacts-cleaner-duplicates')}
          title="Duplicates Contacts"
        />

        <CategoryItem
          count={incompleteIds.length}
          icon={IncompleteIcon}
          isLoading={incompleteStatus === 'loading'}
          onPress={() => router.navigate('/contacts-cleaner-incomplete')}
          title="Incomplete Contacts"
        />

        <CategoryItem
          count={allCount}
          icon={AllContactsIcon}
          isLoading={allStatus === 'loading'}
          onPress={() => router.navigate('/contacts-cleaner-all')}
          title="All Contacts"
        />
      </View>
    </Page>
  );
}

type CategoryItemProps = {
  title: string;
  count: number;
  onPress: () => void;
  icon: ComponentType<SvgProps>;
  isLoading: boolean;
};

function CategoryItem({
  title,
  count,
  onPress,
  icon,
  isLoading,
}: CategoryItemProps) {
  const SvgIcon = icon as ComponentType<SvgProps>;

  return (
    <Pressable
      className="flex-row items-center rounded-2xl bg-white p-5"
      onPress={onPress}
    >
      <View
        className="items-center justify-center rounded-xl mr-3"
        style={{ width: 36, height: 36 }}
      >
        <SvgIcon height={20} width={20} />
      </View>

      <View className="flex-1">
        <UiText className="text-base font-medium">{title}</UiText>
      </View>

      <View className="flex-row items-center justify-between rounded-2xl bg-primary gap-x-1 px-3 py-2 w-18">
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <UiText className="flex-1 text-center text-xs font-medium text-white">
            {count}
          </UiText>
        )}
        <ChevronRight />
      </View>
    </Pressable>
  );
}
