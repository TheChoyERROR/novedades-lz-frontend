import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
  resolve: {
    // Mismo alias que usa tsconfig, para que los tests importen igual que la app.
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
