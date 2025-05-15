import mongoose, { Document, Schema } from 'mongoose';

export interface IRewardFine extends Document {
  employeeName: string;
  date: Date;
  type: 'reward' | 'penalty';
  amount: number;
  reason?: string;
}

const RewardFineSchema: Schema = new Schema({
  employeeName: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['reward', 'penalty'], required: true },
  amount: { type: Number, required: true },
  reason: { type: String },
});

const RewardFine = mongoose.model<IRewardFine>('RewardFine', RewardFineSchema);

export default RewardFine;