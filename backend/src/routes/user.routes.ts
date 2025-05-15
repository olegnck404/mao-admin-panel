import express from 'express';
import {
  createUser,
  deleteUser,
  getUsers,
  getUserById
} from '../controllers/user.controller';

const router = express.Router();

router.get('/', getUsers);             // Получить всех пользователей
router.get('/:id', getUserById);       // Получить пользователя по ID
router.post('/', createUser);          // Создать нового пользователя
router.delete('/:id', deleteUser);     // Удалить пользователя по ID

export default router;