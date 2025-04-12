import { MsgType } from "#/api"
import { useMutation } from "@tanstack/react-query"
import { ReactNode, createContext, useContext, useEffect } from "react"
import useWebSocket from "react-use-websocket"
import { WebSocketHook } from "react-use-websocket/dist/lib/types"

import { getUser } from "./api/services/users"
import { useAction, useUserInfo, useUserToken } from "./stores/userStore"

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

  const { setUserInfo, setCurrentProject } = useAction()

  const getUserInfo = useMutation({
    mutationFn: getUser,
    onSuccess: (data) => {
      setUserInfo(data)
      if (data.projects.length) {
        setCurrentProject({ project_id: data.projects[0].project_id, project_name: data.projects[0].project_name })
      } else {
        setCurrentProject({ project_id: 0, project_name: "" })
      }
    },
  })

  useEffect(() => {
    if (lastJsonMessage?.message_type === "update_user") {
      getUserInfo.mutate()
    }
  }, [lastJsonMessage])

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
