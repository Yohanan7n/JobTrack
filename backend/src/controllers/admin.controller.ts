import { Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { search, role, status } = req.query as { search?: string; role?: string; status?: string };

    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
            interviews: true,
            documents: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, users);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      return errorResponse(res, 'Status must be ACTIVE or SUSPENDED', 400);
    }

    if (id === req.user!.id && status === 'SUSPENDED') {
      return errorResponse(res, 'Administrators cannot suspend their own account', 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    return successResponse(res, user, `User status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return errorResponse(res, 'Role must be USER or ADMIN', 400);
    }

    if (id === req.user!.id && role !== 'ADMIN') {
      return errorResponse(res, 'You cannot remove your own admin privileges', 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    return successResponse(res, user, `User role updated to ${role}`);
  } catch (error) {
    next(error);
  }
};

export const getSystemMetrics = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalApplications, totalInterviews, totalDocuments, totalCompanies] = await Promise.all([
      prisma.user.count(),
      prisma.application.count(),
      prisma.interview.count(),
      prisma.document.count(),
      prisma.company.count(),
    ]);

    const activeUsers = await prisma.user.count({ where: { status: 'ACTIVE' } });
    const suspendedUsers = await prisma.user.count({ where: { status: 'SUSPENDED' } });

    return successResponse(res, {
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalApplications,
      totalInterviews,
      totalDocuments,
      totalCompanies,
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
    });
  } catch (error) {
    next(error);
  }
};
