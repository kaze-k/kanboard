import Logo from "@/assets/logo.png"
import AccountDropdown from "@/components/AccountDropdown"
import FullscreenButton from "@/components/FullscreenButton"
import { HomeOutlined, ProjectOutlined, UserOutlined } from "@ant-design/icons"
import { Breadcrumb, Layout, theme } from "antd"
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb"
import { NavLink, useMatches } from "react-router"

const { Header } = Layout

const items: Record<string, string> = {
  "/": "看板",
  "/project": "项目",
  "/me": "我的",
}

function getTitle(pathname: string, item: string) {
  const iconMap: Record<string, React.ReactNode> = {
    "/": <HomeOutlined />,
    "/project": <ProjectOutlined />,
    "/me": <UserOutlined />,
  }

  return (
    <>
      {iconMap[pathname]}
      <span>{item}</span>
    </>
  )
}

function MainHeader() {
  const matches = useMatches()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const breadcrumbItems = (): BreadcrumbItemType[] => {
    const basePath = `/${matches[1].pathname.split("/")[1]}`
    const bitems: BreadcrumbItemType[] = [
      {
        href: matches[1].pathname,
        title: getTitle(basePath, items[basePath]),
      },
    ]

    if (matches[1].pathname === "/users" && matches[1].params?.id) {
      bitems.push({
        title: "用户信息",
      } as BreadcrumbItemType)
    }

    if (matches[1].pathname === "/projects" && matches[1].params?.id) {
      bitems.push({
        title: "项目信息",
      } as BreadcrumbItemType)
    }

    return bitems
  }

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
      <Breadcrumb items={breadcrumbItems()} />
      <div style={{ display: "flex", alignItems: "center" }}>
        <FullscreenButton />
        <div style={{ width: 2, height: 20, background: "#ccc", margin: "0 10px" }} />
        <AccountDropdown />
      </div>
    </Header>
  )
}

export default MainHeader
