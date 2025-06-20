import axios from "axios";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { connectDB } from "./config/db"; // импорт подключения к БД
import errorHandler from "./middlewares/errorHandler";
import Attendance from "./models/Attendance";
import RewardFine from "./models/RewardFine";
import Task from "./models/Task";
import User from "./models/User";
import attendanceRoutes from "./routes/attendance.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import rewardsFinesRouter from "./routes/rewardsFines";
import taskRouter from "./routes/task.routes";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(express.json());

// Подключаем CORS с нужными опциями
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/api/dashboard", dashboardRoutes);

// Endpoint для логина пользователя (без шифрования)
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN ATTEMPT", { email, password });
    const user = await User.findOne({ email }) as any;
    console.log("USER FOUND", user);
    if (!user || user.password !== password) {
      console.log("LOGIN FAIL: invalid credentials", { email, password, userPassword: user?.password });
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    // Простой токен — userId (НЕ для продакшена)
    res.json({
      token: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
});

// Middleware для проверки userId-токена из заголовка Authorization
function requireUser(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ message: "No token" });
    return;
  }
  // Токен — это userId
  req.userId = auth;
  next();
}

// Middleware для проверки роли пользователя
function requireRole(...roles: string[]) {
  return async (req: Request & { userId?: string }, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId) as any;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
}

// Endpoint для получения своих данных (основная информация)
app.get("/api/user/me", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response) => {
  try {
    const user = await User.findById(req.userId) as any;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user", error });
  }
});

// Endpoint для получения своих задач
app.get("/api/user/me/tasks", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response) => {
  try {
    const tasks = await Task.find({ assignees: { $in: [req.userId] } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to get tasks", error });
  }
});

// Endpoint для получения своих посещений/опозданий
app.get("/api/user/me/attendance", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response) => {
  try {
    // attendance.employeeName должен совпадать с user.name
    const user = await User.findById(req.userId) as any;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const attendance = await Attendance.find({ employeeName: user.name });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Failed to get attendance", error });
  }
});

// Endpoint для получения своих премий/штрафов
app.get("/api/user/me/rewards", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response) => {
  try {
    const user = await User.findById(req.userId) as any;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const rewards = await RewardFine.find({ employeeName: user.name });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Failed to get rewards", error });
  }
});

// Endpoint для получения своей статистики
app.get("/api/user/me/stats", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response) => {
  try {
    const user = await User.findById(req.userId) as any;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Подсчет премий и штрафов
    const rewardsAgg = await RewardFine.aggregate([
      { $match: { employeeName: user.name } },
      {
        $group: {
          _id: null,
          totalRewards: {
            $sum: {
              $cond: [{ $eq: ["$type", "reward"] }, "$amount", 0],
            },
          },
          totalPenalties: {
            $sum: {
              $cond: [{ $eq: ["$type", "penalty"] }, "$amount", 0],
            },
          },
        },
      },
    ]);
    const totalRewards = rewardsAgg[0]?.totalRewards || 0;
    const totalPenalties = rewardsAgg[0]?.totalPenalties || 0;
    res.json({
      totalRewards,
      totalPenalties,
      netBalance: totalRewards - totalPenalties,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get stats", error });
  }
});

// Proxy endpoint для очистки БД (для фронта)
app.post("/api/maintenance/clear-db", async (req, res) => {
  try {
    // Проксируем на dashboard/purge-all
    const backendUrl =
      req.protocol + "://" + req.get("host") + "/api/dashboard/purge-all";
    const response = await axios.delete(backendUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to clear database", error });
  }
});

// Роуты должны идти после body-parser и CORS
app.use("/api/users", userRoutes);
app.use("/api/rewards-fines", rewardsFinesRouter);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/task", taskRouter);

// Пример защищённых роутов:
app.get("/api/admin/secret", requireUser, requireRole("admin"), (req, res) => {
  res.json({ message: "Только для админа" });
});
app.get("/api/manager/secret", requireUser, requireRole("admin", "manager"), (req, res) => {
  res.json({ message: "Для менеджера и админа" });
});
app.get("/api/user/secret", requireUser, requireRole("admin", "manager", "user"), (req, res) => {
  res.json({ message: "Для любого авторизованного пользователя" });
});

// Корневой маршрут для проверки работы API
app.get("/", (req, res) => {
  res.send("API is running");
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
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
