import { useAction, useUserInfo } from "@/stores/userStore"
import { resourcePath } from "@/utils"
import { UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Divider, type MenuProps } from "antd"
import Dropdown, { type DropdownProps } from "antd/es/dropdown/dropdown"
import React from "react"
import { useNavigate } from "react-router"

/**
 * Account Dropdown
 */
function AccountDropdown() {
  const { clearUserToken, clearUserInfo, clearCurrentProject } = useAction()
  const navigate = useNavigate()
  const { username, avatar }: any = useUserInfo()

  const logout = () => {
    clearUserToken()
    clearUserInfo()
    clearCurrentProject()
    localStorage.clear()
    navigate("/login", { replace: true })
  }

  const dropdownRender: DropdownProps["dropdownRender"] = (menu) => (
    <div>
      <Divider style={{ margin: 0 }} />
      {React.cloneElement(menu as React.ReactElement, {})}
    </div>
  )

  const items: MenuProps["items"] = [
    {
      label: (
        <Button
          type="link"
          danger
        >
          退出
        </Button>
      ),
      key: "1",
      style: { textAlign: "center" },
      onClick: logout,
    },
  ]

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      dropdownRender={dropdownRender}
    >
      <span style={{ display: "flex", height: 54, justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
        <Avatar
          icon={resourcePath(avatar) ? null : <UserOutlined />}
          src={resourcePath(avatar) || undefined}
        />
        <span style={{ padding: "0 10px", fontSize: 16, fontWeight: 600 }}>{username}</span>
      </span>
    </Dropdown>
  )
}

export default AccountDropdown
