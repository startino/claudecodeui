import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Scoped vitest setup. Kept separate from vite.config.js to avoid
// pulling proxy/loadEnv logic into the test pipeline. Initially scoped
// to the chat composer hook tests; broaden `include` as more tests land.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    // Existing tests written against node:test live alongside the codebase.
    // Vitest 4.x treats files with no vitest suites as failures, so opt them
    // out here. They keep running under their own runner if invoked directly.
    exclude: [
      '**/node_modules/**',
      'src/components/sidebar/utils/utils.test.ts',
      'src/components/sidebar/hooks/transcriptSearchData.test.ts',
      'src/components/main-content/view/subcomponents/getSessionTitle.test.ts',
      'src/stores/useSessionStore.test.ts',
    ],
    setupFiles: ['./vitest.setup.ts'],
  },
});
