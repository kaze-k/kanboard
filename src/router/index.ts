import { getTaskInfo } from "@/api/services/tasks"
import Main from "@/layouts"
import CreateTask from "@/pages/createTask"
import ErrorPage from "@/pages/errorPage"
import Home from "@/pages/home"
import Login from "@/pages/login"
import Me from "@/pages/me"
import Page404 from "@/pages/page404"
import Project from "@/pages/project"
import TaskInfo from "@/pages/taskInfo"
import useUserStore from "@/stores/userStore"
import { LoaderFunctionArgs, createBrowserRouter, redirect } from "react-router"

const children = [
  {
    path: "/",
    loader: () => redirect("/task"),
  },
  {
    path: "/task",
    children: [
      {
        index: true,
        path: "/task/",
        Component: Home,
      },
      {
        path: "/task/createTask",
        Component: CreateTask,
      },
      {
        path: "/task/:id",
        Component: TaskInfo,
        loader: async ({ params }: LoaderFunctionArgs) => {
          const id = params.id
          const projectId = useUserStore.getState().currentProject.project_id
          if (id && projectId) {
            const data = await getTaskInfo({ projectId, taskId: Number(id) })
            if (!data) throw redirect("/404")
            return data
          } else {
            throw redirect("/404")
          }
        },
      },
    ],
  },
  {
    path: "/project",
    children: [
      {
        index: true,
        path: "/project/",
        Component: Project,
      },
    ],
  },
  {
    path: "/me",
    Component: Me,
  },
]

const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: ErrorPage,
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
