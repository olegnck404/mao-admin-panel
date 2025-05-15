import cors from 'cors';
import express from 'express';
import errorHandler from './middlewares/errorHandler';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Добавляем обработчик корневого маршрута
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;