import Appointment from '@/types/appointment';
import Doctor from '@/types/doctor';
import Medication from '@/types/medication';
import RestoreReminderItem from '@/types/notification-reminder-item';

/**
 * The initial state of the storage.
 *
 * @warning
 * All keys must be defined. Use `null` for `undefined` values.
 */
export const initialStorageState = {
  isOnboardingFinished: false,
  isNotificationRegistered: false,
  doctors: [] as Doctor[],
  appointments: [] as Appointment[],
  medications: [] as Medication[],
  todaysProgress: 0,
  secretFolderModalIsShown: false,
  restoreReminder: [] as RestoreReminderItem[],
  introductoryPaywallShown: false,
  hasDeveloperPremium: false,
  galleryDeletionLimit: 3,
  contactsDeletionLimit: 3,
  secretFolderLimit: 5,
  isPhotosPermissionAsked: false,
  isContactsPermissionAsked: false,
};

export type Storage = typeof initialStorageState;
