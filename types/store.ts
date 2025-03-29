export interface UserToken {
  accessToken?: string
}

export interface UserInfo {
  id: string
  email: string
  mobile: string
  username: string
  password?: string
  gender: number
  is_admin: boolean
  is_leader: boolean
  avatar: number
}
