import { theme } from "antd"

function Messages() {
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
      <h1>消息管理</h1>
    </div>
  )
}

export default Messages
