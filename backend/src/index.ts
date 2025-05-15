import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

async function startServer() {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-db-name');
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

startServer();