import { View } from 'react-native';

import {
  featuresForPaywallA,
  featuresForPaywallB,
} from '../constants/features';
import { Feature } from './feature';

type Props = {
  paywallName: 'a' | 'b' | 'c';
};

export function FeaturesArea({ paywallName }: Props) {
  const featuresToRender =
    paywallName === 'a' ? featuresForPaywallA : featuresForPaywallB;

  return (
    <View className="rounded-2xl bg-white gap-y-5 p-6">
      {featuresToRender.map((feature) => (
        <Feature
          key={feature.title}
          title={feature.title}
          description={feature.description}
          Icon={feature.icon as React.FC<React.SVGProps<SVGSVGElement>>}
        />
      ))}
    </View>
  );
}
