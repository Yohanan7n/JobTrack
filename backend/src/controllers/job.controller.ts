import { Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { successResponse, errorResponse } from '../utils/response';

/**
 * GET /api/jobs
 * List all open job postings for Job Seekers / Marketplace
 */
export const getJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { search, locationType, employmentType, status = 'OPEN' } = req.query as {
      search?: string;
      locationType?: string;
      employmentType?: string;
      status?: string;
    };

    const where: any = {};
    if (status) where.status = status;
    if (locationType) where.locationType = locationType;
    if (employmentType) where.employmentType = employmentType;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { companyName: { contains: search } },
        { description: { contains: search } },
        { skills: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const jobs = await prisma.jobPosting.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            companyName: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    // If authenticated user, check if they have applied to each job
    const userId = req.user?.id;
    let appliedJobIds = new Set<string>();
    if (userId) {
      const myApplications = await prisma.application.findMany({
        where: {
          userId,
          jobPostingId: { not: null },
        },
        select: { jobPostingId: true, status: true },
      });
      appliedJobIds = new Set(
        myApplications
          .map((app: { jobPostingId: string | null }) => app.jobPostingId)
          .filter((id): id is string => typeof id === 'string')
      );
    }

    const enrichedJobs = jobs.map((job: any) => ({
      ...job,
      applicantCount: job._count.applications,
      hasApplied: appliedJobIds.has(job.id),
    }));

    return successResponse(res, enrichedJobs, 'Jobs fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/my
 * List jobs posted by current logged in Employer
 */
export const getMyJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employerId = req.user!.id;

    const jobs = await prisma.jobPosting.findMany({
      where: { employerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    const enrichedJobs = jobs.map((job: any) => ({
      ...job,
      applicantCount: job._count.applications,
    }));

    return successResponse(res, enrichedJobs, 'Employer jobs fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/:id
 * Get single job posting details + applicants if employer
 */
export const getJobById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            companyName: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return errorResponse(res, 'Job posting not found', 404);
    }

    const isOwnerOrAdmin = userId && (job.employerId === userId || req.user?.role === 'ADMIN');

    let applicants: any[] = [];
    if (isOwnerOrAdmin) {
      applicants = await prisma.application.findMany({
        where: { jobPostingId: id },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              title: true,
              bio: true,
              skills: true,
            },
          },
          documents: true,
        },
      });
    }

    let hasApplied = false;
    if (userId) {
      const existing = await prisma.application.findFirst({
        where: {
          userId,
          jobPostingId: id,
        },
      });
      hasApplied = !!existing;
    }

    return successResponse(
      res,
      {
        ...job,
        applicantCount: job._count.applications,
        hasApplied,
        applicants: isOwnerOrAdmin ? applicants : undefined,
      },
      'Job details fetched'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/jobs
 * Create a new job posting (Employer)
 */
export const createJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employerId = req.user!.id;
    const {
      title,
      companyName,
      location,
      locationType = 'REMOTE',
      employmentType = 'FULL_TIME',
      salaryRange,
      description,
      requirements,
      skills,
    } = req.body;

    if (!title || !description) {
      return errorResponse(res, 'Job title and description are required', 400);
    }

    // Default companyName to user's companyName or user name
    const finalCompanyName = companyName || req.user?.name || 'Company';

    const job = await prisma.jobPosting.create({
      data: {
        employerId,
        title,
        companyName: finalCompanyName,
        location,
        locationType,
        employmentType,
        salaryRange,
        description,
        requirements,
        skills,
        status: 'OPEN',
      },
    });

    return successResponse(res, job, 'Job posted successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/jobs/:id
 * Update job posting details or status
 */
export const updateJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const job = await prisma.jobPosting.findUnique({ where: { id } });
    if (!job) {
      return errorResponse(res, 'Job posting not found', 404);
    }

    if (job.employerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'You do not have permission to edit this job', 403);
    }

    const {
      title,
      companyName,
      location,
      locationType,
      employmentType,
      salaryRange,
      description,
      requirements,
      skills,
      status,
    } = req.body;

    const updated = await prisma.jobPosting.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(companyName !== undefined && { companyName }),
        ...(location !== undefined && { location }),
        ...(locationType !== undefined && { locationType }),
        ...(employmentType !== undefined && { employmentType }),
        ...(salaryRange !== undefined && { salaryRange }),
        ...(description !== undefined && { description }),
        ...(requirements !== undefined && { requirements }),
        ...(skills !== undefined && { skills }),
        ...(status !== undefined && { status }),
      },
    });

    return successResponse(res, updated, 'Job posting updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/jobs/:id
 * Delete job posting
 */
export const deleteJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const job = await prisma.jobPosting.findUnique({ where: { id } });
    if (!job) {
      return errorResponse(res, 'Job posting not found', 404);
    }

    if (job.employerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'You do not have permission to delete this job', 403);
    }

    await prisma.jobPosting.delete({ where: { id } });

    return successResponse(res, null, 'Job posting deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/jobs/:id/apply
 * Job Seeker applies to a job posting
 */
export const applyToJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { notes, cvUsed } = req.body;

    const job = await prisma.jobPosting.findUnique({ where: { id } });
    if (!job) {
      return errorResponse(res, 'Job posting not found', 404);
    }

    if (job.status !== 'OPEN') {
      return errorResponse(res, 'This job is no longer accepting applications', 400);
    }

    if (job.employerId === userId) {
      return errorResponse(res, 'You cannot apply to your own job posting', 400);
    }

    // Check if user already applied
    const existing = await prisma.application.findFirst({
      where: {
        userId,
        jobPostingId: id,
      },
    });

    if (existing) {
      return errorResponse(res, 'You have already applied to this position', 409);
    }

    // Create application on Job Seeker's Kanban board
    const application = await prisma.application.create({
      data: {
        userId,
        jobPostingId: id,
        companyName: job.companyName,
        position: job.title,
        location: job.location,
        locationType: job.locationType,
        employmentType: job.employmentType,
        salary: job.salaryRange,
        status: 'APPLIED',
        applicationDate: new Date(),
        jobDescription: job.description,
        notes: notes || `Applied via WorkHub Marketplace`,
        cvUsed: cvUsed || null,
      },
    });

    return successResponse(
      res,
      application,
      'Your application was submitted and added to your tracker!',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/jobs/:jobId/applicants/:applicationId
 * Employer updates candidate's status (Reviewing, Shortlisted, Interview, Offer, Rejected)
 */
export const updateApplicantStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId, applicationId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user!.id;

    const job = await prisma.jobPosting.findUnique({ where: { id: jobId } });
    if (!job) {
      return errorResponse(res, 'Job posting not found', 404);
    }

    if (job.employerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'You do not have permission to manage applicants for this job', 403);
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application || application.jobPostingId !== jobId) {
      return errorResponse(res, 'Application not found for this job', 404);
    }

    const validStatuses = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED'];
    if (status && !validStatuses.includes(status)) {
      return errorResponse(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return successResponse(res, updated, 'Candidate status updated successfully');
  } catch (error) {
    next(error);
  }
};
