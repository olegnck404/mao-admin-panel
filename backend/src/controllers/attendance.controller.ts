import { Request, Response } from 'express';
import Attendance from '../models/Attendance';

// Получить все записи посещаемости (сортировать по дате)
export const getAttendanceRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Создать новую запись посещаемости
export const createAttendanceRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeName, date, checkIn, checkOut } = req.body;

    if (!employeeName || !date || !checkIn || !checkOut) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const record = new Attendance({ employeeName, date, checkIn, checkOut });
    await record.save();

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Обновить запись посещаемости по id
export const updateAttendanceRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const recordId = req.params.id;
    const { employeeName, date, checkIn, checkOut } = req.body;

    const updated = await Attendance.findByIdAndUpdate(
      recordId,
      { employeeName, date, checkIn, checkOut },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Удалить запись посещаемости по id
export const deleteAttendanceRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const recordId = req.params.id;

    const deleted = await Attendance.findByIdAndDelete(recordId);

    if (!deleted) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};