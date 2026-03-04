import { PropsWithChildren } from 'react';
import { Easing } from 'react-native';
import {
  createModalStack,
  type ModalOptions,
  type ModalStack,
} from 'react-native-modalfy';

import TimeModal from '@/pages/create-appointment/components/time-modal';
import { AddQuantityModal } from '@/pages/create-medication/components/add-quantity-modal';
import { AddTimeModal } from '@/pages/create-medication/components/add-time-modal';
import CalendarModal from '@/pages/create-medication/components/calendar-modal';
import { ChooseUnitModal } from '@/pages/create-medication/components/choose-unit-modal';
import { SelectNumberModal } from '@/pages/create-medication/components/select-number-modal';
import { PaywallModal } from '@/pages/paywall/components/paywall-modal';
import { AddedFilesModal } from '@/pages/secret-folder/components/added-files-modal';
import { LimitFilesModal } from '@/pages/secret-folder/components/limit-files-modal';
import { ProtectFilesModal } from '@/pages/secret-folder/components/protect-files-modal';
import MedicalUnit from '@/types/medical-unit';
import { DayTime } from '@/types/schedule';

import { CleanerHappyModal } from './cleaner-happy-modal';
import { CleaningModal } from './cleaning-modal';
import { LimitDeletionsModal } from './limit-deletions-modal';
import { LoaderModal } from './loader-modal';
import { SuccessModal } from './success-modal';

const defaultOptions: ModalOptions = {
  position: 'center',
  disableFlingGesture: true,
  backBehavior: 'none',
  backdropOpacity: 0.2,
  animateInConfig: {
    easing: Easing.inOut(Easing.exp),
    duration: 1000,
  },
} as const;

export type ModalStackParams = {
  LoaderModal: typeof LoaderModal;
  SuccessModal: {
    filesQuantity: number;
    freedSpace: string;
  };
  AddQuantityModal: {
    title: string;
    close: () => void;
    setValue: (value: number) => void;
  };
  ChooseUnitModal: {
    selectedValue: string;
    close: () => void;
    setValue: (value: MedicalUnit) => void;
  };
  AddTimeModal: {
    close: () => void;
    addDayTime: (dayTime: DayTime) => void;
  };
  CalendarModal: {
    startDate: Date;
    close: () => void;
    setDate: (newDate: Date) => void;
  };
  TimeModal: {
    close: () => void;
    selectedDate: number;
    selectTime: (time: Date) => void;
  };
  SelectNumberModal: {
    close: () => void;
    selectedNumber: number;
    setNumber: (num: number) => void;
  };
  CleanerHappyModal: PropsWithChildren;
  CleaningModal: never;
  LimitDeletionsModal: {
    count: number;
  };
  ProtectFilesModal: never;
  AddedFilesModal: {
    count: number;
  };
  LimitFilesModal: {
    count: number;
  };
  Paywall: {
    type: 'a' | 'b' | 'c';
  };
};

export const modalsStack: ModalStack<ModalStackParams> = createModalStack(
  {
    LoaderModal,
    SuccessModal,
    AddQuantityModal,
    ChooseUnitModal,
    AddTimeModal,
    CalendarModal,
    TimeModal,
    SelectNumberModal,
    CleanerHappyModal,
    CleaningModal,
    LimitDeletionsModal,
    ProtectFilesModal,
    AddedFilesModal,
    LimitFilesModal,
    Paywall: {
      modal: PaywallModal,
      position: 'top',
    },
  },
  defaultOptions
);
