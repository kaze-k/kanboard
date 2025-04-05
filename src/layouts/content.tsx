import { Layout } from "antd"
import { Outlet } from "react-router"

const { Content } = Layout

function MainContent() {
  return (
    <Content style={{ padding: "16px 0", flex: 1, overflow: "auto" }}>
      <Outlet />
    </Content>
  )
}

export default MainContent
