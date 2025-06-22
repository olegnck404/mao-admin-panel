import { Request, Response } from 'express';
import Task from '../models/Task';

// Dashboard statistics
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalEmployees = await (await import('../models/User')).default.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: { $ne: 'Done' } });
    const lateArrivals = 3; // mock number, logic needs to be added
    const totalRewards = 1200; // mock number, logic needs to be added

    res.json({
      totalEmployees,
      pendingTasks,
      lateArrivals,
      totalRewards,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error });
  }
};

// Task progress by category (fixed categories)
export const getTaskProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    // Example: counting tasks with priorities as categories
    const highPriorityTasks = await Task.countDocuments({ priority: 'High' });
    const mediumPriorityTasks = await Task.countDocuments({ priority: 'Medium' });
    const lowPriorityTasks = await Task.countDocuments({ priority: 'Low' });

    const completedHigh = await Task.countDocuments({ priority: 'High', status: 'Done' });
    const completedMedium = await Task.countDocuments({ priority: 'Medium', status: 'Done' });
    const completedLow = await Task.countDocuments({ priority: 'Low', status: 'Done' });

    res.json([
      { title: 'High Priority Tasks', progress: completedHigh, total: highPriorityTasks, color: '#FF3B30' },
      { title: 'Medium Priority Tasks', progress: completedMedium, total: mediumPriorityTasks, color: '#FF9500' },
      { title: 'Low Priority Tasks', progress: completedLow, total: lowPriorityTasks, color: '#28CD41' },
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task progress', error });
  }
};