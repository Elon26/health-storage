import CapsuleImage from '@/images/medical-units/capsule.png';
import DropImage from '@/images/medical-units/drop.png';
import InjectionImage from '@/images/medical-units/injection.png';
import SachetImage from '@/images/medical-units/sachet.png';
import SprayImage from '@/images/medical-units/spray.png';
import SuppositoryImage from '@/images/medical-units/suppository.png';
import TabletImage from '@/images/medical-units/tablet.png';
import UnitImage from '@/images/medical-units/unit.png';
import MedicalUnitIcon from '@/types/medical-unit-icon';

const medicalUnitIcons = [
  { image: CapsuleImage, name: MedicalUnitIcon.capsule },
  { image: TabletImage, name: MedicalUnitIcon.tablet },
  { image: InjectionImage, name: MedicalUnitIcon.injection },
  { image: SprayImage, name: MedicalUnitIcon.spray },
  { image: DropImage, name: MedicalUnitIcon.drop },
  { image: SuppositoryImage, name: MedicalUnitIcon.suppository },
  { image: SachetImage, name: MedicalUnitIcon.sachet },
  { image: UnitImage, name: MedicalUnitIcon.unit },
];

export default medicalUnitIcons;
