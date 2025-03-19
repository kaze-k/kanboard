import Logo from "@/assets/logo.png"
import router from "@/router"
import { Helmet } from "react-helmet-async"
import { RouterProvider } from "react-router"

import "./App.css"

function App() {
  return (
    <>
      <Helmet>
        <title>Kanboard Admins</title>
        <link
          rel="icon"
          href={Logo}
        />
      </Helmet>

      <RouterProvider router={router} />
    </>
  )
}

export default App
