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

export interface RegisterRequest {
  username: string
  password: string
  gender: number
  email?: string
  mobile?: string
  captchaId: string
  captchaAnswer: string
}

export interface ChangePasswordRequest {
  id: number
  current: string
  new: string
}

export interface UserUpdateRequest {
  id: number
  avatar?: number
  email?: string
  mobile?: string
}

interface Member {
  user_id: number
  username: string
}

export interface ProjectAddMemberRequest {
  project_id: number
  user_id: number
  members: Member[]
}

export interface ProjectRemoveMemberRequest {
  project_id: number
  user_id: number
  member_id: number
}

export interface TaskCreateRequest {
  user_id: number
  project_id: number
  title: string
  desc: string
  priority?: number
  due_date?: number
  assignees?: Member[]
}

export interface TaskUpdateRequest {
  id: number
  project_id: number
  desc?: string
  priority?: number
  due_date?: number
}

export interface TaskDeleteRequest {
  id: number
  project_id: number
}

export interface TaskAddAssignessRequest {
  id: number
  project_id: number
  assignees: Member[]
}

export interface TaskRemoveAssignessRequest {
  id: number
  project_id: number
  user_id: number
}

export interface TaskUpdateStatusRequest {
  id: number
  project_id: number
  status: number
}

export interface TaskSearchRequest {
  project_id?: number
  title?: string
  priority?: number
  user_id?: number
  creator_id?: number
}

export interface MsgMarkRequest {
  id: number
  msg_id: string
}

export interface MsgType {
  message_type: string
  unread_count: number
  payload: any
}
