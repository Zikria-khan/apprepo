import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure the output directory is 'dist' for Vercel
    sourcemap: true, // Optional: helps with debugging in production
  },
  server: {
    port: 3000, // Optional: local development port (Vercel uses this for local dev)
    open: true,  // Optional: open the browser when running locally
  },
  resolve: {
    alias: {
      '@': '/src', // Optional: simplify imports with `@`
    }
  },
  base: './', // Ensure relative paths for assets (important for production)
});
