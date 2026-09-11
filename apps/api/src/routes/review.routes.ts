import { Router } from 'express';

import {
  bindProcedure,
  getReviewsProcedure,
  createReviewProcedure,
  updateReviewProcedure,
  deleteReviewProcedure,
} from '@wellness/contracts';
import { asyncHandler } from '@wellness/utils';
import { createReviewSchema, updateReviewSchema, reviewIdParamSchema } from '@wellness/validation';

import { requireAuth } from '../middleware/auth.middleware';
import { resolveRoles, requireRole } from '../middleware/authorization.middleware';
import { reviewService } from '../services/review.service';

const router = Router();

// GET /api/reviews - Public retrieval of approved reviews (or all if admin ?all=true)
bindProcedure(
  router,
  getReviewsProcedure,
  asyncHandler(async (req, res) => {
    const all = req.query.all === 'true';
    const list = await reviewService.getReviews(all);
    res.json({ success: true, data: list });
  }),
);

// POST /api/reviews - Protected (employee or admin) creation of a review
bindProcedure(
  router,
  createReviewProcedure,
  requireAuth,
  resolveRoles,
  requireRole('employee', 'admin'),
  asyncHandler(async (req, res) => {
    const input = createReviewSchema.parse(req.body);
    const created = await reviewService.createReview(input);
    res.status(201).json({ success: true, data: created });
  }),
);

// PUT /api/reviews/:id - Protected (employee or admin) update
bindProcedure(
  router,
  updateReviewProcedure,
  requireAuth,
  resolveRoles,
  requireRole('employee', 'admin'),
  asyncHandler(async (req, res) => {
    const { id } = reviewIdParamSchema.parse(req.params);
    const input = updateReviewSchema.parse(req.body);
    const updated = await reviewService.updateReview(id, input);
    res.json({ success: true, data: updated });
  }),
);

// DELETE /api/reviews/:id - Protected (employee or admin) delete
bindProcedure(
  router,
  deleteReviewProcedure,
  requireAuth,
  resolveRoles,
  requireRole('employee', 'admin'),
  asyncHandler(async (req, res) => {
    const { id } = reviewIdParamSchema.parse(req.params);
    const result = await reviewService.deleteReview(id);
    res.json({ success: true, data: result });
  }),
);

export const reviewRouter = router;
export default router;
