import { View } from 'react-native';

import { UiText } from '@/ui/ui-text';

export function Feature({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <View className="flex-row items-center gap-x-3">
      <Icon />
      <View className="gap-y-1">
        <UiText className="text-sm font-medium">{title}</UiText>
        <UiText className="text-xs text-grayDark">{description}</UiText>
      </View>
    </View>
  );
}
