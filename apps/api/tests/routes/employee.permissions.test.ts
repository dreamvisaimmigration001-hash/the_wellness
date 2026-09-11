import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { app } from '../../src/app';
import { factories } from '../helpers/factories';

describe('Employee Admin Permissions Access', () => {
  let employeeToken: string;
  let orderId: string;

  beforeEach(async () => {
    // 1. Create employee
    const empUser = await factories.createUser({
      name: 'Staff Operator',
      email: 'operator@wellness.local',
    });
    await factories.assignRole(empUser.id, 'employee');
    const empSession = await factories.createSession(empUser.id);
    employeeToken = empSession.token;

    // 2. Create customer and order
    const cust = await factories.createUser({ name: 'Buyer', email: 'buyer@wellness.local' });
    const product = await factories.createProduct();
    // Simulate order in DB
    const resOrder = await request(app)
      .post('/api/orders')
      .set('Cookie', [
        `better-auth.session_token=${(await factories.createSession(cust.id)).token}`,
      ])
      .send({
        items: [{ productId: product.id, quantity: 1, unitPrice: 100 }],
        shippingAddress: {
          fullName: 'Buyer Doe',
          addressLine1: '123 Test St',
          city: 'City',
          state: 'State',
          postalCode: '123456',
          phone: '9876543210',
        },
        billingSameAsShipping: true,
        paymentMethod: 'razorpay',
      });

    const body = resOrder.body as { data?: { id: string } };
    orderId = body.data?.id ?? '';
  });

  afterEach(async () => {
    await factories.cleanup();
  });

  it('allows employee to view all orders (admin capability)', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Cookie', [`better-auth.session_token=${employeeToken}`]);

    expect(res.status).toBe(200);
    const body = res.body as { success: boolean; data: unknown[] };
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('allows employee to update order status (admin capability)', async () => {
    if (!orderId) return;
    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Cookie', [`better-auth.session_token=${employeeToken}`])
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    const body = res.body as { success: boolean; data: { status: string } };
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('confirmed');
  });

  it('allows employee to access analytics (admin capability)', async () => {
    const res = await request(app)
      .get('/api/analytics')
      .set('Cookie', [`better-auth.session_token=${employeeToken}`]);

    expect(res.status).toBe(200);
    const body = res.body as { success: boolean };
    expect(body.success).toBe(true);
  });
});
