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

export const marqueeItemSchema = z.object({
  id: z.string().optional().nullable(),
  icon: z.string().max(50).default('ShieldCheck'),
  title: z.string().min(1, 'Title is required').max(100),
  subtitle: z.string().min(1, 'Subtitle is required').max(100),
});

export const marqueeSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  speed: z.number().min(5).max(120).default(35).optional().nullable(),
  items: z.array(marqueeItemSchema).min(1, 'At least one marquee item is required'),
});

export const updateSiteSettingsSchema = z.object({
  announcement: announcementSettingsSchema.partial().optional(),
  deals: dealsSettingsSchema.partial().optional(),
  marquee: marqueeSettingsSchema.partial().optional(),
});

export type AnnouncementSettingsInput = z.infer<typeof announcementSettingsSchema>;
export type DealsSettingsInput = z.infer<typeof dealsSettingsSchema>;
export type MarqueeItemInput = z.infer<typeof marqueeItemSchema>;
export type MarqueeSettingsInput = z.infer<typeof marqueeSettingsSchema>;
export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
