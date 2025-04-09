import { ProjectAddMemberRequest, ProjectRemoveMemberRequest } from "#/api"
import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"

export const getProject = (projectId: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/project?id=${projectId}` })
}

export const addProjectMember = (data: ProjectAddMemberRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/addProjectMember`, data })
}

export const removeProjectMember = (data: ProjectRemoveMemberRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/removeProjectMember`, data })
}

export const getMembers = (projectId: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/getMembers`, data: { id: projectId } })
}

export const getProjectMembers = (projectId: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/getProjectMembers`, data: { id: projectId } })
}
