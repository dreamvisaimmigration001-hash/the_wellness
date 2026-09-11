import { z } from 'zod';

export const createReviewSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .regex(/^[^<>]*$/, 'HTML tags are not allowed'),
    rating: z.coerce.number().int().min(1).max(5).default(5),
    comment: z
      .string()
      .trim()
      .min(3, 'Comment must be at least 3 characters')
      .max(2000, 'Comment must be at most 2000 characters'),
    avatarText: z.string().trim().max(10).optional().nullable(),
    designation: z.string().trim().max(100).optional().nullable(),
    productId: z.string().uuid().optional().nullable(),
    isApproved: z.boolean().default(true),
    displayOrder: z.coerce.number().int().default(0),
  })
  .strict();

export const updateReviewSchema = createReviewSchema.partial();

export const reviewIdParamSchema = z.object({
  id: z.string().uuid('Invalid review ID'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
