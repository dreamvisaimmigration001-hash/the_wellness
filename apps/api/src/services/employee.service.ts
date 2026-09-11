import crypto from 'node:crypto';

import { db, user, eq, desc, and, or, ilike } from '@wellness/db';
import { BadRequestError, NotFoundError } from '@wellness/utils';

export type UserRole = 'customer' | 'admin' | 'employee';

export interface ListUsersParams {
  role?: UserRole | undefined;
  search?: string | undefined;
}

export class EmployeeService {
  async listUsers(params?: ListUsersParams) {
    const conditions = [];

    if (params?.role) {
      conditions.push(eq(user.role, params.role));
    }

    if (params?.search && params.search.trim().length > 0) {
      const term = `%${params.search.trim()}%`;
      conditions.push(or(ilike(user.name, term), ilike(user.email, term)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(whereClause)
      .orderBy(desc(user.createdAt));
  }

  async updateUserRole(targetUserId: string, newRole: UserRole, currentAdminId: string) {
    if (targetUserId === currentAdminId && newRole !== 'admin') {
      throw new BadRequestError('You cannot demote yourself from administrator');
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, targetUserId),
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        role: newRole,
        updatedAt: new Date(),
      })
      .where(eq(user.id, targetUserId))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    return updatedUser;
  }

  async addEmployee(input: { name: string; email: string }) {
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();

    if (!email || !name) {
      throw new BadRequestError('Name and valid email are required');
    }

    const existing = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existing) {
      if (existing.role === 'employee') {
        throw new BadRequestError(`User ${email} is already an employee`);
      }
      if (existing.role === 'admin') {
        throw new BadRequestError(`User ${email} is already an administrator`);
      }

      // Promote existing customer to employee
      const [promoted] = await db
        .update(user)
        .set({
          role: 'employee',
          name: existing.name || name,
          updatedAt: new Date(),
        })
        .where(eq(user.id, existing.id))
        .returning({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });

      return promoted;
    }

    // Create new pre-registered employee user
    const [created] = await db
      .insert(user)
      .values({
        id: crypto.randomUUID(),
        name,
        email,
        emailVerified: true,
        role: 'employee',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    return created;
  }
}

export const employeeService = new EmployeeService();
