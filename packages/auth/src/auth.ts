import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { env } from '@wellness/config';
import { db } from '@wellness/db';

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  trustedOrigins: [
    ...(() => {
      if (!env.CORS_ORIGIN || env.CORS_ORIGIN === '*') {
        throw new Error('CORS_ORIGIN must be a specific absolute origin, not a wildcard');
      }
      return env.CORS_ORIGIN.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    })(),
    ...(env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
    // Allows DB-based state verification without being blocked by cross-origin cookie restrictions
    skipStateCookieCheck: true,
  },
  advanced: {
    // Required for cross-origin cookies between vercel.app and onrender.com
    defaultCookieAttributes: {
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
    },
  },
  onAPIError: {
    // Redirect auth errors to your frontend instead of backend root
    errorURL: `${env.CORS_ORIGIN.split(',')[0].trim()}/account`,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'customer',
        required: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
