type ReminderScheduleItem = {
  id: string;
  timestamp: number;
  isTaken: boolean | null;
  notificationId: string | null;
};

export default ReminderScheduleItem;
