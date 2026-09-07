export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const APP_URL: string =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export const RAZORPAY_KEY_ID: string = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

export const CLOUDINARY_CLOUD_NAME: string = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
