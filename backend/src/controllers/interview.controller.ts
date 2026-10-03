import { Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getInterviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status, timeframe } = req.query as { status?: string; timeframe?: string };

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const now = new Date();
    if (timeframe === 'upcoming') {
      where.scheduledAt = { gte: now };
    } else if (timeframe === 'past') {
      where.scheduledAt = { lt: now };
    }

    const interviews = await prisma.interview.findMany({
      where,
      include: {
        application: {
          select: {
            id: true,
            companyName: true,
            position: true,
            status: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return successResponse(res, interviews);
  } catch (error) {
    next(error);
  }
};

export const createInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { applicationId, title, type, scheduledAt, location, interviewer, notes } = req.body;

    if (!applicationId || !title || !scheduledAt) {
      return errorResponse(res, 'Application ID, title, and scheduled date/time are required', 400);
    }

    const application = await prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      return errorResponse(res, 'Application not found', 404);
    }

    const interview = await prisma.interview.create({
      data: {
        userId,
        applicationId,
        title,
        type: type || 'TECHNICAL',
        scheduledAt: new Date(scheduledAt),
        location,
        interviewer,
        notes,
      },
      include: {
        application: {
          select: { id: true, companyName: true, position: true },
        },
      },
    });

    // Optionally auto-update application status to INTERVIEW if it's currently APPLIED or SCREENING
    if (['APPLIED', 'SCREENING'].includes(application.status)) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: 'INTERVIEW' },
      });
    }

    return successResponse(res, interview, 'Interview scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.interview.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return errorResponse(res, 'Interview not found', 404);
    }

    const updateData = { ...req.body };
    if (updateData.scheduledAt) {
      updateData.scheduledAt = new Date(updateData.scheduledAt);
    }

    const interview = await prisma.interview.update({
      where: { id },
      data: updateData,
      include: {
        application: {
          select: { id: true, companyName: true, position: true },
        },
      },
    });

    return successResponse(res, interview, 'Interview updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.interview.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return errorResponse(res, 'Interview not found', 404);
    }

    await prisma.interview.delete({ where: { id } });

    return successResponse(res, null, 'Interview deleted successfully');
  } catch (error) {
    next(error);
  }
};
