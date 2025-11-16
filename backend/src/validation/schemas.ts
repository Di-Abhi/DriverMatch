import { z } from 'zod';

const phoneSchema = z
  .string()
  .regex(/^[0-9]{7,15}$/, { message: 'Invalid phone number' })
  .optional();

export const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  name: z.string().min(1, { message: 'Name is required' }),
  phone: phoneSchema,
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  type: z.enum(['CUSTOMER', 'DRIVER'], { errorMap: () => ({ message: 'Type must be CUSTOMER or DRIVER' }) })
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(1, { message: 'Password is required' })
});

export const driverProfileSchema = z.object({
  serviceType: z.enum(['HOURLY', 'PART_TIME', 'FULL_TIME', 'WEEKLY', 'MONTHLY']),
  rate: z.number().positive({ message: 'Rate must be greater than 0' }),
  experience: z.number().min(0, { message: 'Experience must be >= 0' }),
  location: z.string().min(1, { message: 'Location is required' }),
  bio: z.string().max(1000).optional().nullable()
});

export const driverProfileUpdateSchema = driverProfileSchema.partial();

export const createRequestSchema = z.object({
  driverId: z.string().min(1, { message: 'driverId is required' }),
  serviceType: z.string().min(1, { message: 'serviceType is required' }),
  location: z.string().min(1, { message: 'location is required' }),
  message: z.string().max(1000).optional().nullable()
});
