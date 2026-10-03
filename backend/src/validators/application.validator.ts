import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position / Job title is required'),
    location: z.string().optional().nullable(),
    locationType: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).default('REMOTE'),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).default('FULL_TIME'),
    salary: z.string().optional().nullable(),
    status: z.enum(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED']).default('APPLIED'),
    applicationDate: z.string().optional().nullable(),
    jobDescription: z.string().optional().nullable(),
    jobUrl: z.string().url('Please enter a valid job URL').optional().or(z.literal('')).nullable(),
    contactPerson: z.string().optional().nullable(),
    contactEmail: z.string().email().optional().or(z.literal('')).nullable(),
    cvUsed: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    rating: z.number().min(1).max(5).optional().default(3),
    companyId: z.string().optional().nullable(),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    companyName: z.string().min(1).optional(),
    position: z.string().min(1).optional(),
    location: z.string().optional().nullable(),
    locationType: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).optional(),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
    salary: z.string().optional().nullable(),
    status: z.enum(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED']).optional(),
    applicationDate: z.string().optional().nullable(),
    jobDescription: z.string().optional().nullable(),
    jobUrl: z.string().url().optional().or(z.literal('')).nullable(),
    contactPerson: z.string().optional().nullable(),
    contactEmail: z.string().email().optional().or(z.literal('')).nullable(),
    cvUsed: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    rating: z.number().min(1).max(5).optional(),
    companyId: z.string().optional().nullable(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED']),
  }),
});
