import { CLOUDINARY_CLOUD_NAME as CONFIG_CLOUD_NAME } from './config';

export const CLOUDINARY_CLOUD_NAME: string = CONFIG_CLOUD_NAME || 'dqlu0d3xx';

const buildWellnessUrl = (filename: string): string =>
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/wellness/${filename}`;

export const CLOUDINARY_IMAGES = {
  heroBottle: buildWellnessUrl('hero_bottle.jpg'),
  cardioStatin: buildWellnessUrl('cardiostatin.jpg'),
  neuroProtect: buildWellnessUrl('neuroprotect.jpg'),
  osteoFlex: buildWellnessUrl('osteoflex.jpg'),
  pediCare: buildWellnessUrl('pedicare.jpg'),
  immunoGuard: buildWellnessUrl('immunoguard.jpg'),
  dermaPure: buildWellnessUrl('dermapure.jpg'),
  defaultBanner: buildWellnessUrl('default_banner.jpg'),
  labResearch: buildWellnessUrl('lab_research.jpg'),
  medicalTeam: buildWellnessUrl('medical_team.jpg'),
  defaultProduct: buildWellnessUrl('default_product.jpg'),
};

export function getCloudinaryImageUrl(
  publicIdOrUrl?: string | null,
  fallback = CLOUDINARY_IMAGES.defaultProduct,
): string {
  if (!publicIdOrUrl || publicIdOrUrl.trim() === '') return fallback;
  if (
    publicIdOrUrl.startsWith('http://') ||
    publicIdOrUrl.startsWith('https://') ||
    publicIdOrUrl.startsWith('data:')
  ) {
    return publicIdOrUrl;
  }
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicIdOrUrl}`;
}
