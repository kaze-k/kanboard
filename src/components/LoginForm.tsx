import { LoginRequest, RegisterRequest } from "#/api"
import { captcha } from "@/api/services/users"
import { useLogin, useRegister } from "@/stores/userStore"
import { LockOutlined, SkinOutlined, UserOutlined } from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
import { Button, Card, Col, Form, Input, Row, Select } from "antd"
import { useEffect, useState } from "react"

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [value, setValue] = useState("")
  const [form] = Form.useForm()
  const login = useLogin()
  const register = useRegister()

  const { data, refetch } = useQuery({
    queryKey: ["captcha"],
    queryFn: captcha,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    refetch()
    if (isRegister) form.resetFields()
  }, [isRegister])

  const handleLogin = async ({ username, password, captchaAnswer }: LoginRequest) => {
    setLoading(true)
    try {
      await login(
        {
          username,
          password,
          captchaId: data?.id,
          captchaAnswer,
        },
        refetch,
      )
    } finally {
      setLoading(false)
      setValue("")
      form.setFieldValue("captchaAnswer", "")
    }
  }

  const handleRegister = async ({ username, password, gender, captchaAnswer }: RegisterRequest) => {
    setLoading(true)
    try {
      await register(
        {
          username,
          password,
          captchaId: data?.id,
          gender,
          captchaAnswer,
        },
        refetch,
      )
    } finally {
      setLoading(false)
      setValue("")
      form.setFieldValue("captchaAnswer", "")
      setIsRegister(false)
    }
  }

  return (
    <Card
      title={isRegister ? "注册" : "登录"}
      styles={{
        header: {
          textAlign: "center",
        },
      }}
      variant="outlined"
      style={{ width: "400px", margin: "0 auto" }}
    >
      {!isRegister ? (
        <Form
          name="login"
          size="large"
          onFinish={handleLogin}
          form={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              allowClear
              size="large"
              placeholder={"用户名"}
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              allowClear
              size="large"
              type="password"
              placeholder={"密码"}
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="captchaAnswer"
            rules={[{ required: true, message: "请输入验证码" }]}
          >
            <Row align="middle">
              <Col span={12}>
                <Input
                  allowClear
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  size="large"
                  placeholder={"验证码"}
                />
              </Col>
              <Col span={12}>
                <img
                  onClick={() => refetch()}
                  style={{
                    paddingLeft: "10px",
                    paddingTop: "7px",
                    width: "100%",
                    height: "50px",
                  }}
                  src={data?.captcha}
                  alt="验证码"
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          name="register"
          size="large"
          onFinish={handleRegister}
          form={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              allowClear
              size="large"
              placeholder={"请输入用户名"}
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              allowClear
              size="large"
              type="password"
              placeholder={"请输入密码"}
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="rePassword"
            rules={[
              {
                required: true,
                message: "请再次输入密码",
                validator: (_, value) => {
                  if (value === undefined) {
                    return Promise.reject("请再次输入密码")
                  }
                  return Promise.resolve()
                },
              },
              {
                required: true,
                message: "两次输入的密码不一致",
                validator: (_, value) => {
                  if (value !== undefined && value !== form.getFieldValue("password")) {
                    return Promise.reject("两次输入的密码不一致")
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input.Password
              allowClear
              size="large"
              type="password"
              placeholder={"请再次输入密码"}
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[{ required: true, message: "请选择性别" }]}
          >
            <Select
              size="large"
              placeholder="请选择性别"
              prefix={<SkinOutlined />}
            >
              <Select.Option value={1}>男</Select.Option>
              <Select.Option value={2}>女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="captchaAnswer"
            rules={[{ required: true, message: "请输入验证码" }]}
          >
            <Row align="middle">
              <Col span={12}>
                <Input
                  allowClear
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  size="large"
                  placeholder={"验证码"}
                />
              </Col>
              <Col span={12}>
                <img
                  onClick={() => refetch()}
                  style={{
                    paddingLeft: "10px",
                    paddingTop: "7px",
                    width: "100%",
                    height: "50px",
                  }}
                  src={data?.captcha}
                  alt="验证码"
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      )}
      {!isRegister ? (
        <Button
          style={{ width: "100%" }}
          type="default"
          onClick={() => setIsRegister(!isRegister)}
        >
          注册
        </Button>
      ) : (
        <Button
          style={{ width: "100%" }}
          type="link"
          onClick={() => setIsRegister(!isRegister)}
        >
          已有账号?
        </Button>
      )}
    </Card>
  )
}

export default LoginForm
