import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, default: 'user' },
  password: String,
});

export default mongoose.model<IUser>('User', UserSchema);