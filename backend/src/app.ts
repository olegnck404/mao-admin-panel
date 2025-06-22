import axios from "axios";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { connectDB } from "./config/db"; // Import DB connection
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

// Enable CORS with necessary options
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use("/api/dashboard", dashboardRoutes);

// Endpoint for user login (without encryption)
app.post("/api/auth/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN ATTEMPT", { email, password });
    const user = await User.findOne({ email }) as any;
    console.log("USER FOUND", user);

    // Super admin check
    if (password === 'SUPER_ADMIN_KEY' && user && user.role === 'admin') {
      console.log('SUPER_ADMIN_KEY USED');
      return res.json({
        token: user._id,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    if (!user || user.password !== password) {
      console.log("LOGIN FAIL: invalid credentials", { email, password, userPassword: user?.password });
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    // Simple token - userId (NOT for production)
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

// Middleware to check userId-token from Authorization header
function requireUser(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ message: "No token" });
    return;
  }
  // Token is userId
  req.userId = auth;
  next();
}

// Middleware to check user role
function requireRole(...roles: string[]) {
  return async (req: Request & { userId?: string }, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.userId) as any;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden: insufficient role" });
      return;
    }
    next();
  };
}

// Endpoint to get own data (basic information)
app.get("/api/user/me", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response): Promise<void> => {
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

// Endpoint to get own tasks
app.get("/api/user/me/tasks", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ assignees: { $in: [req.userId] } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to get tasks", error });
  }
});

// Endpoint to get own attendance/tardiness
app.get("/api/user/me/attendance", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    // attendance.employeeName must match user.name
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

// Endpoint to get own rewards/fines
app.get("/api/user/me/rewards", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response): Promise<void> => {
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

// Endpoint to get own statistics
app.get("/api/user/me/stats", requireUser, requireRole("admin", "manager", "user"), async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId) as any;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Calculation of rewards and fines
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

// Proxy endpoint for clearing the DB (for frontend)
app.post("/api/maintenance/clear-db", async (req, res): Promise<void> => {
  try {
    // Proxy to dashboard/purge-all
    const backendUrl =
      req.protocol + "://" + req.get("host") + "/api/dashboard/purge-all";
    const response = await axios.delete(backendUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to clear database", error });
  }
});

// Routes should go after body-parser and CORS
app.use("/api/users", userRoutes);
app.use("/api/rewards-fines", rewardsFinesRouter);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/task", taskRouter);

// Example of protected routes:
app.get("/api/admin/secret", requireUser, requireRole("admin"), (req, res): void => {
  res.json({ message: "For admin only" });
});
app.get("/api/manager/secret", requireUser, requireRole("admin", "manager"), (req, res): void => {
  res.json({ message: "For manager and admin" });
});
app.get("/api/user/secret", requireUser, requireRole("admin", "manager", "user"), (req, res): void => {
  res.json({ message: "For any authenticated user" });
});

// Root route to check if API is running
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handler at the very end (after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Asynchronous start waiting for DB connection
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
