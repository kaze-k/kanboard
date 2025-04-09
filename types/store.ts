export interface UserToken {
  accessToken?: string
}

export interface Projects {
  project_id: number
  assignee: boolean
  project_name: string
}

export interface UserInfo {
  id: string
  username: string
  avatar: string
  email: string
  mobile: string
  position: string
  projects: Projects[]
}

export interface CurrentProject {
  project_id: number
  project_name: string
}
