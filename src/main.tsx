// react
import { Suspense } from "react"
import ReactDOM from "react-dom/client"
// helmet
import { HelmetProvider } from "react-helmet-async"

// root component
import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <HelmetProvider>
    <Suspense>
      <App />
    </Suspense>
  </HelmetProvider>,
)
