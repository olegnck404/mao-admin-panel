import express from 'express';
import {
  createAttendanceRecord,
  deleteAttendanceRecord,
  getAttendanceRecords,
  updateAttendanceRecord,
} from '../controllers/attendance.controller';

const router = express.Router();

router.get('/', getAttendanceRecords);
router.post('/', createAttendanceRecord);
router.put('/:id', updateAttendanceRecord);
router.delete('/:id', deleteAttendanceRecord);

export default router;