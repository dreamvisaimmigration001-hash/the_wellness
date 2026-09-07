import type {
  SiteSettingsDTO,
  AnnouncementSettingsDTO,
  DealsSettingsDTO,
} from '@wellness/contracts';
import { db, siteSettings, pool } from '@wellness/db';
import type { UpdateSiteSettingsInput } from '@wellness/validation';

const DEFAULT_ANNOUNCEMENT: AnnouncementSettingsDTO = {
  enabled: true,
  badge: 'Limited Offer',
  text: 'Save 20% on your first order with code',
  code: 'WELLNESS20',
  cta: 'Shop Now',
  link: '/products',
};

const DEFAULT_DEALS: DealsSettingsDTO = {
  enabled: true,
  discountPercentage: 25,
  discountText: 'Up to 25% OFF',
  title: 'Daily Clinical Deals',
  description: 'Exclusive daily discounts on essential medications and healthcare formulations.',
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export class SettingsService {
  private tableEnsured = false;

  private async ensureTable() {
    if (this.tableEnsured) return;
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS site_setting (
          key varchar(100) PRIMARY KEY,
          value jsonb NOT NULL,
          updated_at timestamp with time zone DEFAULT now() NOT NULL
        );
      `);
      this.tableEnsured = true;
    } catch (err) {
      console.warn('Could not auto-ensure site_setting table:', err);
    }
  }

  async getSettings(): Promise<SiteSettingsDTO> {
    await this.ensureTable();
    try {
      const rows = await db.select().from(siteSettings);
      const map = new Map<string, unknown>();
      for (const row of rows) {
        map.set(row.key, row.value);
      }

      const rawAnnouncement = map.get('announcement');
      const rawDeals = map.get('deals');

      const announcement =
        typeof rawAnnouncement === 'object' && rawAnnouncement !== null
          ? (rawAnnouncement as Partial<AnnouncementSettingsDTO>)
          : {};
      const deals =
        typeof rawDeals === 'object' && rawDeals !== null
          ? (rawDeals as Partial<DealsSettingsDTO>)
          : {};

      return {
        announcement: {
          ...DEFAULT_ANNOUNCEMENT,
          ...announcement,
        },
        deals: {
          ...DEFAULT_DEALS,
          ...deals,
        },
      };
    } catch (err) {
      console.error('Error fetching settings from db, falling back to defaults:', err);
      return {
        announcement: DEFAULT_ANNOUNCEMENT,
        deals: DEFAULT_DEALS,
      };
    }
  }

  async updateSettings(input: UpdateSiteSettingsInput): Promise<SiteSettingsDTO> {
    await this.ensureTable();
    const current = await this.getSettings();

    if (input.announcement) {
      const updatedAnnouncement: AnnouncementSettingsDTO = {
        enabled: input.announcement.enabled ?? current.announcement.enabled,
        badge: input.announcement.badge ?? current.announcement.badge,
        text: input.announcement.text ?? current.announcement.text,
        code:
          input.announcement.code !== undefined
            ? input.announcement.code
            : current.announcement.code,
        cta:
          input.announcement.cta !== undefined ? input.announcement.cta : current.announcement.cta,
        link:
          input.announcement.link !== undefined
            ? input.announcement.link
            : current.announcement.link,
      };
      await db
        .insert(siteSettings)
        .values({
          key: 'announcement',
          value: updatedAnnouncement,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: updatedAnnouncement,
            updatedAt: new Date(),
          },
        });
      current.announcement = updatedAnnouncement;
    }

    if (input.deals) {
      const updatedDeals: DealsSettingsDTO = {
        enabled: input.deals.enabled ?? current.deals.enabled,
        discountPercentage:
          input.deals.discountPercentage !== undefined
            ? input.deals.discountPercentage
            : current.deals.discountPercentage,
        discountText:
          input.deals.discountText !== undefined
            ? input.deals.discountText
            : current.deals.discountText,
        title: input.deals.title !== undefined ? input.deals.title : current.deals.title,
        description:
          input.deals.description !== undefined
            ? input.deals.description
            : current.deals.description,
        endTime: input.deals.endTime !== undefined ? input.deals.endTime : current.deals.endTime,
      };
      await db
        .insert(siteSettings)
        .values({
          key: 'deals',
          value: updatedDeals,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: updatedDeals,
            updatedAt: new Date(),
          },
        });
      current.deals = updatedDeals;
    }

    return current;
  }
}

export const settingsService = new SettingsService();
