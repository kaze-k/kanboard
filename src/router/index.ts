import { getUser } from "@/api/services/users"
import { KanbanBoard } from "@/components/kanboard"
import Main from "@/layouts"
import Login from "@/pages/login"
import Me from "@/pages/me"
import Page404 from "@/pages/page404"
import Project from "@/pages/project"
import TaskInfo from "@/pages/taskInfo"
import UserInfo from "@/pages/userInfo"
import useUserStore from "@/stores/userStore"
import { LoaderFunctionArgs, createBrowserRouter, redirect } from "react-router"

const children = [
  {
    index: true,
    path: "/",
    Component: KanbanBoard,
  },
  {
    path: "/project",
    Component: Project,
  },
  {
    path: "/me",
    Component: Me,
  },
  {
    path: "/user",
    children: [
      {
        index: true,
        path: "/user/:id",
        Component: UserInfo,
        loader: async ({ params }: LoaderFunctionArgs) => {
          const { id } = params
          const res = await getUser(Number(id))
          if (!res) {
            throw redirect("/404")
          }

          return res
        },
      },
    ],
  },
  {
    path: "/tasks",
    children: [
      {
        index: true,
        path: "/tasks/:id",
        Component: TaskInfo,
      },
    ],
  },
]

const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    children: children,
    loader: async () => {
      const userToken = useUserStore.getState().userToken
      if (!userToken.accessToken) {
        throw redirect("/login")
      }
      return
    },
  },
  {
    path: "/login",
    Component: Login,
    loader: async () => {
      const userToken = useUserStore.getState().userToken
      if (userToken.accessToken) {
        throw redirect("/")
      }
      return
    },
  },
  {
    path: "*",
    loader: async () => {
      throw redirect("/404")
    },
  },
  {
    path: "/404",
    Component: Page404,
  },
])

export default router
