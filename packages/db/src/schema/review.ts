import { pgTable, varchar, text, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

import { products } from './product';

export const reviews = pgTable('review', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  rating: integer('rating').default(5).notNull(),
  comment: text('comment').notNull(),
  avatarText: varchar('avatar_text', { length: 10 }),
  designation: varchar('designation', { length: 255 }).default('Verified Buyer'),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  isApproved: boolean('is_approved').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
