import { theme } from "antd"

function Dashboard() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  return (
    <div
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <h1>数据概览</h1>
    </div>
  )
}

export default Dashboard
