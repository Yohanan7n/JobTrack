import { Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const {
      status,
      search,
      companyId,
      locationType,
      employmentType,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '50',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (locationType) {
      where.locationType = locationType;
    }

    if (employmentType) {
      where.employmentType = employmentType;
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { companyName: { contains: search } },
        { position: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          company: {
            select: { id: true, name: true, website: true, location: true },
          },
          interviews: {
            select: { id: true, title: true, scheduledAt: true, status: true, type: true },
            orderBy: { scheduledAt: 'asc' },
          },
          documents: {
            select: { id: true, title: true, fileName: true, fileUrl: true, fileType: true },
          },
        },
        orderBy: {
          [sortBy]: order === 'asc' ? 'asc' : 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.application.count({ where }),
    ]);

    return successResponse(res, applications, 'Applications fetched successfully', 200, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const application = await prisma.application.findFirst({
      where: { id, userId },
      include: {
        company: true,
        interviews: {
          orderBy: { scheduledAt: 'asc' },
        },
        documents: true,
      },
    });

    if (!application) {
      return errorResponse(res, 'Application not found', 404);
    }

    return successResponse(res, application);
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const {
      companyName,
      position,
      location,
      locationType = 'REMOTE',
      employmentType = 'FULL_TIME',
      salary,
      status = 'APPLIED',
      applicationDate,
      jobDescription,
      jobUrl,
      contactPerson,
      contactEmail,
      cvUsed,
      notes,
      rating = 3,
      companyId,
    } = req.body;

    let targetCompanyId = companyId;

    // If company exists or can be matched by name
    if (!targetCompanyId && companyName) {
      let company = await prisma.company.findFirst({
        where: { userId, name: companyName.trim() },
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            userId,
            name: companyName.trim(),
            location: location || null,
            contactPerson: contactPerson || null,
            contactEmail: contactEmail || null,
          },
        });
      }
      targetCompanyId = company.id;
    }

    const application = await prisma.application.create({
      data: {
        userId,
        companyId: targetCompanyId || null,
        companyName: companyName.trim(),
        position: position.trim(),
        location: location || null,
        locationType,
        employmentType,
        salary: salary || null,
        status,
        applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
        jobDescription: jobDescription || null,
        jobUrl: jobUrl || null,
        contactPerson: contactPerson || null,
        contactEmail: contactEmail || null,
        cvUsed: cvUsed || null,
        notes: notes || null,
        rating: Number(rating) || 3,
      },
      include: {
        company: true,
        interviews: true,
        documents: true,
      },
    });

    return successResponse(res, application, 'Application created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return errorResponse(res, 'Application not found', 404);
    }

    const updateData: any = { ...req.body };
    if (updateData.applicationDate) {
      updateData.applicationDate = new Date(updateData.applicationDate);
    }
    if (updateData.rating !== undefined) {
      updateData.rating = Number(updateData.rating);
    }

    const application = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
        interviews: true,
        documents: true,
      },
    });

    return successResponse(res, application, 'Application updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    const existing = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return errorResponse(res, 'Application not found', 404);
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        company: true,
        interviews: true,
      },
    });

    return successResponse(res, updated, `Status moved to ${status}`);
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return errorResponse(res, 'Application not found', 404);
    }

    await prisma.application.delete({
      where: { id },
    });

    return successResponse(res, null, 'Application deleted successfully');
  } catch (error) {
    next(error);
  }
};
