import react from "@vitejs/plugin-react-swc"
import path from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    target: "es2015",
    outDir: "dist",
    assetsDir: "static",
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    cssTarget: "es2015",
    cssMinify: "esbuild",
    reportCompressedSize: true,
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        entryFileNames: "scripts/[name]-[hash].js",
        chunkFileNames: "scripts/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash][extname]",
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "#": path.resolve(__dirname, "../types"),
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    open: true,
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: true,
    cors: true,
  },
})
