import { z } from 'zod';

export const announcementSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  badge: z.string().max(100).default('Limited Offer'),
  text: z.string().max(500),
  code: z.string().max(100).optional().nullable(),
  cta: z.string().max(100).optional().nullable(),
  link: z.string().max(500).optional().nullable(),
});

export const dealsSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  discountPercentage: z.number().min(0).max(100).optional().nullable(),
  discountText: z.string().max(100).optional().nullable(),
  title: z.string().max(255).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  endTime: z.string().optional().nullable(),
});

export const updateSiteSettingsSchema = z.object({
  announcement: announcementSettingsSchema.partial().optional(),
  deals: dealsSettingsSchema.partial().optional(),
});

export type AnnouncementSettingsInput = z.infer<typeof announcementSettingsSchema>;
export type DealsSettingsInput = z.infer<typeof dealsSettingsSchema>;
export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
