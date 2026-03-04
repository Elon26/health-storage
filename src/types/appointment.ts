type Appointment = {
  id: string;
  title: string;
  doctorId: string;
  date: number;
  note: string;
  hourNotificationId: string | null;
  dayNotificationId: string | null;
};

export default Appointment;
