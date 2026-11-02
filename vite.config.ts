/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// BASE_PATH diisi workflow GitHub Pages (mis. /Game-Pembelajaran-SD/); lokal cukup '/'.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2,mp3,json}'] },
      manifest: {
        name: 'EduGame Kidz — Petualangan Belajar SD',
        short_name: 'EduGame Kidz',
        description: 'Game belajar Matematika & Bahasa Inggris untuk anak SD',
        lang: 'id',
        theme_color: '#0E7490',
        background_color: '#E0F7FA',
        display: 'standalone',
        orientation: 'any',
        start_url: '.',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
