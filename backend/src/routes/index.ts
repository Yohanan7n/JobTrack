import { Router } from 'express';
import authRoutes from './auth.routes';
import applicationRoutes from './application.routes';
import companyRoutes from './company.routes';
import interviewRoutes from './interview.routes';
import documentRoutes from './document.routes';
import analyticsRoutes from './analytics.routes';
import adminRoutes from './admin.routes';
import jobRoutes from './job.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);
router.use('/companies', companyRoutes);
router.use('/interviews', interviewRoutes);
router.use('/documents', documentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/jobs', jobRoutes);

export default router;
