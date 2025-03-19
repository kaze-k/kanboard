import { defineConfig } from "vite"

const proConfig = (process: NodeJS.Process) =>
  defineConfig({
    mode: "production",
    build: {
      sourcemap: false,
      minify: true,
    },
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_DOMAIN,
          changeOrigin: true,
        },
      },
    },
  })

export default proConfig
