import { Router } from 'express';

import { bindProcedure, getSettingsProcedure, updateSettingsProcedure } from '@wellness/contracts';
import { asyncHandler } from '@wellness/utils';
import { updateSiteSettingsSchema } from '@wellness/validation';

import { requireAuth } from '../middleware/auth.middleware';
import { resolveRoles, requireRole } from '../middleware/authorization.middleware';
import { settingsService } from '../services/settings.service';

const router = Router();

// GET /api/settings - Public retrieval of site settings
bindProcedure(
  router,
  getSettingsProcedure,
  asyncHandler(async (_req, res) => {
    const settings = await settingsService.getSettings();
    res.json({ success: true, data: settings });
  }),
);

// PUT /api/settings - Staff update of site settings
bindProcedure(
  router,
  updateSettingsProcedure,
  requireAuth,
  resolveRoles,
  requireRole('admin', 'employee'),
  asyncHandler(async (req, res) => {
    const input = updateSiteSettingsSchema.parse(req.body);
    const updated = await settingsService.updateSettings(input);
    res.json({ success: true, data: updated });
  }),
);

export const settingsRouter = router;
export default router;
