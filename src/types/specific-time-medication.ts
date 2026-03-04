import MedicalUnit from './medical-unit';
import MedicalUnitIcon from './medical-unit-icon';
import ReminderScheduleItem from './reminder-schedule-item';

type SpecificTimeMedication = {
  id: string;
  parentId: string;
  icon: MedicalUnitIcon;
  name: string;
  dose: number;
  unit: MedicalUnit;
  schedule: ReminderScheduleItem;
  note: string;
};

export default SpecificTimeMedication;
