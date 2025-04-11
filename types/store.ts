export interface UserToken {
  accessToken?: string
}

export interface Projects {
  project_id: number
  assignee: boolean
  project_name: string
  joined_at: string
}

export interface UserInfo {
  id: number
  username: string
  avatar: string
  email: string
  mobile: string
  position: string
  created_at: string
  gender: number
  create_from: number
  projects: Projects[]
}

export interface CurrentProject {
  project_id: number
  project_name: string
}
