import MedicalUnit from './medical-unit';
import MedicalUnitIcon from './medical-unit-icon';
import ReminderScheduleItem from './reminder-schedule-item';
import { Schedule } from './schedule';

type Medication = {
  id: string;
  icon: MedicalUnitIcon;
  name: string;
  dose: number;
  unit: MedicalUnit;
  schedule: ReminderScheduleItem[];
  note: string;
  scheduleData: Schedule;
  isStockTrackingActive: boolean;
  currentStock: number;
  reminderStockLimit: number;
};

export default Medication;
