import { z } from 'zod';

// Password validation schema with strong requirements
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Username validation schema
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

// Email validation schema with strict rules
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email must be less than 254 characters')
  .regex(/^[^@]+@[^@]+\.[^@]+$/, 'Invalid email format');

// Registration validation schema
export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
});

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// Password change validation schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // Check for sequential patterns
  const sequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
  return !sequential.test(data.newPassword);
}, {
  message: "Password cannot contain sequential patterns",
  path: ["newPassword"],
}).refine((data) => {
  // Check for common dictionary words
  const commonWords = ['password', 'admin', 'user', 'login', '123456', 'qwerty'];
  return !commonWords.some(word => data.newPassword.toLowerCase().includes(word));
}, {
  message: "Password cannot contain common words",
  path: ["newPassword"],
});

// Format login request body
export const formatLoginRequest = (email: string, password: string) => ({
  email,
  password
});
