import express from 'express';
import { createUser, deleteUser, getUsers } from '../controllers/user.controller';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;