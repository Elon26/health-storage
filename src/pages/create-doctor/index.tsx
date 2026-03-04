import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSetStorage } from '@/hooks/use-storage';
import Doctor from '@/types/doctor';
import { Page } from '@/ui/page';
import { PageHeader } from '@/ui/page-header';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

export default function CreateDoctorPage() {
  const insets = useSafeAreaInsets();
  const setDoctors = useSetStorage('doctors');

  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  function saveDoctor() {
    if (!name) {
      Alert.alert('Missing information', 'Please enter Doctor’s Name');
      return;
    }

    if (!specialty) {
      Alert.alert(
        'Missing information',
        'Please enter Doctor’s Medical Specialty'
      );
      return;
    }

    const newDoctor: Doctor = {
      id: uuid(),
      name,
      specialty,
      address,
      phone,
      email,
      website,
    };

    setDoctors((prev) => {
      prev.push(newDoctor);
      return prev;
    });

    router.back();
  }

  return (
    <Page>
      <PageHeader pageName="Add Doctor" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + scaleY(16),
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-y-3">
          <View className="gap-y-2">
            <UiText className="text-xs font-medium text-grayDark">
              Doctor*
            </UiText>
            <TextInput
              className="rounded-xl bg-white text-sm px-4 py-5"
              value={name}
              onChangeText={setName}
              placeholder="Enter doctor's name"
              autoFocus
            />
          </View>
          <View className="gap-y-2">
            <UiText className="text-xs font-medium text-grayDark">
              Medical specialty*
            </UiText>
            <TextInput
              className="rounded-xl bg-white text-sm px-4 py-5"
              value={specialty}
              onChangeText={setSpecialty}
              placeholder="Enter the doctor's medical specialty"
            />
          </View>
          <View className="gap-y-2">
            <UiText className="text-xs font-medium text-grayDark">
              Address
            </UiText>
            <TextInput
              className="rounded-xl bg-white text-sm px-4 py-5"
              value={address}
              onChangeText={setAddress}
              placeholder="Enter clinic address (street, city)"
            />
          </View>
          <View className="gap-y-2">
            <UiText className="text-xs font-medium text-grayDark">
              Phone number
            </UiText>
            <TextInput
              className="rounded-xl bg-white text-sm px-4 py-5"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
            />
          </View>
          <View className="gap-y-2">
            <UiText className="text-xs font-medium text-grayDark">Email</UiText>
            <TextInput
              className="rounded-xl bg-white text-sm px-4 py-5"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
            />
          </View>
          <View className="gap-y-2">
            <UiText className="text-xs font-medium text-grayDark">
              Website
            </UiText>
            <TextInput
              className="rounded-xl bg-white text-sm px-4 py-5"
              value={website}
              onChangeText={setWebsite}
              placeholder="Enter website URL"
            />
          </View>
          <View className="items-center justify-center mt-6">
            <UiButton onPress={saveDoctor}>
              <UiText className="text-white">Save</UiText>
            </UiButton>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}
