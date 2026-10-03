import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/application.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  createApplicationSchema,
  updateApplicationSchema,
  updateStatusSchema,
} from '../validators/application.validator';

const router = Router();

router.use(authenticate);

router.get('/', getApplications);
router.post('/', validateRequest(createApplicationSchema), createApplication);
router.get('/:id', getApplicationById);
router.put('/:id', validateRequest(updateApplicationSchema), updateApplication);
router.patch('/:id/status', validateRequest(updateStatusSchema), updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;
