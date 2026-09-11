import { Router, Request } from 'express';
import { z } from 'zod';

import { asyncHandler, UnauthorizedError } from '@wellness/utils';

import { requireAuth } from '../middleware/auth.middleware';
import { resolveRoles, requireRole } from '../middleware/authorization.middleware';
import { employeeService, UserRole } from '../services/employee.service';

const router = Router();

// Strictly Admin-only authorization for all employee management endpoints
router.use(requireAuth, resolveRoles, requireRole('admin'));

const AddEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
});

const UpdateRoleSchema = z.object({
  role: z.enum(['customer', 'admin', 'employee']),
});

// GET /api/admin/employees - List users (filterable by role, searchable by name/email)
router.get(
  '/',
  asyncHandler(async (req: Request, res) => {
    const roleParam = typeof req.query.role === 'string' ? req.query.role : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    let role: UserRole | undefined;
    if (roleParam === 'customer' || roleParam === 'admin' || roleParam === 'employee') {
      role = roleParam;
    }

    const users = await employeeService.listUsers({ role, search });
    res.json({ success: true, data: users });
  }),
);

// POST /api/admin/employees - Add an employee (or promote existing customer)
router.post(
  '/',
  asyncHandler(async (req: Request, res) => {
    const input = AddEmployeeSchema.parse(req.body);
    const employee = await employeeService.addEmployee(input);
    res.status(201).json({ success: true, data: employee });
  }),
);

// PATCH /api/admin/employees/:id/role - Change the role of a particular user
router.patch(
  '/:id/role',
  asyncHandler(async (req: Request, res) => {
    const currentAdminId = req.auth?.userId;
    if (!currentAdminId) {
      throw new UnauthorizedError();
    }

    const targetUserId = req.params.id as string;
    const { role } = UpdateRoleSchema.parse(req.body);

    const updated = await employeeService.updateUserRole(targetUserId, role, currentAdminId);
    res.json({ success: true, data: updated });
  }),
);

// DELETE /api/admin/employees/:id - Revoke employee role (reverts to customer)
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res) => {
    const currentAdminId = req.auth?.userId;
    if (!currentAdminId) {
      throw new UnauthorizedError();
    }

    const targetUserId = req.params.id as string;
    const updated = await employeeService.updateUserRole(targetUserId, 'customer', currentAdminId);
    res.json({ success: true, data: updated, message: 'Employee role revoked successfully' });
  }),
);

export const employeeRoutes = router;
export default router;
