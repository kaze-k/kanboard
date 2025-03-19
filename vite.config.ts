import { defineConfig, loadEnv, mergeConfig } from "vite"
import type { UserConfig } from "vite"

import baseConfig from "./config/vite.config.base"
import devConfig from "./config/vite.config.dev"
import proConfig from "./config/vite.config.pro"

// https://vite.dev/config/
const viteConfig = ({ mode }: { mode: string }): UserConfig => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  if (mode === "development") {
    return mergeConfig(baseConfig, devConfig(process))
  } else if (mode === "production") {
    return mergeConfig(baseConfig, proConfig(process))
  }
  return mergeConfig(baseConfig, proConfig(process))
}

export default defineConfig(viteConfig)
