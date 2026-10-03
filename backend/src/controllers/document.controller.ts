import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { prisma } from '../services/prisma.service';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getDocuments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { fileType } = req.query as { fileType?: string };

    const where: any = { userId };
    if (fileType) {
      where.fileType = fileType;
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        application: {
          select: { id: true, companyName: true, position: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, documents);
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const { title, fileType = 'RESUME', applicationId } = req.body;

    const fileUrl = `/uploads/${file.filename}`;

    const document = await prisma.document.create({
      data: {
        userId,
        applicationId: applicationId || null,
        title: title || file.originalname,
        fileName: file.originalname,
        fileType,
        fileUrl,
        fileSize: file.size,
      },
      include: {
        application: {
          select: { id: true, companyName: true, position: true },
        },
      },
    });

    return successResponse(res, document, 'Document uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const doc = await prisma.document.findFirst({
      where: { id, userId },
    });

    if (!doc) {
      return errorResponse(res, 'Document not found', 404);
    }

    // Try deleting physical file if it exists
    try {
      const fileName = path.basename(doc.fileUrl);
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn('Could not delete physical file:', err);
    }

    await prisma.document.delete({ where: { id } });

    return successResponse(res, null, 'Document deleted successfully');
  } catch (error) {
    next(error);
  }
};
