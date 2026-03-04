import { IAPSubscription, useLocale, usePurchases } from '@kirz/expo-toolkit';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function TariffCheckboxes({
  selectedSubscription,
  subscriptions,
  setSelectedSubscription,
  cheaperSubscription,
}: {
  selectedSubscription: IAPSubscription | undefined;
  cheaperSubscription: IAPSubscription | null;
  subscriptions: IAPSubscription[] | undefined;
  setSelectedSubscription: (subscription: IAPSubscription) => void;
}) {
  const { computeSubscriptionDiscount } = usePurchases();
  const { formatPrice } = useLocale();

  return (
    <View className="rounded-3xl gap-y-4">
      {subscriptions?.map((subscription) => {
        const discount = cheaperSubscription
          ? computeSubscriptionDiscount(subscription, cheaperSubscription)
          : 0;
        const isSelected = subscription.id === selectedSubscription?.id;

        return (
          <Pressable
            key={subscription.id}
            className={twMerge(
              'flex-row items-center justify-between rounded-2xl border-2 bg-white gap-x-4 p-5',
              isSelected
                ? 'border-primary bg-primary/30'
                : 'border-white bg-white'
            )}
            onPress={() => setSelectedSubscription(subscription)}
          >
            {subscription.periodUnit === 'quarter' && (
              <UiText
                className={twMerge(
                  'absolute rounded-2xl text-xs font-semibold text-white right-2 px-2 -top-3 py-1',
                  isSelected ? 'bg-primary' : 'bg-gray'
                )}
              >
                30% OFF
              </UiText>
            )}
            <UiText className="capitalize">{subscription.periodUnit}</UiText>
            <View className="flex-row items-center gap-x-2">
              {discount !== 0 && cheaperSubscription ? (
                <UiText className="text-xs text-gray line-through">
                  {subscription.currency === 'USD'
                    ? '$' +
                      Math.round(cheaperSubscription.price * 12 * 100) / 100
                    : formatPrice(
                        cheaperSubscription.price * 12,
                        subscription.currency
                      )}
                </UiText>
              ) : null}
              <UiText className="text-center text-sm">
                {subscription.currency === 'USD'
                  ? '$' + Math.round(subscription.price * 100) / 100
                  : `${formatPrice(subscription.price, subscription.currency)}`}
              </UiText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
