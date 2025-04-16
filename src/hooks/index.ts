import { getVersion } from "@tauri-apps/api/app"
import { useEffect, useState } from "react"

export function useIsTauri(): boolean {
  const [isTauri, setIsTauri] = useState(false)

  useEffect(() => {
    getVersion()
      .then(() => setIsTauri(true))
      .catch(() => setIsTauri(false))
  }, [])

  return isTauri
}
