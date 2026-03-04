import MedicalItemStatus from './medical-item-status';

type TodaysPlanItem = {
  id: string;
  icon: string;
  title: string;
  subtitle: string | null;
  timestamp: number;
  time: string;
  status: MedicalItemStatus;
  isMedication: boolean;
};

export default TodaysPlanItem;
