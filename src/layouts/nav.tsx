import { HomeOutlined, ProjectOutlined, UserOutlined } from "@ant-design/icons"
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
  getItem("看板", "/", <HomeOutlined />),
  getItem("项目", "/project", <ProjectOutlined />),
  getItem("我的", "/me", <UserOutlined />),
]

function MainNav() {
  const navigate = useNavigate()
  return (
    <Sider
      style={{
        borderRight: "1px solid #f0f0f0",
        position: "fixed",
        left: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        borderRadius: "24px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        padding: "16px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      theme="light"
      collapsed={true}
    >
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
