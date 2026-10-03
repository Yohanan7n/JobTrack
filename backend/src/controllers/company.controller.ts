import { Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getCompanies = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { search } = req.query as { search?: string };

    const where: any = { userId };
    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search } },
        { industry: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        applications: {
          select: { id: true, position: true, status: true, applicationDate: true },
          orderBy: { applicationDate: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const enriched = companies.map((c) => ({
      ...c,
      applicationCount: c.applications.length,
      latestApplication: c.applications[0] || null,
    }));

    return successResponse(res, enriched);
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const company = await prisma.company.findFirst({
      where: { id, userId },
      include: {
        applications: {
          orderBy: { applicationDate: 'desc' },
          include: { interviews: true },
        },
      },
    });

    if (!company) {
      return errorResponse(res, 'Company not found', 404);
    }

    return successResponse(res, company);
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { name, website, location, industry, contactPerson, contactEmail, notes } = req.body;

    if (!name) {
      return errorResponse(res, 'Company name is required', 400);
    }

    const existing = await prisma.company.findFirst({
      where: { userId, name: name.trim() },
    });

    if (existing) {
      return errorResponse(res, 'A company with this name already exists', 409);
    }

    const company = await prisma.company.create({
      data: {
        userId,
        name: name.trim(),
        website,
        location,
        industry,
        contactPerson,
        contactEmail,
        notes,
      },
    });

    return successResponse(res, company, 'Company created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.company.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return errorResponse(res, 'Company not found', 404);
    }

    const company = await prisma.company.update({
      where: { id },
      data: req.body,
    });

    return successResponse(res, company, 'Company updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.company.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return errorResponse(res, 'Company not found', 404);
    }

    await prisma.company.delete({
      where: { id },
    });

    return successResponse(res, null, 'Company deleted successfully');
  } catch (error) {
    next(error);
  }
};
