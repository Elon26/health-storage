import { Button, ContextMenu } from '@expo/ui/swift-ui';
import { SfSymbol } from '@/ui/sf-symbol';

type HeaderMenuProps = {
  selectAllContacts: () => void;
  deselectAllContacts: () => void;
  isAllSelected: boolean;
};

export function HeaderMenu({
  selectAllContacts,
  deselectAllContacts,
  isAllSelected,
}: HeaderMenuProps) {
  return (
    <ContextMenu>
      <ContextMenu.Items>
        {isAllSelected ? (
          <Button onPress={deselectAllContacts} systemImage="checklist.unchecked">
            Uncheck all
          </Button>
        ) : (
          <Button onPress={selectAllContacts} systemImage="checklist.checked">
            Check all
          </Button>
        )}
      </ContextMenu.Items>
      <ContextMenu.Trigger>
        <SfSymbol name="ellipsis" weight="bold" />
      </ContextMenu.Trigger>
    </ContextMenu>
  );
}
