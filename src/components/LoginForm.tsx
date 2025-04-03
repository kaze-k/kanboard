import { LoginRequest } from "#/api"
import { captcha } from "@/api/services/users"
import { useLogin } from "@/stores/userStore"
import { EyeInvisibleOutlined, UserOutlined } from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
import { Button, Card, Col, Form, Input, Row } from "antd"
import { useState } from "react"

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [value, setValue] = useState("")
  const [form] = Form.useForm()
  const login = useLogin()
  const { data, refetch } = useQuery({
    queryKey: ["captcha"],
    queryFn: captcha,
    refetchOnWindowFocus: false,
  })
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
              size="large"
              type="password"
              placeholder={"密码"}
              prefix={<EyeInvisibleOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="captchaAnswer"
            rules={[{ required: true, message: "请输入验证码" }]}
          >
            <Row align="middle">
              <Col span={12}>
                <Input
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
          onFinish={handleLogin}
          form={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
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
              size="large"
              type="password"
              placeholder={"请输入密码"}
              prefix={<EyeInvisibleOutlined />}
            />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: "请再次请输入密码" }]}>
            <Input.Password
              size="large"
              type="password"
              placeholder={"请再次输入密码"}
              prefix={<EyeInvisibleOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="captchaAnswer"
            rules={[{ required: true, message: "请输入验证码" }]}
          >
            <Row align="middle">
              <Col span={12}>
                <Input
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
