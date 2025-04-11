import { MsgType } from "#/api"
import { ReactNode, createContext, useContext } from "react"
import useWebSocket from "react-use-websocket"
import { WebSocketHook } from "react-use-websocket/dist/lib/types"

import { useUserInfo, useUserToken } from "./stores/userStore"

interface WebSocketProviderProps {
  children: ReactNode
}

const WebSocketContext = createContext<WebSocketHook<MsgType> | null>(null)

function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { id } = useUserInfo()
  const { accessToken } = useUserToken()
  const socketUrl = `${import.meta.env.VITE_WS_DOMAIN}${import.meta.env.VITE_BASE_URL}/${id}/ws`

  const isConn = id && accessToken ? true : false

  const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket<MsgType>(isConn ? socketUrl : null, {
      heartbeat: false,
      share: true,
      queryParams: { token: accessToken ? accessToken : "" },
      shouldReconnect: () => true,
    })

  const value = {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export const useWebSocketContext = (): WebSocketHook<MsgType> => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider")
  }
  return context
}

export default WebSocketProvider
