import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb';

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};