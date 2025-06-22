/// <reference types="node" />
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-class-properties'],
          ['@babel/plugin-transform-private-methods'],
          ['@babel/plugin-transform-private-property-in-object']
        ]
      }
    }),
    visualizer()
  ],
  server: {
    port: 3000,
    open: true,
    cors: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@contexts', replacement: path.resolve(__dirname, 'src/contexts') },
      { find: '@theme', replacement: path.resolve(__dirname, 'src/theme') },
      { find: '@layouts', replacement: path.resolve(__dirname, 'src/layouts') }
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild'
  },
  css: {
    devSourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@emotion/react']
  }
})