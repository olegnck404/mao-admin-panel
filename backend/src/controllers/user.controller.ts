import { Request, Response } from 'express';
import RewardFine from '../models/RewardFine'; // импорт модели наград и штрафов
import User from '../models/User';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    const user = new User({ name, email, role, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsersStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();

    const stats = await Promise.all(
      users.map(async (user) => {
        const rewardsAgg = await RewardFine.aggregate([
          { $match: { employeeName: user.name } },
          {
            $group: {
              _id: null,
              totalRewards: {
                $sum: {
                  $cond: [{ $eq: ['$type', 'reward'] }, '$amount', 0],
                },
              },
              totalPenalties: {
                $sum: {
                  $cond: [{ $eq: ['$type', 'penalty'] }, '$amount', 0],
                },
              },
            },
          },
        ]);

        const totalRewards = rewardsAgg[0]?.totalRewards || 0;
        const totalPenalties = rewardsAgg[0]?.totalPenalties || 0;

        return {
          _id: user._id,
          name: user.name,
          totalRewards,
          totalPenalties,
          netBalance: totalRewards - totalPenalties,
        };
      })
    );

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
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
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const { name, email, role, password } = req.body;

    const updateData: any = { name, email, role };
    if (password && password.trim() !== '') {
      updateData.password = password; // Здесь, возможно, нужен хеш пароля, если у вас есть обработка
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};