import { Request, Response } from 'express';
import User from '../models/User'; // Убедитесь, что этот путь корректен

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    // Рекомендуется также типизировать ошибку, если возможно: error: any или error: unknown
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return; // Важно добавить return для выхода из функции
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists' });
      return; // Важно добавить return
    }

    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return; // Важно добавить return
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return; // Важно добавить return
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};