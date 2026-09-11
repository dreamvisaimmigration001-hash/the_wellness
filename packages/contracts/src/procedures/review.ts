import { ReviewDTO } from '../review';
import { createProcedure } from './core';

export const getReviewsProcedure = createProcedure<undefined, ReviewDTO[]>({
  name: 'getReviews',
  method: 'GET',
  path: '/',
  description: 'Retrieve list of customer reviews/testimonials',
});

export const createReviewProcedure = createProcedure<Record<string, unknown>, ReviewDTO>({
  name: 'createReview',
  method: 'POST',
  path: '/',
  authRequired: true,
  description: 'Create a new customer review',
});

export const updateReviewProcedure = createProcedure<Record<string, unknown>, ReviewDTO>({
  name: 'updateReview',
  method: 'PUT',
  path: '/:id',
  authRequired: true,
  description: 'Update an existing customer review',
});

export const deleteReviewProcedure = createProcedure<undefined, { id: string }>({
  name: 'deleteReview',
  method: 'DELETE',
  path: '/:id',
  authRequired: true,
  description: 'Delete a customer review',
});
