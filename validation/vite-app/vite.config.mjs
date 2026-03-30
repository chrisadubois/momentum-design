import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Output individual chunks for analysis
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Enable source maps for bundle analysis
    sourcemap: true,
  },
});
