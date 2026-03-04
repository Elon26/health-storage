import { scaleY } from '@kirz/nativewind-scale';
import { FlatList } from 'react-native';

import { EmptyList } from '@/components/empty-list';
import { useLayoutInsets } from '@/hooks/use-layout-insets';

import { ContactListItem } from './contact-list-item';

type ContactListViewProps = {
  data: string[];
  isContactSelected: (id: string) => boolean;
  handleContactSelect: (id: string) => void;
  refresh: () => void;
  isRefreshing: boolean;
  type: 'address-book' | 'private-contacts';
  selectionMode?: boolean;
};

export function FlatContactsListView({
  data,
  isContactSelected,
  handleContactSelect,
  refresh,
  isRefreshing,
  type = 'address-book',
  selectionMode = true,
}: ContactListViewProps) {
  const insets = useLayoutInsets();

  return (
    <FlatList
      alwaysBounceVertical={false}
      className="flex-1"
      contentContainerClassName="gap-3 pt-4 min-h-full"
      contentContainerStyle={{
        paddingBottom: insets.bottom + scaleY(10) + scaleY(64),
        paddingTop: insets.top + scaleY(10),
      }}
      data={data}
      keyExtractor={(id) => id}
      ListEmptyComponent={() => <EmptyList text="Nothing to clean here." />}
      onRefresh={refresh}
      progressViewOffset={insets.top}
      refreshing={isRefreshing}
      renderItem={({ item }) => (
        <ContactListItem
          className="rounded-2xl border border-white bg-white p-4"
          handleSelect={handleContactSelect}
          id={item}
          isSelected={isContactSelected(item)}
          selectionMode={selectionMode}
          type={type}
        />
      )}
    />
  );
}

export default FlatContactsListView;
