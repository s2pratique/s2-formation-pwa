import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-s2.png'],
      manifest: {
        name: 'S2 Formation - Évaluation Pratique',
        short_name: 'S2 Formation',
        description: 'Application d\'évaluation pratique pour les formations CACES',
        theme_color: '#0066CC',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/s2-formation-pwa/',
        start_url: '/s2-formation-pwa/',
        icons: [
          {
            src: '/s2-formation-pwa/logo-s2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  base: '/s2-formation-pwa/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
