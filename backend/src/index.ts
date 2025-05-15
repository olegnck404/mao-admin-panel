import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

mongoose.connect('mongodb://localhost:27017/your-db-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });