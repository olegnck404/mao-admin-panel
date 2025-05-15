import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers
} from '../controllers/user.controller';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;