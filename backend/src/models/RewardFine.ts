import mongoose, { Document, Schema } from 'mongoose';

interface IRewardFine extends Document {
  employeeName: string;
  date: Date;
  type: 'reward' | 'penalty';
  amount: number;
  reason: string;
}

const RewardFineSchema = new Schema<IRewardFine>({
  employeeName: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['reward', 'penalty'], required: true },
  amount: { type: Number, required: true },
  reason: { type: String },
});

export default mongoose.model<IRewardFine>('RewardFine', RewardFineSchema);