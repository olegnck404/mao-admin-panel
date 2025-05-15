import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsersStats,
  updateUser
} from '../controllers/user.controller';
import User from '../models/User';


const router = express.Router();

router.get('/stats', getUsersStats); // <- Добавляем этот роут ПЕРЕД роутом с :id

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name').lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/:id', getUserById);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);


export default router;