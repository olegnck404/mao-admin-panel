import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employeeName: string;
  date: Date;
  checkIn: string;
  checkOut: string;
}

const AttendanceSchema: Schema = new Schema({
  employeeName: { type: String, required: true },
  date: { type: Date, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
});

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);