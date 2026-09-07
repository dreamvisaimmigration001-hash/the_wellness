import { SiteSettingsDTO } from '../settings';
import { createProcedure } from './core';

export const getSettingsProcedure = createProcedure<undefined, SiteSettingsDTO>({
  name: 'getSettings',
  method: 'GET',
  path: '/',
  description: 'Retrieve site settings including announcement and deals',
});

export const updateSettingsProcedure = createProcedure<Record<string, unknown>, SiteSettingsDTO>({
  name: 'updateSettings',
  method: 'PUT',
  path: '/',
  authRequired: true,
  description: 'Update site settings',
});
