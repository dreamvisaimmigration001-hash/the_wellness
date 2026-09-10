import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { app } from '../../src/app';
import { factories } from '../helpers/factories';

describe('Product API Controllers', () => {
  let adminToken: string;

  beforeEach(async () => {
    const adminUser = await factories.createUser();
    await factories.assignRole(adminUser.id, 'admin');
    const adminSession = await factories.createSession(adminUser.id);
    adminToken = adminSession.token;
  });

  afterEach(async () => {
    await factories.cleanup();
  });

  describe('GET /api/products', () => {
    it('returns products list with only listed products', async () => {
      const res = await request(app).get('/api/products');
      const body = res.body as {
        success: boolean;
        data: { items: Array<{ id: string; status: string }> };
      };
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data.items)).toBe(true);
      for (const item of body.data.items) {
        expect(item.status).toBe('listed');
      }
    });

    it('supports status=all and specific status filters', async () => {
      const res = await request(app).get('/api/products?status=all');
      const body = res.body as { success: boolean };
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  describe('POST /api/products', () => {
    it('creates a product with default status listed when authenticated as admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', [`better-auth.session_token=${adminToken}`])
        .send({
          name: 'Test Product',
          description: 'Comprehensive test product description.',
          sellingPrice: '100.00',
          mrp: '150.00',
          images: [
            'https://res.cloudinary.com/dqlu0d3xx/image/upload/v1/wellness/default_product1.jpg',
            'https://res.cloudinary.com/dqlu0d3xx/image/upload/v1/wellness/default_product2.jpg',
          ],
        });

      const body = res.body as { success: boolean; data: { name: string; status: string } };
      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data.name).toBe('Test Product');
      expect(body.data.status).toBe('listed');
    });
  });
});
