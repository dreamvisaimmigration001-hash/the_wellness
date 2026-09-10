import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { app } from '../../src/app';
import { factories } from '../helpers/factories';

describe('Analytics API Controllers', () => {
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

  describe('GET /api/analytics', () => {
    it('returns analytics summary data', async () => {
      const res = await request(app)
        .get('/api/analytics')
        .set('Cookie', [`better-auth.session_token=${adminToken}`]);
      const body = res.body as {
        success: boolean;
        data: { totalOrdersCount: number; productPerformance: unknown[] };
      };
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(typeof body.data.totalOrdersCount).toBe('number');
      expect(Array.isArray(body.data.productPerformance)).toBe(true);
    });
  });

  describe('GET /api/analytics/products', () => {
    it('returns products analytics list', async () => {
      const res = await request(app)
        .get('/api/analytics/products')
        .set('Cookie', [`better-auth.session_token=${adminToken}`]);
      const body = res.body as { success: boolean; data: unknown[] };
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });
});
