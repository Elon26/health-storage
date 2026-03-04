import MedicalItemStatus from '@/types/medical-item-status';

export function checkCurrentIsTakenStatus(
  isTakenStatus: boolean | null,
  isMissed: boolean
) {
  return isTakenStatus === true
    ? MedicalItemStatus.taken
    : isTakenStatus === false
      ? MedicalItemStatus.notTaken
      : isMissed
        ? MedicalItemStatus.missed
        : MedicalItemStatus.upcoming;
}
