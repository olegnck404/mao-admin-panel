import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import User from '../models/User';

export const getTasks = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    let tasks: ITask[] = [];
    // For admin and manager, always return all tasks
    if (req.userId) {
      const user = await User.findById(req.userId);
      if (user && (user.role === 'admin' || user.role === 'manager')) {
        tasks = await Task.find();
      } else if (user && user.role === 'user') {
        // For employee - only their own and common tasks
        tasks = await Task.find({
          $or: [
            { assignees: { $in: [user.name] } },
            { isGlobal: true }
          ]
        });
      } else {
        // If user not found - return nothing
        tasks = [];
      }
    } else {
      // Unauthorized: return nothing
      tasks = [];
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTask = new Task(req.body);
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

export const updateTask = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
};

export const deleteTask = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
};

