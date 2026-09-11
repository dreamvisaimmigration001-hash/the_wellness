import type { ReviewDTO } from '@wellness/contracts';
import { db, reviews, eq, desc, asc } from '@wellness/db';
import type { CreateReviewInput, UpdateReviewInput } from '@wellness/validation';

const SEED_REVIEWS: Array<{
  name: string;
  avatarText: string;
  designation: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  displayOrder: number;
}> = [
  {
    name: 'Anita Sharma',
    avatarText: 'AS',
    designation: 'Verified Patient',
    rating: 5,
    comment:
      'Very fast delivery and genuine products. The medicines were safely packed with batch codes verified. Highly recommended!',
    isApproved: true,
    displayOrder: 1,
  },
  {
    name: 'Rohit Verma',
    avatarText: 'RV',
    designation: 'Verified Buyer',
    rating: 5,
    comment:
      'Excellent service and prompt support for dosage advice. Website is super smooth and easy to order from.',
    isApproved: true,
    displayOrder: 2,
  },
  {
    name: 'Priya Nair',
    avatarText: 'PN',
    designation: 'Verified Patient',
    rating: 5,
    comment:
      'Great offers and transparent pricing. Received cold-chain medicines on time in pristine insulated packaging.',
    isApproved: true,
    displayOrder: 3,
  },
];

export class ReviewService {
  private seeded = false;

  private async autoSeed() {
    if (this.seeded) return;
    try {
      const existing = await db.select({ id: reviews.id }).from(reviews).limit(1);
      if (existing.length === 0) {
        for (const seed of SEED_REVIEWS) {
          await db.insert(reviews).values(seed);
        }
      }
      this.seeded = true;
    } catch (err) {
      console.warn('Could not auto-seed reviews:', err);
    }
  }

  async getReviews(all = false): Promise<ReviewDTO[]> {
    await this.autoSeed();

    const query = db.select().from(reviews);

    const rows = all
      ? await query.orderBy(asc(reviews.displayOrder), desc(reviews.createdAt))
      : await query
          .where(eq(reviews.isApproved, true))
          .orderBy(asc(reviews.displayOrder), desc(reviews.createdAt));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      avatarText: r.avatarText || r.name.slice(0, 2).toUpperCase(),
      designation: r.designation || 'Verified Buyer',
      productId: r.productId,
      isApproved: r.isApproved,
      displayOrder: r.displayOrder,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async createReview(data: CreateReviewInput): Promise<ReviewDTO> {
    const avatar = data.avatarText || data.name.slice(0, 2).toUpperCase();

    const [created] = await db
      .insert(reviews)
      .values({
        name: data.name,
        rating: data.rating,
        comment: data.comment,
        avatarText: avatar,
        designation: data.designation || 'Verified Buyer',
        productId: data.productId || null,
        isApproved: data.isApproved,
        displayOrder: data.displayOrder,
      })
      .returning();

    if (!created) {
      throw new Error('Failed to create review');
    }

    return {
      id: created.id,
      name: created.name,
      rating: created.rating,
      comment: created.comment,
      avatarText: created.avatarText,
      designation: created.designation,
      productId: created.productId,
      isApproved: created.isApproved,
      displayOrder: created.displayOrder,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async updateReview(id: string, data: UpdateReviewInput): Promise<ReviewDTO> {
    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.rating !== undefined) updatePayload.rating = data.rating;
    if (data.comment !== undefined) updatePayload.comment = data.comment;
    if (data.avatarText !== undefined) updatePayload.avatarText = data.avatarText;
    if (data.designation !== undefined) updatePayload.designation = data.designation;
    if (data.productId !== undefined) updatePayload.productId = data.productId;
    if (data.isApproved !== undefined) updatePayload.isApproved = data.isApproved;
    if (data.displayOrder !== undefined) updatePayload.displayOrder = data.displayOrder;

    const [updated] = await db
      .update(reviews)
      .set(updatePayload)
      .where(eq(reviews.id, id))
      .returning();

    if (!updated) {
      throw new Error('Review not found');
    }

    return {
      id: updated.id,
      name: updated.name,
      rating: updated.rating,
      comment: updated.comment,
      avatarText: updated.avatarText,
      designation: updated.designation,
      productId: updated.productId,
      isApproved: updated.isApproved,
      displayOrder: updated.displayOrder,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteReview(id: string): Promise<{ id: string }> {
    const [deleted] = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning({ id: reviews.id });
    if (!deleted) {
      throw new Error('Review not found');
    }
    return deleted;
  }
}

export const reviewService = new ReviewService();
