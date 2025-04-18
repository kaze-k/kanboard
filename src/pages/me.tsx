import { getUserTasks, upload } from "@/api/services/tasks"
import { changePassword, getCalendar, getStatistics, updateUser } from "@/api/services/users"
import { useAction, useUserInfo } from "@/stores/userStore"
import { computeFileMD5, resourcePath } from "@/utils"
import {
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
  MailFilled,
  PhoneFilled,
  ProjectOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  Avatar,
  Badge,
  Button,
  Calendar,
  Card,
  Col,
  Descriptions,
  Form,
  GetProp,
  Input,
  List,
  Row,
  Space,
  Statistic,
  Tabs,
  TabsProps,
  Tag,
  Tooltip,
  Typography,
  Upload,
  UploadProps,
} from "antd"
import dayjs from "dayjs"
import ReactEcharts from "echarts-for-react"
import React, { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

// 图表配置
const getChartOption = (data: any) => ({
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
      data: data,
      itemStyle: { color: "#1890ff" },
    },
  ],
})

const Me: React.FC = () => {
  const { setUserInfo, clearUserToken, clearUserInfo, clearCurrentProject, setCurrentProject } = useAction()
  const navigate = useNavigate()
  const { username, email, mobile, position, avatar, id, created_at, create_from, gender, projects } = useUserInfo()
  const [hovered, setHovered] = useState(false)
  const [form] = Form.useForm()
  const [isEditEmail, setIsEditEmail] = useState(false)
  const [isEditMobile, setIsEditMobile] = useState(false)
  const [emailValue, setEmailValue] = useState(email)
  const [mobileValue, setMobileValue] = useState(mobile)
  const [mode, setMode] = useState("month")

  const { data } = useQuery({
    queryKey: ["task"],
    queryFn: () => getUserTasks(Number(id)),
  })

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStatistics(),
  })

  const { data: calendarData } = useQuery({
    queryKey: ["calendar"],
    queryFn: () => getCalendar(),
  })

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
    form.resetFields()
    changePassword({ id: Number(id), ...values })
  }

  const onLogout = () => {
    clearUserToken()
    clearUserInfo()
    clearCurrentProject()
    localStorage.clear()
    navigate("/login", { replace: true })
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

  const handleSaveEmail = () => {
    if (emailValue && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(emailValue)) {
      toast.error("邮箱格式不正确", {
        position: "bottom-left",
      })
      return
    }
    if (emailValue !== email) UpdateUserMutation.mutate({ id: Number(id), email: emailValue })
    setIsEditEmail(false)
  }
  const handleSaveMobile = () => {
    if (mobileValue && !/^1[3-9]\d{9}$/.test(mobileValue)) {
      toast.error("手机号格式不正确", {
        position: "bottom-left",
      })
      return
    }
    if (mobileValue !== mobile) UpdateUserMutation.mutate({ id: Number(id), mobile: mobileValue })
    setIsEditMobile(false)
  }

  const dateCellRender = (value: any) => {
    const dateStr = value.format("YYYY-MM-DD")
    const dayTasks = calendarData?.filter((task: any) => dayjs(task.date).format("YYYY-MM-DD") === dateStr)

    if (mode === "year") {
      const month = value.month()
      const year = value.year()
      const monthTasks = calendarData.filter((task: any) => {
        const d = dayjs(task.date)
        return d.year() === year && d.month() === month
      })
      return (
        <ul>
          {monthTasks?.map((task: any) => (
            <li key={task.id}>
              <Badge
                status="success"
                text={task.title}
              />
            </li>
          ))}
        </ul>
      )
    }

    return (
      <ul>
        {dayTasks?.map((task: any) => (
          <li key={task.id}>
            <Badge
              status="success"
              text={task.title}
            />
          </li>
        ))}
      </ul>
    )
  }

  const items: TabsProps["items"] = [
    {
      key: "tasks",
      label: "我的任务",
      children: (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Space>
                      <Typography.Text strong>{item.title}</Typography.Text>
                      <Tag color={item.priority === -1 ? "blue" : item.priority === 0 ? "green" : "red"}>
                        {item.priority === -1 ? "低" : item.priority === 0 ? "普通" : "高"}
                      </Tag>
                    </Space>
                    <div>
                      <div style={{ color: "rgba(0,0,0,0.45)" }}>所属项目: {item.project_name}</div>
                    </div>
                  </div>
                }
                description={`状态：${item.status === 0 ? "未完成" : item.status === 1 ? "进行中" : "已完成"}`}
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: "calendar",
      label: "我的日程",
      children: (
        <Calendar
          cellRender={dateCellRender}
          onPanelChange={(_, mode) => setMode(mode)}
        />
      ),
    },
    {
      key: "stats",
      label: "我的统计",
      children: (
        <>
          <Row
            gutter={16}
            style={{ marginBottom: 24 }}
          >
            <Col span={6}>
              <Statistic
                title="总任务数"
                value={stats?.total_tasks}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="已完成任务"
                value={stats?.done_tasks}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="进行中任务"
                value={stats?.in_progress_tasks}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="参与项目"
                value={stats?.projects}
              />
            </Col>
          </Row>

          <Card title="任务统计图">
            <ReactEcharts
              option={getChartOption([
                stats?.this_week_tasks,
                stats?.last_week_tasks,
                stats?.this_month_tasks,
                stats?.last_month_tasks,
                stats?.total_tasks,
              ])}
              style={{ height: 300 }}
            />
          </Card>
        </>
      ),
    },
    {
      key: "settings",
      label: "个人设置",
      children: (
        <div style={{ padding: "30px" }}>
          <Card
            title="个人信息"
            style={{
              borderRadius: "10px",
              marginBottom: "30px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Row gutter={24}>
              <Col
                span={16}
                flex="auto"
              >
                <Card.Meta
                  title={username}
                  description={position}
                  style={{ marginBottom: 16 }}
                />
                <Descriptions column={2}>
                  <Descriptions.Item label="ID">{id}</Descriptions.Item>
                  <Descriptions.Item label="账号来源">
                    <Tag>{create_from === 1 ? "Kanboard" : "Kanboard Admin"}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="性别">{gender === 1 ? "男" : "女"}</Descriptions.Item>
                  <Descriptions.Item label="注册时间">{created_at}</Descriptions.Item>
                  <Descriptions.Item
                    label="邮箱"
                    style={{ height: 24 }}
                  >
                    {isEditEmail ? (
                      <Space>
                        <Input
                          size="small"
                          defaultValue={email}
                          onChange={(e) => setEmailValue(e.target.value)}
                        />
                        <Button
                          size="small"
                          type="primary"
                          onClick={handleSaveEmail}
                        >
                          保存
                        </Button>
                      </Space>
                    ) : (
                      <Space>
                        {email}
                        <EditOutlined
                          style={{ color: "#1890ff", cursor: "pointer" }}
                          onClick={() => setIsEditEmail(true)}
                        />
                      </Space>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="手机号"
                    style={{ height: 24 }}
                  >
                    {isEditMobile ? (
                      <Space>
                        <Input
                          size="small"
                          defaultValue={mobile}
                          onChange={(e) => {
                            setMobileValue(e.target.value)
                          }}
                          maxLength={11}
                        />
                        <Button
                          size="small"
                          type="primary"
                          onClick={handleSaveMobile}
                        >
                          保存
                        </Button>
                      </Space>
                    ) : (
                      <Space>
                        {mobile}
                        <EditOutlined
                          style={{ color: "#1890ff", cursor: "pointer" }}
                          onClick={() => setIsEditMobile(true)}
                        />
                      </Space>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>

          <Card
            title="加入的项目"
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Row gutter={16}>
              {projects?.map((project) => (
                <Col
                  span={8}
                  key={project.project_id}
                >
                  <Card
                    hoverable
                    style={{
                      textAlign: "center",
                      borderRadius: "8px",
                      padding: "16px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onClick={() => {
                      setCurrentProject({ project_name: project.project_name, project_id: project.project_id })
                      navigate(`/project/`)
                    }}
                  >
                    <ProjectOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                    <Typography.Title
                      level={5}
                      style={{ marginTop: "10px" }}
                    >
                      {project.project_name}
                    </Typography.Title>
                    <Tooltip title="加入项目时间">
                      <Typography.Text style={{ display: "block", color: "#888", marginTop: "5px" }}>
                        {project.joined_at}
                      </Typography.Text>
                    </Tooltip>
                    <Tooltip title="所属项目角色">
                      <Typography.Text style={{ display: "block", color: "#888", marginTop: "5px" }}>
                        {project.assignee ? "负责人" : "成员"}
                      </Typography.Text>
                    </Tooltip>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      ),
    },
    {
      key: "password",
      label: "修改密码",
      children: (
        <Form
          onFinish={onPasswordChange}
          layout="vertical"
          style={{ maxWidth: 400 }}
          form={form}
        >
          <Form.Item
            label="当前密码"
            name="current"
            rules={[
              { required: true, message: "请输入当前密码" },
              { min: 4, message: "密码至少4位" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="new"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 4, message: "密码至少4位" },
            ]}
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
      ),
    },
  ]

  return (
    <div
      style={{
        padding: 24,
        margin: "0 80px",
      }}
    >
      <Card>
        {/* 用户信息 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
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
          <div>
            <Button
              type="default"
              danger
              icon={<LogoutOutlined />}
              onClick={onLogout}
            >
              退出登录
            </Button>
          </div>
        </div>

        {/* Tabs 内容 */}
        <Tabs
          defaultActiveKey="tasks"
          items={items}
        />
      </Card>
    </div>
  )
}

export default Me
