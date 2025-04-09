import {
  TaskAddAssignessRequest,
  TaskCreateRequest,
  TaskDeleteRequest,
  TaskRemoveAssignessRequest,
  TaskSearchRequest,
  TaskUpdateRequest,
  TaskUpdateStatusRequest,
} from "#/api"
import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"

export const getTasksList = (projectId: number, page: number, pageSize: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/tasks?id=${projectId}&page=${page}&page_size=${pageSize}` })
}

export const getTasks = (projectId: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/tasksByProjectId?id=${projectId}` })
}

export const getTasListksByUserId = (userId: number, page: number, pageSize: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/tasksByUserId?id=${userId}&page=${page}&page_size=${pageSize}` })
}

export const getUserTasks = (userId: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/userTasks?id=${userId}` })
}

export const createTask = (data: TaskCreateRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/createTask`, data })
}

export const updateTask = (data: TaskUpdateRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/updateTask`, data })
}

export const updateTaskStatus = (data: TaskUpdateStatusRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/updateTaskStatus`, data })
}

export const deleteTask = (data: TaskDeleteRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.delete({ url: `/${id}/deleteTask`, data })
}

export const getTaskInfo = ({ projectId, taskId }: { projectId: number, taskId: number }) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/getTask?project_id=${projectId}&task_id=${taskId}` })
}

export const addTaskAssignee = (data: TaskAddAssignessRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/addTaskAssignee`, data })
}

export const removeTaskAssignee = (data: TaskRemoveAssignessRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/removeTaskAssignee`, data })
}

export const searchTask = (data: TaskSearchRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/searchTask`, data })
}

export const upload = (data: FormData) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/upload`, data, headers: { "Content-Type": "multipart/form-data" } })
}
