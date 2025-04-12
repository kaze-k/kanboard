import { LoginRequest, RegisterRequest } from "#/api"
import type { CurrentProject, UserInfo, UserToken } from "#/store"
import { login, register } from "@/api/services/users"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type UserStore = {
  userInfo: Partial<UserInfo>
  userToken: UserToken
  currentProject: Partial<CurrentProject>
  action: {
    setCurrentProject: (currentProject: Partial<CurrentProject>) => void
    setUserInfo: (userInfo: Partial<UserInfo>) => void
    setUserToken: (userToken: UserToken) => void
    clearUserToken: () => void
    clearUserInfo: () => void
    clearCurrentProject: () => void
  }
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentProject: {},
      userInfo: {},
      userToken: {},
      action: {
        setCurrentProject: (currentProject) => {
          if (currentProject.project_id && !currentProject.project_name) {
            const { projects } = useUserStore.getState().userInfo
            currentProject.project_name = projects?.find(
              (project) => project.project_id === currentProject.project_id,
            )?.project_name
          }
          return set({ currentProject })
        },
        setUserInfo: (userInfo) => set({ userInfo }),
        setUserToken: (userToken) => set({ userToken }),
        clearUserToken: () => set({ userToken: {} }),
        clearUserInfo: () => set({ userInfo: {} }),
        clearCurrentProject: () => set({}),
      },
    }),

    {
      name: "kanboard",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentProject: state.currentProject,
        userInfo: state.userInfo,
        userToken: state.userToken,
      }),
    },
  ),
)

export const useAction = () => useUserStore((state) => state.action)

export const useUserInfo = () => useUserStore((state) => state.userInfo)
export const useUserToken = () => useUserStore((state) => state.userToken)

export const useProject = () => useUserStore((state) => state.userInfo.projects)

export const useCurrentProject = () => useUserStore((state) => state.currentProject)

export const useCurrentProjectIsAssigned = () => {
  const currentProject = useCurrentProject()!
  const projects = useProject()!
  const index = projects?.findIndex((project) => project.project_id === currentProject.project_id)
  if (typeof index === "undefined") return false
  return projects[index]?.assignee
}

export const useLogin = () => {
  const navigate = useNavigate()
  const { setUserInfo, setUserToken, setCurrentProject } = useAction()
  const loginMutation = useMutation({
    mutationFn: login,
  })

  const loginFn = async (data: LoginRequest, refetch: () => void) => {
    try {
      const res = await loginMutation.mutateAsync(data)
      const { user, token } = res
      setUserInfo(user)
      setUserToken({ accessToken: token })
      if (user.projects.length) {
        setCurrentProject({ project_id: user.projects[0].project_id, project_name: user.projects[0].project_name })
      } else {
        setCurrentProject({ project_id: 0, project_name: "" })
      }
      navigate("/task", { replace: true })
    } catch (err) {
      refetch()
    }
  }

  return loginFn
}

export const useRegister = () => {
  const navigate = useNavigate()
  const registerMutation = useMutation({
    mutationFn: register,
  })

  const registerFn = async (data: RegisterRequest, refetch: () => void) => {
    try {
      await registerMutation.mutateAsync(data)
      navigate("/login", { replace: true })
    } catch (err) {
      refetch()
    }
  }

  return registerFn
}

export default useUserStore
