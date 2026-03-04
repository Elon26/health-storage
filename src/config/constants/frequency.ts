import Frequency from '@/types/frequency';
import FrequencyObject from '@/types/frequency-object';

const frequencyObjects: Record<string, FrequencyObject> = {
  everyDay: { name: Frequency.everyDay, label: 'Every Day' },
  everyXDays: { name: Frequency.everyXDays, label: 'Every X Days' },
  cyclical: { name: Frequency.cyclical, label: 'On a Cyclical Schedule' },
  specificDays: { name: Frequency.specificDays, label: 'Specific Days' },
};

export default frequencyObjects;
