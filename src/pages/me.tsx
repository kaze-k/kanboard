import { upload } from "@/api/services/tasks"
import { updateUser } from "@/api/services/users"
import { useAction, useUserInfo } from "@/stores/userStore"
import { computeFileMD5, resourcePath } from "@/utils"
import { LockOutlined, LogoutOutlined, MailFilled, PhoneFilled, UploadOutlined, UserOutlined } from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import {
  Avatar,
  Button,
  Calendar,
  Card,
  Col,
  Form,
  GetProp,
  Input,
  List,
  Row,
  Statistic,
  Tabs,
  Upload,
  UploadProps,
  message,
} from "antd"
import ReactEcharts from "echarts-for-react"
import React, { useState } from "react"
import { toast } from "sonner"

const { TabPane } = Tabs

// 图表配置
const getChartOption = () => ({
  title: {
    text: "任务完成情况",
  },
  tooltip: {},
  legend: {
    data: ["任务数"],
  },
  xAxis: {
    data: ["本周", "上周", "本月", "上月"],
  },
  yAxis: {},
  series: [
    {
      name: "任务数",
      type: "bar",
      data: [15, 20, 42, 30],
      itemStyle: { color: "#1890ff" },
    },
  ],
})

const Me: React.FC = () => {
  const { username, email, mobile, position, avatar, id } = useUserInfo()
  const [hovered, setHovered] = useState(false)
  const { setUserInfo } = useAction()

  const UpdateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async (data) => {
      setUserInfo(data)
    },
  })

  const dummyRequest = async (options: any) => {
    const { file, onSuccess, onError } = options

    try {
      const md5 = await computeFileMD5(file)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("md5", md5)

      const result = await upload(formData)

      UpdateUserMutation.mutate({ id: Number(id), avatar: result.id })
      onSuccess(result)
    } catch (error) {
      onError(error)
    }
  }
  const onPasswordChange = (values: any) => {
    console.log("修改密码：", values)
    message.success("密码修改成功")
  }

  const onLogout = () => {
    message.info("已退出登录")
    // TODO: 调用退出逻辑
  }

  const handleUpload = (file: Parameters<GetProp<UploadProps, "beforeUpload">>[0]) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      toast.error("上传文件只能是 JPG/PNG 格式!", {
        position: "bottom-left",
      })
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      toast.error("上传文件大小不能?超过 2MB!", {
        position: "bottom-left",
      })
    }
    return isJpgOrPng && isLt2M
  }

  return (
    <div
      style={{
        padding: 24,
        margin: "0 80px",
      }}
    >
      <Card>
        {/* 用户信息 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <Upload
            name="file"
            beforeUpload={handleUpload}
            showUploadList={false}
            customRequest={dummyRequest}
          >
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{ position: "relative", display: "inline-block" }}
            >
              <Avatar
                size={64}
                icon={avatar ? null : <UserOutlined />}
                src={resourcePath(avatar) || undefined}
              />
              {hovered && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "8px",
                    borderRadius: "50%",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <UploadOutlined
                    style={{
                      width: "100%",
                      height: "100%",
                      fontSize: 30,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </div>
              )}
            </div>
          </Upload>
          <div style={{ marginLeft: 16 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{username}</h1>
            <p style={{ margin: 0, color: "#888" }}>{position}</p>
            {(email || mobile) && (
              <p>
                {email && (
                  <span style={{ marginRight: 8, color: "#888" }}>
                    <MailFilled /> {email}
                  </span>
                )}
                {mobile && (
                  <span style={{ marginRight: 8, color: "#888" }}>
                    <PhoneFilled /> {mobile}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Tabs 内容 */}
        <Tabs defaultActiveKey="tasks">
          {/* 我的任务 */}
          <TabPane
            tab="我的任务"
            key="tasks"
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: "完成看板页面拖拽功能", status: "进行中" },
                { title: "修复登录页面的Bug", status: "已完成" },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`状态：${item.status}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>

          {/* 我的日程 */}
          <TabPane
            tab="我的日程"
            key="calendar"
          >
            <Calendar />
          </TabPane>

          {/* 我的统计 */}
          <TabPane
            tab="我的统计"
            key="stats"
          >
            <Row
              gutter={16}
              style={{ marginBottom: 24 }}
            >
              <Col span={6}>
                <Statistic
                  title="总任务数"
                  value={42}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="已完成任务"
                  value={28}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="参与项目"
                  value={5}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="消息通知"
                  value={12}
                />
              </Col>
            </Row>

            <Card title="任务统计图">
              <ReactEcharts
                option={getChartOption()}
                style={{ height: 300 }}
              />
            </Card>
          </TabPane>

          {/* 设置 */}
          <TabPane
            tab="个人设置"
            key="settings"
          >
            <Form
              onFinish={onPasswordChange}
              layout="vertical"
              style={{ maxWidth: 400 }}
            >
              <Form.Item
                label="当前密码"
                name="current"
                rules={[{ required: true, message: "请输入当前密码" }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item
                label="新密码"
                name="new"
                rules={[{ required: true, message: "请输入新密码" }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  修改密码
                </Button>
              </Form.Item>
            </Form>
            <Button
              type="default"
              danger
              icon={<LogoutOutlined />}
              onClick={onLogout}
            >
              退出登录
            </Button>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default Me
