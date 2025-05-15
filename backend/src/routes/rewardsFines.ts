// routes/rewardsFines.ts
import { Router } from 'express';
import { createRecord, getRecords } from '../controllers/rewardsFines.controller';

const router = Router();

router.get('/', getRecords);
router.post('/', createRecord);

export default router;