import { ChangePasswordRequest, LoginRequest, RegisterRequest, UserUpdateRequest } from "#/api"
import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"

export const captcha = () => ApiRequest.get({ url: "/captcha" })

export const login = (data: LoginRequest) => ApiRequest.post({ url: "/login", data: data })

export const register = (data: RegisterRequest) => ApiRequest.post({ url: "/register", data: data })

export const getUser = () => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/getUser` })
}

export const updateUser = (data: UserUpdateRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.put({ url: `/${id}/update`, data })
}

export const changePassword = (data: ChangePasswordRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/password`, data })
}
