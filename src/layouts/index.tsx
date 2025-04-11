import WebSocketProvider from "@/webSocketProvider"
import { Layout, theme } from "antd"

import Content from "./content"
import Header from "./header"
import Nav from "./nav"

const MainLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <WebSocketProvider>
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <Nav />
        <Layout
          style={{
            background: colorBgContainer,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Header />
          <Content />
        </Layout>
      </Layout>
    </WebSocketProvider>
  )
}

export default MainLayout
