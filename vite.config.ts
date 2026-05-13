import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'sounds/*.mp3'],
      manifest: {
        name: 'WebToolBox',
        short_name: 'WebToolBox',
        description: 'The ultimate premium utility suite',
        theme_color: '#3b82f6',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/WebToolBox/',
        start_url: '/WebToolBox/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: '/WebToolBox/',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('recharts')) {
              return 'vendor-ui';
            }
            if (id.includes('react') || id.includes('zustand')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
