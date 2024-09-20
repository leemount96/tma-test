import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './docs',
    sourcemap: true,
  },
  base: '/tma-test/',
});