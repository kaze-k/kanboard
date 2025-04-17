import Logo from "@/assets/logo.png"
import AccountDropdown from "@/components/AccountDropdown"
import FullscreenButton from "@/components/FullscreenButton"
import MessageButton from "@/components/MessageButton"
import ProjectSwitcher from "@/components/projectSwitcher"
import { useIsTauri } from "@/hooks"
import { Layout, Space, theme } from "antd"
import { NavLink } from "react-router"

const { Header } = Layout

function MainHeader() {
  const { isTauri, isReady } = useIsTauri()

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 64,
        padding: "0 15px",
        background: colorBgContainer,
        borderBottom: "1px solid #f0f0f0",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
      }}
    >
      <NavLink
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        to="/"
      >
        <img
          src={Logo}
          alt="logo"
          style={{ width: 32, height: 32 }}
        />
        <h1
          style={{
            marginLeft: 8,
            fontWeight: 700,
            fontSize: 18,
            color: "#48EEFF",
          }}
        >
          Kanboard
        </h1>
      </NavLink>
      <ProjectSwitcher />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Space>
          {!isTauri && isReady && <FullscreenButton />}
          <MessageButton />
        </Space>
        <div style={{ width: 2, height: 20, margin: "0 10px" }} />
        <AccountDropdown />
      </div>
    </Header>
  )
}

export default MainHeader
