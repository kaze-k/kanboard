import { LoginRequest } from "#/api"
import type { UserInfo, UserToken } from "#/store"
import { login } from "@/api/services/users"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type UserStore = {
  userInfo: Partial<UserInfo>
  userToken: UserToken
  action: {
    setUserInfo: (userInfo: Partial<UserInfo>) => void
    setUserToken: (userToken: UserToken) => void
    clearUserToken: () => void
  }
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: {},
      userToken: {},
      action: {
        setUserInfo: (userInfo) => set({ userInfo }),
        setUserToken: (userToken) => set({ userToken }),
        clearUserToken: () => set({ userToken: {} }),
      },
    }),

    {
      name: "kanboard-admin",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userInfo: state.userInfo,
        userToken: state.userToken,
      }),
    },
  ),
)

export const useAction = () => useUserStore((state) => state.action)

export const useUserInfo = () => useUserStore((state) => state.userInfo)
export const useUserToken = () => useUserStore((state) => state.userToken)

export const useLogin = () => {
  const navigate = useNavigate()
  const { setUserInfo, setUserToken } = useAction()
  const loginMutation = useMutation({
    mutationFn: login,
  })

  const loginFn = async (data: LoginRequest, refetch: () => void) => {
    try {
      const res = await loginMutation.mutateAsync(data)
      const { user, token } = res
      setUserInfo(user)
      setUserToken({ accessToken: token })
      navigate("/", { replace: true })
    } catch (err) {
      refetch()
    }
  }

  return loginFn
}

export default useUserStore
