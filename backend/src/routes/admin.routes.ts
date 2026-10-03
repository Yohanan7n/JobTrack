import { Router } from 'express';
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getSystemMetrics,
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

const router = Router();
router.use(authenticate);
router.use(requireAdmin);

router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);
router.get('/metrics', getSystemMetrics);

export default router;
