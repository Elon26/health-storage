import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { ActionSheetIOS, Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

import { useStorage } from '@/hooks/use-storage';
import CallIcon from '@/svg/call.svg';
import LocationIcon from '@/svg/location.svg';
import MailIcon from '@/svg/mail.svg';
import PlanetIcon from '@/svg/planet.svg';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { Pressable } from '@/ui/pressable';
import { Separator } from '@/ui/separator';

import DoctorHeader from './components/doctor-header';
import DoctorSimpleArea from './components/doctor-simple-area';
import DoctorUpcomingAppointments from './components/doctor-upcoming-appointments';

type Props = {
  doctorId: string | string[];
};

export default function DoctorPage({ doctorId }: Props) {
  const insets = useSafeAreaInsets();
  const [doctors, setDoctors] = useStorage('doctors');

  const doctor = doctors.find((doctor) => doctor.id === doctorId);

  function handlePress() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Edit', 'Delete', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          Alert.alert(
            'Delete this doctor?',
            'The doctor will be removed from your list.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  setDoctors((prev) => {
                    return prev.filter((item) => item.id !== doctorId);
                  });
                  router.back();
                },
              },
            ]
          );
        } else if (buttonIndex === 0) {
          router.navigate({
            pathname: '/doctors/[doctor]/edit',
            params: {
              doctor: doctorId.toString(),
            },
          });
        }
      }
    );
  }

  return (
    <Page>
      <PageHeader pageName="Doctor profile">
        <Pressable
          className="flex-row items-center justify-center rounded-xl bg-white gap-x-0.5 size-10"
          onPress={handlePress}
        >
          <View className="rounded-full bg-black size-1" />
          <View className="rounded-full bg-black size-1" />
          <View className="rounded-full bg-black size-1" />
        </Pressable>
      </PageHeader>
      <ScrollView
        className="-mt-5 pt-5"
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + scaleY(16) }}
      >
        <View className="gap-y-5">
          <View className="rounded-xl bg-white gap-y-4 py-5">
            <DoctorHeader
              doctorName={doctor?.name || 'Unknown doctor'}
              doctorSpecialty={doctor?.specialty || 'Unknown doctor'}
            />
            <View
              className={twMerge('gap-y-5', doctor?.address ? '' : 'hidden')}
            >
              <Separator />
              <DoctorSimpleArea
                Icon={LocationIcon}
                fieldValue={doctor?.address || ''}
              />
            </View>
            <View className={twMerge('gap-y-5', doctor?.phone ? '' : 'hidden')}>
              <Separator />
              <DoctorSimpleArea
                Icon={CallIcon}
                fieldValue={doctor?.phone || ''}
              />
            </View>
            <View className={twMerge('gap-y-5', doctor?.email ? '' : 'hidden')}>
              <Separator />
              <DoctorSimpleArea
                Icon={MailIcon}
                fieldValue={doctor?.email || ''}
              />
            </View>
            <View
              className={twMerge('gap-y-5', doctor?.website ? '' : 'hidden')}
            >
              <Separator />
              <DoctorSimpleArea
                Icon={PlanetIcon}
                fieldValue={doctor?.website || ''}
              />
            </View>
          </View>
          <DoctorUpcomingAppointments
            doctorId={doctor?.id || ''}
            doctorName={doctor?.name || ''}
            doctorSpecialty={doctor?.specialty || ''}
          />
        </View>
      </ScrollView>
    </Page>
  );
}
