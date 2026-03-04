import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { shadows } from '@/config/theme';
import { UiText } from '@/ui/ui-text';

type TabBtnProps = {
  title: string;
  onPress: () => void;
  active?: boolean;
};

export function TabButton({ title, onPress, active }: TabBtnProps) {
  return (
    <TouchableOpacity
      className={twMerge(
        'px-3 h-9 rounded-lg items-center justify-center',
        active ? 'bg-primary' : 'bg-white'
      )}
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={shadows.sm}
    >
      <UiText className={twMerge('font-medium', active ? 'text-white' : '')}>{title}</UiText>
    </TouchableOpacity>
  );
}
