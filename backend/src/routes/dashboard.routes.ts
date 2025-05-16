// backend/src/routes/dashboard.routes.ts
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Заглушка с данными — потом можно заменить реальной логикой
    res.json({
      activeEmployees: 24,
      pendingTasks: 12,
      lateArrivals: 3,
      totalRewards: 1200,
      recentActivities: [
        { id: 1, name: "John Doe", action: "Completed kitchen task", time: "2m ago", avatar: "J", color: "#0051FF" },
        { id: 2, name: "Sarah Smith", action: "Marked attendance", time: "15m ago", avatar: "S", color: "#28CD41" },
      ],
      taskProgress: [
        { title: "Kitchen Tasks", progress: 8, total: 10, color: "#0051FF" },
        { title: "Service Tasks", progress: 5, total: 8, color: "#28CD41" },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

export default router;