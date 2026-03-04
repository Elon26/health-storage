import type { PropsWithChildren } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { UiText } from './ui-text';

export type ButtonPrimaryProps = {
  onPress?: () => void;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  disabledLabel?: string;
  className?: string;
  color?: string;
  loading?: boolean;
  style?: TouchableOpacityProps['style'];
  gradient?: boolean;
} & PropsWithChildren;

export function ButtonPrimary({
  onPress,
  disabled,
  label,
  labelClassName,
  className,
  children = null,
  loading,
  style,
  gradient = true,
}: ButtonPrimaryProps) {
  return (
    <TouchableOpacity
      className={twMerge(
        'h-13 justify-center items-center rounded-2xl overflow-hidden',
        disabled ? 'opacity-50' : 'opacity-100',
        className
      )}
      disabled={disabled}
      onPress={onPress}
      style={style}
    >
      {gradient && (
        <LinearGradient
          className="absolute inset-0"
          colors={['#56A5FF', '#7C1CE3']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        />
      )}
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          {label && (
            <UiText className={twMerge('text-base font-semibold text-white', labelClassName)}>
              {label}
            </UiText>
          )}
          {children}
        </>
      )}
    </TouchableOpacity>
  );
}
