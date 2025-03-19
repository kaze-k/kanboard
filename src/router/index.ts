import Main from "@/layout"
import { createBrowserRouter } from "react-router"

const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
  },
])

export default router
