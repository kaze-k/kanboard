import { defineConfig } from "vite"

const devConfig = (process: NodeJS.Process) =>
  defineConfig({
    mode: "development",
    build: {
      sourcemap: true,
      minify: false,
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

export default devConfig
