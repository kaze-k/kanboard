import { ChangePasswordRequest, UpdateUserRequest } from "#/api"
import { changePassword, deleteUser, getUser, updateUser } from "@/api/services/users"
import { UserOutlined } from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import { Avatar, Button, Card, Col, Form, Input, Row, Select, Space, Tabs, Typography } from "antd"
import { TabsProps } from "antd/lib"
import { isEqual, pickBy } from "lodash"
import { useEffect, useState } from "react"
import { useLoaderData, useNavigate } from "react-router"
import { toast } from "sonner"

const { Text } = Typography

function UserInfoForm() {
  const user = useLoaderData()
  const initData: any = {
    email: user.email,
    mobile: user.mobile,
    position: user.position,
    gender: user.gender,
    is_admin: user.is_admin,
    loginable: user.loginable,
  }
  const [data, setData] = useState(initData)
  const navigate = useNavigate()

  const [form] = Form.useForm()

  const UpdateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async () => {
      const newData = await getUser(user.id)
      form.setFieldsValue(newData)
      setData(newData)
    },
    onError: () => {
      form.setFieldsValue(data)
    },
  })

  const handleClick = (values: UpdateUserRequest) => {
    if (!form.isFieldsTouched()) {
      toast.info("没有修改内容!", {
        position: "top-center",
      })
      return
    }

    let changedValues = pickBy(values, (value, key) => !isEqual(value, data[key]))

    changedValues = Object.keys(changedValues).reduce((acc: any, key) => {
      const typedKey = key as keyof UpdateUserRequest
      acc[typedKey] = values[typedKey] === "" ? undefined : values[typedKey]
      return acc
    }, {})

    const newData = { ...changedValues, id: user.id }
    UpdateUserMutation.mutate(newData)
  }

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      navigate("/users", { replace: true })
      toast.success("删除成功!", {
        position: "top-center",
      })
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate(user.id)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col
        flex={2}
        lg={16}
      >
        <Card
          style={{
            height: "100%",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Space
            direction="vertical"
            size="large"
            align="center"
          >
            <Avatar
              size={100}
              icon={<UserOutlined />}
            />
            <Text strong>{user.username}</Text>
            <Button
              type="primary"
              onClick={handleDelete}
              danger
            >
              删除用户
            </Button>
          </Space>
        </Card>
      </Col>

      <Col
        flex={3}
        lg={16}
      >
        <Card>
          <Form
            form={form}
            layout="vertical"
            initialValues={data}
            labelCol={{ span: 8 }}
            onFinish={handleClick}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="邮箱"
                  name="email"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="电话"
                  name="mobile"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="职位"
                  name="position"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="登录"
                  name="loginable"
                >
                  <Select
                    options={[
                      {
                        value: true,
                        label: "可登录",
                      },
                      {
                        value: false,
                        label: "不可登录",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="管理员"
                  name="is_admin"
                >
                  <Select
                    options={[
                      {
                        value: true,
                        label: "是",
                      },
                      {
                        value: false,
                        label: "否",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="性别"
                  name="gender"
                >
                  <Select
                    options={[
                      {
                        value: 1,
                        label: "男",
                      },
                      {
                        value: 2,
                        label: "女",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex w-full justify-end">
              <Button
                type="primary"
                htmlType="submit"
              >
                保存更改
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

function UserChangePassword() {
  const user = useLoaderData()
  const [form] = Form.useForm()

  const mutation = useMutation({
    mutationFn: changePassword,
  })

  useEffect(() => {
    form.resetFields()
  }, [mutation, form])

  const handleChangePassword = (value: ChangePasswordRequest) => {
    if (value.newPassword === form.getFieldValue("confirmPassword")) {
      mutation.mutate({ id: user.id, newPassword: value.newPassword })
    } else {
      toast.error("两次输入的密码不一致!", {
        position: "top-center",
      })
    }
  }

  return (
    <Card style={{ margin: "0 120px", padding: "20px 200px" }}>
      <Form
        form={form}
        onFinish={handleChangePassword}
      >
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[{ required: true, message: "请输入新密码" }]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="再次输入新密码"
          rules={[{ required: true, message: "请再次输入新密码" }]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
        >
          保存
        </Button>
      </Form>
    </Card>
  )
}

function UserInfo() {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "用户信息",
      children: <UserInfoForm />,
    },
    {
      key: "2",
      label: "修改密码",
      children: <UserChangePassword />,
    },
  ]

  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
    />
  )
}

export default UserInfo
