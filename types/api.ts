export interface Result<T = any> {
  status?: number
  code?: 0 | -1
  message?: string
  data?: T
}

export interface LoginRequest {
  username: string
  password: string
  captchaId: string
  captchaAnswer: string
}

export interface SearchUserRequest {
  page: number
  page_size: number
  username?: string
  id?: number
  position?: string
  create_from?: number
  is_admin?: boolean
  is_leader?: boolean
  gender?: number
}

export interface ChangePasswordRequest {
  id: number
  newPassword: string
}
