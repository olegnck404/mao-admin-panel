import cors from 'cors';
import express from 'express';
import { connectDB } from './config/db'; // импорт подключения к БД
import errorHandler from './middlewares/errorHandler';
import attendanceRoutes from './routes/attendance.routes';
import dashboardRoutes from './routes/dashboard.routes';
import rewardsFinesRouter from './routes/rewardsFines';
import taskRouter from './routes/task.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Подключаем CORS с нужными опциями
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/api/dashboard', dashboardRoutes);

// Разбираем JSON тело запросов
app.use(express.json());

// Роуты должны идти после body-parser и CORS
app.use('/api/users', userRoutes);
app.use('/api/rewards-fines', rewardsFinesRouter);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/task', taskRouter);

// Корневой маршрут для проверки работы API
app.get('/', (req, res) => {
  res.send('API is running');
});

// Обработчик ошибок в самом конце (после всех роутов)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Асинхронный запуск с ожиданием подключения к БД
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;