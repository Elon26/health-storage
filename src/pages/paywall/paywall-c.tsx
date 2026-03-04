import { Env } from '@kirz/expo-env';
import {
  type IAPSubscription,
  useAnalytics,
  useLocale,
  usePnlight,
  usePurchases,
} from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/config/theme';
import { useConfig } from '@/hooks/use-config';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { usePaywall } from '@/hooks/use-paywall';
import { useWebViewModal } from '@/hooks/use-web-view-modal';
import PaywallStars from '@/images/paywall-stars.png';
import CloseIcon from '@/svg/close-big.svg';
import { Page } from '@/ui/page';
import { Pressable } from '@/ui/pressable';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

import { FeaturesArea } from './components/features-area';
import { TariffCheckboxes } from './components/tariff-checkboxes';

export function PaywallC() {
  const { antibot_enabled: isAntibotEnabled } = useConfig();
  const { validatePurchase } = usePnlight();
  const hasPremium = useHasPremiumWithBackdoor();
  const insets = useSafeAreaInsets();
  const { hidePaywall } = usePaywall();
  const { logEvent } = useAnalytics();
  const [cheaperSubscription, setCheaperSubscription] =
    useState<IAPSubscription | null>(null);
  const { subscriptions, restorePurchases, purchaseProduct } = usePurchases();
  const { openModal: openWebViewModal } = useWebViewModal();

  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<
    IAPSubscription | undefined
  >(undefined);

  useEffect(() => {
    if (subscriptions) {
      const res =
        subscriptions.find((x) => x.periodUnit === 'week') ||
        subscriptions.find((x) => x.trial);
      setSelectedSubscription(res ?? subscriptions[0]);
      setCheaperSubscription(
        subscriptions.sort((a, b) => a.price - b.price)[0]
      );
    }
  }, [subscriptions]);

  const { formatPrice, formatPeriod } = useLocale();

  const subscribeButtonLabel = useMemo(() => {
    if (selectedSubscription?.trial) {
      const trialPeriod = formatPeriod(
        selectedSubscription.trial.periodUnit,
        selectedSubscription.trial.numberOfPeriods
      );

      return `Start ${trialPeriod} Free Trial`;
    }

    if (selectedSubscription) {
      return `${formatPrice(selectedSubscription.price, selectedSubscription.currency)}/${formatPeriod(selectedSubscription.periodUnit, selectedSubscription.numberOfPeriods)}`;
    }
    return '';
  }, [formatPeriod, formatPrice, selectedSubscription]);

  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleSubscribe = useCallback(async () => {
    setIsPurchasing(true);

    await logEvent(
      `af_start_purchase*${selectedSubscription?.trial}_paywall_v_a`
    );
    if (hasPremium) {
      return;
    }
    if (selectedSubscription) {
      try {
        const isValid = isAntibotEnabled ? await validatePurchase() : true;
        if (!isValid) {
          throw new Error('Purchase failed');
        }

        const purchase = await purchaseProduct(selectedSubscription.id);
        if (!purchase?.transactionId) {
          throw new Error('Purchase failed');
        }
        hidePaywall();
      } catch {
        Alert.alert('Error', 'Purchase failed');
      }
    }
    setIsPurchasing(false);
  }, [
    hasPremium,
    selectedSubscription,
    purchaseProduct,
    hidePaywall,
    logEvent,
  ]);

  return (
    <Page>
      <TouchableOpacity
        className="absolute"
        style={{
          top: scaleY(16),
          right: scaleX(25),
          width: scaleX(24),
          height: scaleX(24),
          zIndex: 100,
        }}
        onPress={hidePaywall}
      >
        <CloseIcon />
      </TouchableOpacity>

      <ScrollView
        className="-mt-5 pt-5"
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
      >
        <View className="flex-row justify-center">
          <Image
            source={PaywallStars}
            style={{ width: scaleX(80), height: scaleX(80) }}
            contentFit="cover"
          />
        </View>
        <View className="gap-y-6">
          <View>
            <UiText className="text-center text-2xl font-semibold">
              Get unlimited access
            </UiText>
            <UiText className="text-center text-2xl font-semibold">
              to every feature available
            </UiText>
          </View>

          <FeaturesArea paywallName="c" />

          <TariffCheckboxes
            cheaperSubscription={cheaperSubscription}
            selectedSubscription={selectedSubscription}
            subscriptions={subscriptions}
            setSelectedSubscription={setSelectedSubscription}
          />

          <View>
            <UiText className="text-center text-sm">No Payment Due Now</UiText>
            <View className="items-center justify-center mb-5 mt-2.5">
              {isPurchasing ? (
                <ActivityIndicator
                  size="large"
                  color={colors.primary.toString()}
                />
              ) : (
                <UiButton disabled={isRestoring} onPress={handleSubscribe}>
                  <UiText className="font-semibold text-white">
                    {selectedSubscription?.trial
                      ? subscribeButtonLabel
                      : 'Continue'}
                  </UiText>
                </UiButton>
              )}
            </View>
            <View className="flex-row justify-between">
              <Pressable onPress={() => openWebViewModal(Env.TERMS_OF_USE)}>
                <UiText className="text-xs text-grayDark underline">
                  Terms of Use
                </UiText>
              </Pressable>
              <Pressable
                disabled={isPurchasing || isRestoring}
                onPress={async () => {
                  setIsRestoring(true);
                  const isRestored = await restorePurchases();
                  Alert.alert(
                    'Restore Purchases',
                    isRestored ? 'Purchases restored' : 'No purchases found'
                  );
                  setIsRestoring(false);
                }}
              >
                {isPurchasing || isRestoring ? (
                  <View className="items-center justify-center w-24">
                    <ActivityIndicator />
                  </View>
                ) : (
                  <UiText className="text-xs text-grayDark underline">
                    Restore purchase
                  </UiText>
                )}
              </Pressable>
              <Pressable onPress={() => openWebViewModal(Env.PRIVACY_POLICY)}>
                <UiText className="text-xs text-grayDark underline">
                  Privacy Policy
                </UiText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}
