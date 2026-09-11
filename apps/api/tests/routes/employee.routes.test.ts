import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { app } from '../../src/app';
import { factories } from '../helpers/factories';

describe('Employee API Routes (/api/admin/employees)', () => {
  let adminToken: string;
  let adminUserId: string;
  let employeeToken: string;
  let employeeUserId: string;
  let customerToken: string;
  let customerUserId: string;

  beforeEach(async () => {
    // 1. Create Admin
    const adminUser = await factories.createUser({
      name: 'Admin Boss',
      email: 'admin@wellness.local',
    });
    await factories.assignRole(adminUser.id, 'admin');
    const adminSession = await factories.createSession(adminUser.id);
    adminToken = adminSession.token;
    adminUserId = adminUser.id;

    // 2. Create Employee
    const empUser = await factories.createUser({
      name: 'Staff Member',
      email: 'staff@wellness.local',
    });
    await factories.assignRole(empUser.id, 'employee');
    const empSession = await factories.createSession(empUser.id);
    employeeToken = empSession.token;
    employeeUserId = empUser.id;

    // 3. Create Customer
    const custUser = await factories.createUser({
      name: 'Regular Customer',
      email: 'cust@wellness.local',
    });
    await factories.assignRole(custUser.id, 'customer');
    const custSession = await factories.createSession(custUser.id);
    customerToken = custSession.token;
    customerUserId = custUser.id;
  });

  afterEach(async () => {
    await factories.cleanup();
  });

  describe('Authorization access guards', () => {
    it('returns 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/admin/employees');
      expect(res.status).toBe(401);
    });

    it('returns 403 when accessed by a regular customer', async () => {
      const res = await request(app)
        .get('/api/admin/employees')
        .set('Cookie', [`better-auth.session_token=${customerToken}`]);
      expect(res.status).toBe(403);
    });

    it('returns 403 when accessed by an employee (admin only boundary)', async () => {
      const res = await request(app)
        .get('/api/admin/employees')
        .set('Cookie', [`better-auth.session_token=${employeeToken}`]);
      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/employees', () => {
    it('allows admin to list all users and employees', async () => {
      const res = await request(app)
        .get('/api/admin/employees')
        .set('Cookie', [`better-auth.session_token=${adminToken}`]);

      expect(res.status).toBe(200);
      const body = res.body as {
        success: boolean;
        data: Array<{ id: string; email: string; role: string }>;
      };
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThanOrEqual(3);

      const foundEmployee = body.data.find((u) => u.id === employeeUserId);
      expect(foundEmployee?.role).toBe('employee');
    });

    it('filters users by role', async () => {
      const res = await request(app)
        .get('/api/admin/employees?role=employee')
        .set('Cookie', [`better-auth.session_token=${adminToken}`]);

      expect(res.status).toBe(200);
      const body = res.body as { success: boolean; data: Array<{ role: string }> };
      expect(body.success).toBe(true);
      expect(body.data.every((u) => u.role === 'employee')).toBe(true);
    });
  });

  describe('POST /api/admin/employees', () => {
    it('allows admin to create a new employee', async () => {
      const res = await request(app)
        .post('/api/admin/employees')
        .set('Cookie', [`better-auth.session_token=${adminToken}`])
        .send({
          name: 'Jane Colleague',
          email: 'jane.colleague@wellness.local',
        });

      expect(res.status).toBe(201);
      const body = res.body as {
        success: boolean;
        data: { name: string; email: string; role: string };
      };
      expect(body.success).toBe(true);
      expect(body.data.role).toBe('employee');
      expect(body.data.email).toBe('jane.colleague@wellness.local');
    });

    it('allows admin to promote existing customer by adding their email', async () => {
      const res = await request(app)
        .post('/api/admin/employees')
        .set('Cookie', [`better-auth.session_token=${adminToken}`])
        .send({
          name: 'Regular Customer',
          email: 'cust@wellness.local',
        });

      expect(res.status).toBe(201);
      const body = res.body as { success: boolean; data: { id: string; role: string } };
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(customerUserId);
      expect(body.data.role).toBe('employee');
    });
  });

  describe('PATCH /api/admin/employees/:id/role', () => {
    it('allows admin to select a user and change their role to employee', async () => {
      const res = await request(app)
        .patch(`/api/admin/employees/${customerUserId}/role`)
        .set('Cookie', [`better-auth.session_token=${adminToken}`])
        .send({ role: 'employee' });

      expect(res.status).toBe(200);
      const body = res.body as { success: boolean; data: { id: string; role: string } };
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(customerUserId);
      expect(body.data.role).toBe('employee');
    });

    it('allows admin to demote an employee back to customer', async () => {
      const res = await request(app)
        .patch(`/api/admin/employees/${employeeUserId}/role`)
        .set('Cookie', [`better-auth.session_token=${adminToken}`])
        .send({ role: 'customer' });

      expect(res.status).toBe(200);
      const body = res.body as { success: boolean; data: { id: string; role: string } };
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(employeeUserId);
      expect(body.data.role).toBe('customer');
    });

    it('prevents admin from self-demoting', async () => {
      const res = await request(app)
        .patch(`/api/admin/employees/${adminUserId}/role`)
        .set('Cookie', [`better-auth.session_token=${adminToken}`])
        .send({ role: 'customer' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/admin/employees/:id', () => {
    it('allows admin to revoke employee role via DELETE', async () => {
      const res = await request(app)
        .delete(`/api/admin/employees/${employeeUserId}`)
        .set('Cookie', [`better-auth.session_token=${adminToken}`]);

      expect(res.status).toBe(200);
      const body = res.body as { success: boolean; data: { id: string; role: string } };
      expect(body.success).toBe(true);
      expect(body.data.role).toBe('customer');
    });
  });
});
