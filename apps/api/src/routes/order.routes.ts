import { Router, Request } from 'express';
import { z } from 'zod';

import {
  bindProcedure,
  createOrderProcedure,
  getOrdersProcedure,
  getOrderByIdProcedure,
  updateOrderStatusProcedure,
} from '@wellness/contracts';
import { asyncHandler, UnauthorizedError } from '@wellness/utils';
import { createOrderSchema, CartIdHeaderSchema } from '@wellness/validation';

import { requireAuth } from '../middleware/auth.middleware';
import { resolveRoles, requireRole } from '../middleware/authorization.middleware';
import { orderService } from '../services/order.service';

const router = Router();

function getUserId(req: Request): string | undefined {
  return req.auth?.userId;
}

function getCartId(req: Request): string | undefined {
  const headerVal = req.headers['x-cart-id'];
  if (!headerVal || typeof headerVal !== 'string') return undefined;
  const result = CartIdHeaderSchema.safeParse(headerVal);
  return result.success ? result.data : undefined;
}

bindProcedure(
  router,
  createOrderProcedure,
  requireAuth,
  asyncHandler(async (req: Request, res) => {
    const userId = getUserId(req);
    if (!userId) {
      throw new UnauthorizedError('Authentication required to place an order. Please log in.');
    }
    const input = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(input, userId, getCartId(req));
    res.status(201).json({ success: true, data: order });
  }),
);

bindProcedure(
  router,
  getOrderByIdProcedure,
  requireAuth,
  resolveRoles,
  asyncHandler(async (req, res) => {
    const id = z.string().uuid('Invalid order ID format').parse(req.params.id);
    const userId = req.auth?.userId;
    if (!userId) {
      throw new UnauthorizedError();
    }
    const isStaff = req.auth?.roles.some((r) => r === 'admin' || r === 'employee') ?? false;
    const order = await orderService.getOrderById(id, userId, isStaff);
    res.json({ success: true, data: order });
  }),
);

bindProcedure(
  router,
  getOrdersProcedure,
  requireAuth,
  resolveRoles,
  asyncHandler(async (req: Request, res) => {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new UnauthorizedError();
    }
    const isStaff = req.auth?.roles.some((r) => r === 'admin' || r === 'employee') ?? false;
    const orders = await orderService.getOrders(isStaff ? undefined : userId);
    res.json({ success: true, data: orders });
  }),
);

bindProcedure(
  router,
  updateOrderStatusProcedure,
  requireAuth,
  resolveRoles,
  requireRole('admin', 'employee'),
  asyncHandler(async (req: Request, res) => {
    const id = z.string().uuid('Invalid order ID format').parse(req.params.id);
    const body = z
      .object({
        status: z.enum([
          'pending',
          'confirmed',
          'processing',
          'shipped',
          'out_for_delivery',
          'delivered',
          'cancelled',
        ]),
      })
      .parse(req.body);
    const order = await orderService.updateOrderStatus(id, body.status);
    res.json({ success: true, data: order });
  }),
);

export const orderRouter = router;
export default router;
