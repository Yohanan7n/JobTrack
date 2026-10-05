import { Router } from 'express';
import {
  getJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  updateApplicantStatus,
} from '../controllers/job.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public / Authenticated discovery
router.get('/', authenticate, getJobs);
router.get('/my', authenticate, getMyJobs);
router.get('/:id', authenticate, getJobById);

// Employer actions
router.post('/', authenticate, createJob);
router.patch('/:id', authenticate, updateJob);
router.delete('/:id', authenticate, deleteJob);

// Candidate actions
router.post('/:id/apply', authenticate, applyToJob);

// Employer applicant management
router.patch('/:jobId/applicants/:applicationId', authenticate, updateApplicantStatus);

export default router;
