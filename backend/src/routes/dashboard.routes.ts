// backend/src/routes/dashboard.routes.ts
import express from "express";
import { getStats, getTaskProgress } from "../controllers/dashboard.controller";
import User from "../models/User";
import Attendance from "../models/Attendance";
import RewardFine from "../models/RewardFine";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Получаем статистику
    const statsPromise = getStatsData();
    const taskProgressPromise = getTaskProgressData();
    const recentActivitiesPromise = getRecentActivities();

    const [stats, taskProgress, recentActivities] = await Promise.all([
      statsPromise,
      taskProgressPromise,
      recentActivitiesPromise,
    ]);

    res.json({
      activeEmployees: stats.totalEmployees,
      pendingTasks: stats.pendingTasks,
      lateArrivals: stats.lateArrivals,
      totalRewards: stats.totalRewards,
      recentActivities,
      taskProgress,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard data", error });
  }
});

// Получение статистики (аналог getStats контроллера)
async function getStatsData() {
  const totalEmployees = await User.countDocuments();
  const pendingTasks = await (
    await import("../models/Task")
  ).default.countDocuments({ status: { $ne: "Done" } });
  // Реальная логика для lateArrivals и totalRewards (примерно)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lateArrivals = await Attendance.countDocuments({
    date: { $gte: today },
    checkIn: { $gt: "09:10" },
  });
  const totalRewards = await RewardFine.aggregate([
    { $match: { type: "reward" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return {
    totalEmployees,
    pendingTasks,
    lateArrivals,
    totalRewards: totalRewards[0]?.total || 0,
  };
}

// Получение прогресса задач (аналог getTaskProgress контроллера)
async function getTaskProgressData() {
  const Task = (await import("../models/Task")).default;
  const highPriorityTasks = await Task.countDocuments({ priority: "High" });
  const mediumPriorityTasks = await Task.countDocuments({ priority: "Medium" });
  const lowPriorityTasks = await Task.countDocuments({ priority: "Low" });

  const completedHigh = await Task.countDocuments({
    priority: "High",
    status: "Done",
  });
  const completedMedium = await Task.countDocuments({
    priority: "Medium",
    status: "Done",
  });
  const completedLow = await Task.countDocuments({
    priority: "Low",
    status: "Done",
  });

  return [
    {
      title: "High Priority Tasks",
      progress: completedHigh,
      total: highPriorityTasks,
      color: "#FF3B30",
    },
    {
      title: "Medium Priority Tasks",
      progress: completedMedium,
      total: mediumPriorityTasks,
      color: "#FF9500",
    },
    {
      title: "Low Priority Tasks",
      progress: completedLow,
      total: lowPriorityTasks,
      color: "#28CD41",
    },
  ];
}

// Получение последних активностей (пример: последние посещения и награды/штрафы)
async function getRecentActivities() {
  // Последние 5 посещений
  const attendance = await Attendance.find().sort({ date: -1 }).limit(3);
  // Последние 2 награды/штрафа
  const rewards = await RewardFine.find().sort({ date: -1 }).limit(2);

  const attendanceActivities = attendance.map((a, idx) => ({
    id: `attendance-${a._id}`,
    name: a.employeeName,
    action: "Marked attendance",
    time: a.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    avatar: a.employeeName[0],
    color: "#28CD41",
  }));

  const rewardActivities = rewards.map((r, idx) => ({
    id: `reward-${r._id}`,
    name: r.employeeName,
    action: r.type === "reward" ? "Received reward" : "Received penalty",
    time: r.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    avatar: r.employeeName[0],
    color: r.type === "reward" ? "#0051FF" : "#FF3B30",
  }));

  return [...attendanceActivities, ...rewardActivities];
}

// Endpoint для полной очистки БД (использовать только в dev/admin!)
router.delete("/purge-all", async (req, res) => {
  try {
    const User = (await import("../models/User")).default;
    const Task = (await import("../models/Task")).default;
    const Attendance = (await import("../models/Attendance")).default;
    const RewardFine = (await import("../models/RewardFine")).default;

    await Promise.all([
      User.deleteMany({}),
      Task.deleteMany({}),
      Attendance.deleteMany({}),
      RewardFine.deleteMany({}),
    ]);
    res.json({ message: "All collections purged" });
  } catch (error) {
    res.status(500).json({ message: "Failed to purge collections", error });
  }
});

export default router;
