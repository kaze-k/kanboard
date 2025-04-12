import { TaskSearchRequest } from "#/api"
import { getProjectMembers } from "@/api/services/projects"
import { getTasks, searchTask, updateTaskStatus } from "@/api/services/tasks"
import { KanbanBoard } from "@/components/kanboard"
import { useCurrentProject } from "@/stores/userStore"
import { useWebSocketContext } from "@/webSocketProvider"
import { useMutation } from "@tanstack/react-query"
import { Button, Card, Col, Form, Input, Row, Select, Tag } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

function Home() {
  const navigate = useNavigate()
  const currentProject = useCurrentProject()
  const [tasks, setTasks] = useState([])
  const [data, setData] = useState([])
  const [members, setMembers] = useState([])
  const [form] = Form.useForm()
  const [isSearch, setIsSearch] = useState(false)
  const [searchParams, setSearchParams] = useState({})
  const { lastJsonMessage } = useWebSocketContext()

  const getTasksMutation = useMutation({
    mutationFn: getTasks,
  })

  useEffect(() => {
    if (currentProject?.project_id === 0) return
    getProjectMembersMutation.mutate(currentProject?.project_id as number, {
      onSuccess: (data) => {
        setMembers(data)
      },
    })
    getTasksMutation.mutate(currentProject?.project_id as number, {
      onSuccess: (data) => {
        setData(data)
      },
    })
  }, [])

  useEffect(() => {
    if (currentProject?.project_id === 0) return
    if (lastJsonMessage && lastJsonMessage?.message_type !== "new_task_status") return

    getTasksMutation.mutate(currentProject?.project_id as number, {
      onSuccess: (data) => {
        setData(data)
      },
    })
  }, [currentProject?.project_id, lastJsonMessage?.message_type])

  useEffect(() => {
    if (!data) return
    setTasks(data)
  }, [data])

  const getProjectMembersMutation = useMutation({
    mutationFn: getProjectMembers,
  })

  const searchTaskMutation = useMutation({
    mutationFn: searchTask,
  })

  const handleSearch = (values: TaskSearchRequest) => {
    setIsSearch(true)
    setSearchParams({ ...values, project_id: currentProject })
    searchTaskMutation.mutate(
      { ...values, project_id: currentProject?.project_id as number },
      {
        onSuccess: (data) => {
          setTasks(data)
        },
      },
    )
  }

  const handleReset = () => {
    setIsSearch(false)
    form.resetFields()
    getTasksMutation.mutate(currentProject?.project_id as number, {
      onSuccess: (data) => {
        setTasks(data)
      },
    })
  }

  const handleCreateTask = () => {
    navigate("/task/createTask")
  }

  const updateTaskMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: async () => {
      const result = isSearch
        ? await searchTaskMutation.mutateAsync(searchParams)
        : await getTasksMutation.mutateAsync(currentProject?.project_id as number)
      setTasks(result)
    },
    onError: async () => {
      const result = isSearch
        ? await searchTaskMutation.mutateAsync(searchParams)
        : await getTasksMutation.mutateAsync(currentProject?.project_id as number)
      setTasks(result)
    },
  })

  const handleStatus = (status: number, taskId: number, projectId: number) => {
    updateTaskMutation.mutate({ project_id: projectId, id: taskId, status })
  }

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 80px",
      }}
    >
      {/* 筛选器区域 */}
      <Row
        gutter={16}
        style={{ marginBottom: 16 }}
      >
        <Form
          layout="inline"
          form={form}
          onFinish={handleSearch}
        >
          <Form.Item name="title">
            <Input.Search
              placeholder="搜索任务标题"
              allowClear
            />
          </Form.Item>
          <Form.Item name="priority">
            <Select
              placeholder="优先级"
              style={{ width: 120 }}
              allowClear
              options={[
                { label: <Tag color="red">高</Tag>, value: 1 },
                { label: <Tag color="blue">普通</Tag>, value: 0 },
                { label: <Tag color="green">低</Tag>, value: -1 },
              ]}
            />
          </Form.Item>
          <Form.Item name="creator_id">
            <Select
              placeholder="创建人"
              style={{ width: 120 }}
              allowClear
              onClick={() => {
                getProjectMembersMutation.mutate(currentProject?.project_id as number, {
                  onSuccess: (data) => {
                    setMembers(data)
                  },
                })
              }}
            >
              {members?.map((member: any) => (
                <Select.Option
                  key={member.user_id}
                  value={member.user_id}
                >
                  {member.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="user_id">
            <Select
              placeholder="成员"
              style={{ width: 120 }}
              allowClear
              onClick={() => {
                getProjectMembersMutation.mutate(currentProject?.project_id as number, {
                  onSuccess: (data) => {
                    setMembers(data)
                  },
                })
              }}
            >
              {members?.map((member: any) => (
                <Select.Option
                  key={member.user_id}
                  value={member.user_id}
                >
                  {member.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
            >
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleReset}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
        <Col>
          <Button
            type="primary"
            onClick={handleCreateTask}
            disabled={currentProject.project_id === 0}
          >
            创建任务
          </Button>
        </Col>
      </Row>
      <Card style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <KanbanBoard
            initialTasks={tasks}
            onHandleDragEnd={handleStatus}
          />
        </div>
      </Card>
    </div>
  )
}

export default Home
