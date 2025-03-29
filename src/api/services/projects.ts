import {
  AddAssigneeRequest,
  AddProjectMemberRequest,
  CreateProjectRequest,
  RemoveProjectMember,
  UpdateProjectRequest,
} from "#/api"
import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"

export const getProjects = (page: number, pageSize: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/getProjectList?page=${page}&page_size=${pageSize}` })
}

export const getProject = (id: number) => {
  const userId = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${userId}/getProjectById`, data: { id } })
}

export const createProject = (data: CreateProjectRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/createProject`, data })
}

export const updateProject = (data: UpdateProjectRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.put({ url: `/${id}/updateProject`, data })
}

export const deleteProject = (id: number) => {
  const userId = useUserStore.getState().userInfo.id
  return ApiRequest.delete({ url: `/${userId}/deleteProject`, data: { id } })
}

export const addProjectMember = (data: AddProjectMemberRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/addProjectMember`, data })
}

export const removeProjectMember = (data: RemoveProjectMember) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/removeProjectMember`, data })
}

export const setProjectAssignee = (data: AddAssigneeRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/setProjectAssignee`, data })
}

export const getMembers = () => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/getMembers` })
}
