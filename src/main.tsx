// react
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import { Suspense } from "react"
import ReactDOM from "react-dom/client"
// helmet
import { HelmetProvider } from "react-helmet-async"

// root component
import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <HelmetProvider>
    <QueryClientProvider client={new QueryClient()}>
      <Suspense>
        <ConfigProvider
          theme={{ token: { colorPrimary: "#48EEFF" } }}
          locale={zhCN}
        >
          <App />
        </ConfigProvider>
      </Suspense>
    </QueryClientProvider>
  </HelmetProvider>,
)
