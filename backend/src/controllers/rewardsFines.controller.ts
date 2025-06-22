import { Request, Response } from 'express';
import RewardFine from '../models/RewardFine'; // Mongoose model

export const getRecords = async (req: Request, res: Response) => {
  try {
    const records = await RewardFine.find().sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  try {
    const record = new RewardFine(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};