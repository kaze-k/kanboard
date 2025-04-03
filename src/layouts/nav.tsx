import Logo from "@/assets/logo.png"
import { CodeOutlined, ProjectOutlined, UserOutlined } from "@ant-design/icons"
import { Layout, Menu } from "antd"
import type { MenuProps } from "antd"
import { useNavigate } from "react-router"

const { Sider } = Layout

type MenuItem = Required<MenuProps>["items"][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const menuItems: MenuItem[] = [
  getItem("看板", "/", <CodeOutlined />),
  getItem("项目概览", "/project", <ProjectOutlined />),
  getItem("我的", "/me", <UserOutlined />),
]

function MainNav() {
  const navigate = useNavigate()
  return (
    <Sider
      style={{ borderRight: "1px solid #f0f0f0" }}
      theme="light"
      collapsed={true}
    >
      <div
        style={{ height: "48px", margin: "16px", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <img
          src={Logo}
          alt="logo"
          style={{ width: "100%" }}
        />
      </div>
      <h1 style={{ color: "#00A76F", textAlign: "center", paddingBottom: "16px", fontWeight: 650, fontSize: "16px" }}>
        Kanboard Admin
      </h1>
      <Menu
        theme="light"
        defaultSelectedKeys={["/"]}
        mode="inline"
        items={menuItems}
        selectedKeys={[`/${location.pathname.split("/")[1]}`]}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}

export default MainNav
