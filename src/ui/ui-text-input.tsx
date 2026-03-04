import { TextInput, type TextInputProps, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { UiText } from './ui-text';

type InputProps = {
  label: string;
  inputSuffix?: string;
  inputPrefix?: string;
} & TextInputProps;

export function UiTextInput({
  label,
  placeholder,
  inputPrefix,
  inputSuffix,
  className,
  ...rest
}: InputProps) {
  return (
    <View className="gap-0.5 px-4 py-2.5 bg-gray rounded-2xl">
      <UiText className="text-sm">{label}</UiText>
      <View className="flex-row">
        {inputPrefix && <UiText className="text-text">{inputPrefix}</UiText>}
        <TextInput
          className={twMerge('text-text flex-1', 'placeholder:text-text/50', className)}
          placeholder={placeholder}
          {...rest}
        />
        {inputSuffix && <UiText className="text-text">{inputSuffix}</UiText>}
      </View>
    </View>
  );
}
