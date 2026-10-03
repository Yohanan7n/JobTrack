import { Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 409);
    }

    const hashedPassword = await hashPassword(password);

    // If first user, make ADMIN, otherwise USER
    const count = await prisma.user.count();
    const role = count === 0 ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(
      res,
      { user, token },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    if (user.status === 'SUSPENDED') {
      return errorResponse(res, 'Account is suspended. Please contact support.', 403);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, avatar, currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;

    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(res, 'Current password is required to set a new password', 400);
      }
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return errorResponse(res, 'Current password does not match', 400);
      }
      updateData.password = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        updatedAt: true,
      },
    });

    return successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Don't disclose whether user exists or not for security
    return successResponse(
      res,
      null,
      'If an account exists with that email, a password reset link has been dispatched.'
    );
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
      return errorResponse(res, 'No image file uploaded', 400);
    }

    const avatarUrl = `/uploads/${file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        updatedAt: true,
      },
    });

    return successResponse(res, updatedUser, 'Profile picture updated successfully');
  } catch (error) {
    next(error);
  }
};
