import { ChangePasswordRequest, LoginRequest, SearchUserRequest } from "#/api"
import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"

export const captcha = () => ApiRequest.get({ url: "/captcha" })

export const login = (data: LoginRequest) => ApiRequest.post({ url: "/login", data: data })

export const searchUsers = (data: SearchUserRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/searchUser`, data })
}

export const getUser = (userId: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/getUser`, data: { id: userId } })
}

export const changePassword = (data: ChangePasswordRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.put({ url: `/${id}/changePassword`, data })
}
