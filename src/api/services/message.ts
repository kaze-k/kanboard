import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"
import { MsgMarkRequest } from "#/api"

export const getUnReadMsgs = () => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/unreadMsgs` })
}

export const getReadedMsgs = () => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/readedMsgs` })
}

export const markReadMsg = (data: MsgMarkRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/markReadMsg`, data })
}

export const getMsgByProjectId = (projectId: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/getMsgsByProjectId`, data: { id: projectId } })
}
