import { Layout } from "antd"
import { Outlet } from "react-router"

const { Content } = Layout

function MainContent() {
  return (
    <Content style={{ padding: 16, flex: 1, overflow: "auto", margin: "0 50px" }}>
      <Outlet />
    </Content>
  )
}

export default MainContent
