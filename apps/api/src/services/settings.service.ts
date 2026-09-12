import type {
  SiteSettingsDTO,
  AnnouncementSettingsDTO,
  DealsSettingsDTO,
  MarqueeSettingsDTO,
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

const DEFAULT_MARQUEE: MarqueeSettingsDTO = {
  enabled: true,
  speed: 35,
  items: [
    { id: '1', icon: 'ShieldCheck', title: 'WHO-GMP Certified', subtitle: 'Grade A/B Cleanrooms' },
    { id: '2', icon: 'Truck', title: 'Cold-Chain Delivery', subtitle: 'Temp-Monitored Transit' },
    {
      id: '3',
      icon: 'FlaskConical',
      title: '3rd-Party Lab Tested',
      subtitle: '100% Batch Released',
    },
    {
      id: '4',
      icon: 'Stethoscope',
      title: 'Clinical Specialist Oversight',
      subtitle: 'Physician Approved',
    },
    {
      id: '5',
      icon: 'Sparkles',
      title: 'High Bioavailability',
      subtitle: 'Active Therapeutic Yield',
    },
    {
      id: '6',
      icon: 'Award',
      title: 'ISO 9001:2015 Accredited',
      subtitle: 'End-to-End Traceability',
    },
    {
      id: '7',
      icon: 'HeartPulse',
      title: 'Evidence-Based Formulations',
      subtitle: 'Pure Clinical Potency',
    },
    {
      id: '8',
      icon: 'Lock',
      title: 'Tamper-Evident Medical Packaging',
      subtitle: 'Batch Coded & Sealed',
    },
  ],
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
      const rawMarquee = map.get('marquee');

      const announcement =
        typeof rawAnnouncement === 'object' && rawAnnouncement !== null
          ? (rawAnnouncement as Partial<AnnouncementSettingsDTO>)
          : {};
      const deals =
        typeof rawDeals === 'object' && rawDeals !== null
          ? (rawDeals as Partial<DealsSettingsDTO>)
          : {};
      const marquee =
        typeof rawMarquee === 'object' && rawMarquee !== null
          ? (rawMarquee as Partial<MarqueeSettingsDTO>)
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
        marquee: {
          ...DEFAULT_MARQUEE,
          ...marquee,
          items:
            Array.isArray(marquee.items) && marquee.items.length > 0
              ? marquee.items
              : DEFAULT_MARQUEE.items,
        },
      };
    } catch (err) {
      console.error('Error fetching settings from db, falling back to defaults:', err);
      return {
        announcement: DEFAULT_ANNOUNCEMENT,
        deals: DEFAULT_DEALS,
        marquee: DEFAULT_MARQUEE,
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

    if (input.marquee) {
      const updatedMarquee: MarqueeSettingsDTO = {
        enabled: input.marquee.enabled ?? current.marquee.enabled,
        speed: input.marquee.speed !== undefined ? input.marquee.speed : current.marquee.speed,
        items: input.marquee.items ?? current.marquee.items,
      };
      await db
        .insert(siteSettings)
        .values({
          key: 'marquee',
          value: updatedMarquee,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: updatedMarquee,
            updatedAt: new Date(),
          },
        });
      current.marquee = updatedMarquee;
    }

    return current;
  }
}

export const settingsService = new SettingsService();
