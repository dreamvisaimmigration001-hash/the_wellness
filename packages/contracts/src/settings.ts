export type AnnouncementSettingsDTO = {
  enabled: boolean;
  badge: string;
  text: string;
  code?: string | null | undefined;
  cta?: string | null | undefined;
  link?: string | null | undefined;
};

export type DealsSettingsDTO = {
  enabled: boolean;
  discountPercentage?: number | null | undefined;
  discountText?: string | null | undefined;
  title?: string | null | undefined;
  description?: string | null | undefined;
  endTime?: string | null | undefined;
};

export type MarqueeItemDTO = {
  id?: string | null | undefined;
  icon: string;
  title: string;
  subtitle: string;
};

export type MarqueeSettingsDTO = {
  enabled: boolean;
  speed?: number | null | undefined;
  items: MarqueeItemDTO[];
};

export type SiteSettingsDTO = {
  announcement: AnnouncementSettingsDTO;
  deals: DealsSettingsDTO;
  marquee: MarqueeSettingsDTO;
};
