import Background from "@/components/Background"
import LoginForm from "@/components/LoginForm"
import { Layout, theme } from "antd"

function Login() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        backgroundColor: colorBgContainer,
      }}
    >
      <Background />
      <div style={{ fontSize: "20px", fontWeight: 700, backgroundColor: colorBgContainer, paddingBottom: "20px" }}>
        Kanboard
      </div>
      <LoginForm />
    </Layout>
  )
}

export default Login
