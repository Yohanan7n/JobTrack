import { Router } from 'express';
import {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
} from '../controllers/interview.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/', getInterviews);
router.post('/', createInterview);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
