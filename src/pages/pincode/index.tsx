import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import {
  type ExpoWithPincodeType,
  PincodeInputField,
  PincodeScreen,
  PinpadButton,
  usePinInputState,
  usePinSettings,
} from 'expo-with-pincode';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { colors } from '@/config/theme';
import { useLayoutInsets } from '@/hooks/use-layout-insets';
import LockIcon from '@/svg/lock-big.svg';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import { hexa } from '@/utils/color';

/**
 * Authentication
 */
export function AuthScreen() {
  return <Screen mode="check" />;
}
/**
 * Setting (if not set) or changing pin
 */
export function SetPinScreen() {
  return <Screen mode="set-or-change" />;
}
/**
 * Resetting pin (without setting a new one)
 */
export function ResetPinScreen() {
  return <Screen mode="reset" />;
}

type ScreenProps = {
  mode: 'check' | 'set-or-change' | 'reset';
};

function Screen({ mode }: ScreenProps) {
  const { message, cursor, error, success } = usePinInputState();
  const { isPincodeSet, isBiometricsAvailable, isFaceIdEnabled } =
    usePinSettings();
  const insets = useLayoutInsets();
  const { logEvent } = useAnalytics();
  useEffect(() => {
    logEvent('pin_code');
  }, [logEvent]);

  let initialMode: 'reset' | 'create' | 'check';
  if (mode !== 'check') {
    initialMode = isPincodeSet ? 'reset' : 'create';
  } else {
    initialMode = 'check';
  }

  const [screenMode, setScreenMode] = useState<'reset' | 'create' | 'check'>(
    initialMode
  );

  const faceIdButtonEnabled =
    isBiometricsAvailable && isFaceIdEnabled && mode === 'check';
  const backspaceButtonEnabled = cursor > 0;

  return (
    <Page>
      <PageHeader pageName="Secure Folder" />
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <PincodeScreen
          className="flex-1 items-center justify-evenly"
          mode={screenMode}
          onSuccessfulResetPincode={() => {
            if (mode === 'set-or-change') {
              setScreenMode('create');
            } else {
              router.back();
            }
          }}
          onSuccessfulSetPincode={router.back}
        >
          <ScrollView
            className="-mt-5 pt-5"
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 0 }}
            contentContainerStyle={{
              paddingBottom: insets.bottom + scaleY(16),
            }}
          >
            <View className="items-center justify-center gap-y-4 mb-5">
              <LockIcon />
              <UiText
                className={twMerge(
                  'text-center text-xl font-semibold',
                  error ? 'text-red' : '',
                  success ? 'text-green' : ''
                )}
              >
                {message}
              </UiText>
              <PincodeInputField
                characterElement={Char}
                className="flex-row gap-2"
              />
            </View>
            <View className="flex-row flex-wrap items-center justify-center gap-1">
              {(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 'faceid', 0, 'backspace'] as const
              ).map((value) => (
                <PincodeButton
                  disabled={
                    (value === 'faceid' && !faceIdButtonEnabled) ||
                    (value === 'backspace' && !backspaceButtonEnabled)
                  }
                  key={value}
                  value={value}
                />
              ))}
            </View>
          </ScrollView>
        </PincodeScreen>
      </View>
    </Page>
  );
}

type PincodeButtonProps = {
  value: ExpoWithPincodeType.PinpadValue;
  disabled?: boolean;
};

function PincodeButton({ value, disabled = false }: PincodeButtonProps) {
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(hexa(colors.white, 0.05));
  const handlePressIn = () => {
    scale.value = withSpring(0.6);
    backgroundColor.value = withTiming(hexa(colors.primary, 0.3), {
      duration: 50,
    });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
    // eslint-disable-next-line react-compiler/react-compiler
    backgroundColor.value = withTiming(hexa(colors.white, 0.05));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    // transform: [{ scale: scale.value }],
    backgroundColor:
      value !== 'faceid' && value !== 'backspace'
        ? backgroundColor.value
        : 'transparent',
  }));

  return (
    <Animated.View
      className={twMerge(
        'rounded-3xl',
        value !== 'faceid' && value !== 'backspace'
          ? 'border-2 border-white/5'
          : '',
        disabled ? 'pointer-events-none opacity-0' : ''
      )}
      onTouchEnd={handlePressOut}
      onTouchStart={handlePressIn}
      style={[
        animatedStyle,
        {
          width: scaleX(88),
          height: scaleX(88),
        },
      ]}
    >
      <PinpadButton
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          borderRadius: 24,
          backgroundColor: colors.grayLight.toString(),
        }}
        value={value}
      >
        {value === 'backspace' && (
          <SfSymbol
            name="delete.left"
            size={scaleX(32)}
            tintColor={colors.primary.toString()}
          />
        )}
        {value === 'faceid' && (
          <SfSymbol
            name="faceid"
            size={scaleX(32)}
            tintColor={colors.primary.toString()}
          />
        )}
        {typeof value === 'number' && (
          <UiText className="text-2.5xl font-semibold">{value}</UiText>
        )}
      </PinpadButton>
    </Animated.View>
  );
}

type CharacterProps = {
  value?: number | null;
  index: number;
};

function Char({ value, index }: CharacterProps) {
  const { error, success, cursor } = usePinInputState();
  const tintColor = useSharedValue(colors.primary.toString());
  useEffect(() => {
    if (error) {
      tintColor.value = withTiming(colors.red.toString(), { duration: 200 });
    } else if (cursor === index || success) {
      tintColor.value = withTiming(colors.primary.toString(), {
        duration: 200,
      });
    } else {
      tintColor.value = withTiming(hexa(colors.white.toString(), 0.05), {
        duration: 200,
      });
    }
  }, [error, tintColor, success, cursor, index]);

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: tintColor.value,
  }));

  return (
    <Animated.View
      className="items-center justify-center rounded-2xl bg-grayLight size-16"
      style={animatedBorder}
    >
      {value !== null ? (
        <Animated.View
          className={twMerge(
            'items-center justify-center rounded-full size-4',
            error ? 'bg-red' : 'bg-primary'
          )}
        />
      ) : null}
    </Animated.View>
  );
}
