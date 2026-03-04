import { Env } from '@kirz/expo-env';
import { router } from 'expo-router';
import { requestReview } from 'expo-store-review';
import { Share } from 'react-native';

import SettingsItem from '../types/settings-item';

const settingsItems: SettingsItem[] = [
  {
    title: 'General Settings',
    subtitles: [
      {
        subtitle: 'Share the App',
        handler: () => {
          Share.share({
            message: `Try ${Env.APP_NAME}. Upload here - ${Env.APP_URL}`,
            url: Env.APP_URL,
            title: `Share ${Env.APP_NAME}`,
          });
        },
        link: null,
      },
      {
        subtitle: 'Privacy Policy',
        handler: null,
        link: Env.PRIVACY_POLICY,
      },
      {
        subtitle: 'Terms of Use',
        handler: null,
        link: Env.TERMS_OF_USE,
      },
      {
        subtitle: 'Rate Us',
        handler: requestReview,
        link: null,
      },
      {
        subtitle: 'Contact Us',
        handler: null,
        link: Env.CONTACT_US,
      },
    ],
  },
  {
    title: 'Medication Tracker',
    subtitles: [
      {
        subtitle: 'All Medications',
        handler: () => router.navigate('/medications'),
        link: null,
      },
    ],
  },
];

export default settingsItems;
