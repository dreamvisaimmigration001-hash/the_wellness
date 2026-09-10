import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let envDbUrl = process.env.DATABASE_URL;
if (!envDbUrl) {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('DATABASE_URL=')) {
        envDbUrl = trimmed.substring('DATABASE_URL='.length).trim();
        break;
      }
    }
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: envDbUrl || 'postgres://postgres:password@localhost:5432/wellness',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/server.ts',
        'src/lib/razorpay.ts',
        'src/performance/**',
        'scripts/**',
        '**/*.test.ts',
        '**/*.d.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 85,
        functions: 80,
        lines: 80,
      },
    },
  },
});
