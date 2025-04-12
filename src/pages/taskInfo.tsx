import { getProjectMembers } from "@/api/services/projects"
import {
  addTaskAssignee,
  deleteTask,
  getTaskInfo,
  removeTaskAssignee,
  updateTask,
  updateTaskStatus,
  upload,
} from "@/api/services/tasks"
import { useCurrentProjectIsAssigned, useUserInfo } from "@/stores/userStore"
import { computeFileMD5, resourcePath } from "@/utils"
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  SaveOutlined,
  UserAddOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Editor, Toolbar } from "@wangeditor/editor-for-react"
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Divider,
  List,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useLoaderData, useNavigate } from "react-router"

import { InsertFnType } from "./createTask"

function TaskInfo() {
  const data = useLoaderData()
  const navigate = useNavigate()
  const [task, setTask] = useState<any>(null)
  const [html, setHtml] = useState("")
  const [members, setMembers] = useState([])
  const [isAdd, setIsAdd] = useState(false)
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const { id } = useUserInfo()
  const assignee = useCurrentProjectIsAssigned()
  const [priority, setPriority] = useState(data?.priority)
  const [dueDate, setDueDate] = useState(data?.due_date)
  const [isEdit, setIsEdit] = useState(false)
  const [editor, setEditor] = useState<any>(null)

  const { data: _members } = useQuery({
    queryKey: ["members", data?.project_id],
    queryFn: () => getProjectMembers(data?.project_id as number),
  })

  const getProjectMembersMutation = useMutation({
    mutationFn: getProjectMembers,
    onSuccess: (data) => {
      setMembers(data)
    },
  })

  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  useEffect(() => {
    setMembers(_members)
  }, [_members])

  useEffect(() => {
    setTask(data)
    setPriority(data?.priority)
    setDueDate(data?.due_date)
    setHtml(data.desc || "")
    getProjectMembersMutation.mutate(data.project_id as number)
  }, [data])

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      navigate("/task")
    },
  })

  const getTaskMutation = useMutation({
    mutationFn: getTaskInfo,
    onSuccess: (data) => {
      setTask(data)
    },
  })

  const updateStatueMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      getTaskMutation.mutate({ taskId: task.id, projectId: task.project_id })
    },
  })

  const addTaskAssigneeMutation = useMutation({
    mutationFn: addTaskAssignee,
    onSuccess: () => {
      setSelectedAssignees([])
      getTaskMutation.mutate({ taskId: task.id, projectId: task.project_id })
    },
    onError: () => {
      setSelectedAssignees([])
    },
  })

  const removeTaskAssigneeMutation = useMutation({
    mutationFn: removeTaskAssignee,
    onSuccess: () => {
      getTaskMutation.mutate({ taskId: task.id, projectId: task.project_id })
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      getTaskMutation.mutate({ taskId: task.id, projectId: task.project_id })
    },
  })

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate({ id: task.id, project_id: task.project_id })
  }

  const handleUpdateDone = () => {
    updateStatueMutation.mutate({ id: task.id, project_id: task.project_id, status: 2 })
  }

  const handleAddTaskAssignee = () => {
    if (!selectedAssignees.length) return setIsAdd(false)
    addTaskAssigneeMutation.mutate({ id: task.id, project_id: task.project_id, assignees: selectedAssignees })
    setIsAdd(false)
  }

  return (
    <div style={{ padding: 24, margin: "0 80px" }}>
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{ cursor: "pointer", width: "fit-content" }}
          onClick={() => navigate("/task")}
        >
          <LeftOutlined /> 返回
        </div>
      </Card>
      <Card
        title={
          <span
            style={{
              fontSize: 20,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ lineHeight: 1 }}>{task?.title}</span>
            <Tag
              color={task?.status === 0 ? "red" : task?.status === 1 ? "blue" : "green"}
              style={{
                marginLeft: 12,
                lineHeight: "24px",
                padding: "0 8px",
              }}
            >
              {task?.status === 2 ? "已完成" : task?.status === 1 ? "进行中" : "未完成"}
            </Tag>
          </span>
        }
        extra={
          (task?.creator?.id === id || assignee) && (
            <>
              {task?.status !== 2 && (
                <Button
                  icon={<CheckCircleOutlined />}
                  style={{ marginRight: 8 }}
                  onClick={handleUpdateDone}
                >
                  标记完成
                </Button>
              )}
              <Button
                icon={<DeleteOutlined />}
                onClick={handleDeleteTask}
                danger
              >
                删除
              </Button>
            </>
          )
        }
      >
        <Descriptions
          column={2}
          bordered
        >
          <Descriptions.Item label="任务ID">{task?.id}</Descriptions.Item>
          <Descriptions.Item label="所属项目">{task?.project_name}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{task?.created_at}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{task?.updated_at}</Descriptions.Item>
          <Descriptions.Item label="优先级">
            <Select
              defaultValue={priority}
              onChange={(value) =>
                updateTaskMutation.mutate({ id: task.id, project_id: task.project_id, priority: value })
              }
              disabled={!(task?.creator?.id === id || assignee)}
            >
              <Select.Option value={1}>
                <Tag color="red">高</Tag>
              </Select.Option>
              <Select.Option value={0}>
                <Tag color="blue">普通</Tag>
              </Select.Option>
              <Select.Option value={-1}>
                <Tag color="orange">低</Tag>
              </Select.Option>
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="截止时间">
            <DatePicker
              defaultValue={dueDate && dayjs(dueDate)}
              onChange={(date) =>
                updateTaskMutation.mutate({ id: task.id, project_id: task.project_id, due_date: date?.valueOf() })
              }
              disabled={!(task?.creator?.id === id || assignee)}
            />
          </Descriptions.Item>
          <Descriptions.Item label="创建人">
            <Tooltip title={task?.creator?.username}>
              <Avatar
                icon={task?.creator?.avatar ? null : <UserOutlined />}
                src={resourcePath(task?.creator?.avatar) || undefined}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
            {task?.creator?.username}
          </Descriptions.Item>
          <Descriptions.Item
            label="任务负责人"
            style={{ verticalAlign: "middle" }}
          >
            <Avatar.Group
              max={{
                count: 3,
              }}
            >
              {task?.members?.map((member: any) => (
                <Tooltip
                  title={member?.username}
                  key={member?.id}
                >
                  <Avatar
                    icon={member?.avatar ? null : <UserOutlined />}
                    src={resourcePath(member?.avatar) || undefined}
                  />
                </Tooltip>
              ))}
            </Avatar.Group>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Card
          title="任务创建人"
          style={{ marginBottom: 24 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={task?.creator ? [task?.creator] : []}
            renderItem={(creator: any, index) => (
              <List.Item key={creator?.id || index}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={creator?.avatar ? null : <UserOutlined />}
                      src={resourcePath(creator?.avatar) || undefined}
                    />
                  }
                  title={
                    <Space>
                      <Typography.Text>{creator?.username}</Typography.Text>
                      <div>
                        {creator.gender === 1 && (
                          <Tag
                            color="#2db7f5"
                            icon={<ManOutlined />}
                          />
                        )}
                        {creator?.gender === 2 && (
                          <Tag
                            color="#f50"
                            icon={<WomanOutlined />}
                          />
                        )}
                        {creator?.email && <Tag icon={<MailOutlined />}>{creator?.email}</Tag>}
                        {creator?.mobile && <Tag icon={<PhoneOutlined />}>{creator?.mobile}</Tag>}
                        {creator?.assignee && <Tag color="green">项目负责人</Tag>}
                      </div>
                    </Space>
                  }
                  description={creator?.position}
                />
              </List.Item>
            )}
          />
        </Card>

        <Card
          title="任务负责人"
          style={{ marginBottom: 24 }}
          extra={
            (task?.creator?.id === id || assignee) &&
            (isAdd ? (
              <Space style={{ margin: "0 8px" }}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="选择负责人"
                  style={{ width: 200 }}
                  mode="multiple"
                  onClick={() => {
                    getProjectMembersMutation.mutate(task.project_id as number)
                  }}
                  onChange={(selectedValues) => {
                    const selectedObjects = members?.filter((member: any) => selectedValues.includes(member.user_id))
                    setSelectedAssignees(selectedObjects)
                  }}
                >
                  {members?.map((member: any) => (
                    <Select.Option
                      key={member.user_id}
                      value={member.user_id}
                      label={member.username}
                    >
                      {member.username}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  icon={<CheckCircleOutlined />}
                  onClick={handleAddTaskAssignee}
                >
                  完成
                </Button>
              </Space>
            ) : (
              <Button
                style={{ margin: "0 8px" }}
                icon={<UserAddOutlined />}
                type="primary"
                onClick={() => setIsAdd(true)}
              >
                添加
              </Button>
            ))
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={task?.members}
            renderItem={(member: any) => (
              <List.Item
                key={member?.id}
                actions={[
                  (task?.creator?.id === id || assignee) && (
                    <Button
                      icon={<DeleteOutlined />}
                      type="primary"
                      danger
                      onClick={() => {
                        removeTaskAssigneeMutation.mutate({
                          id: task.id,
                          project_id: task.project_id,
                          user_id: member.id,
                        })
                      }}
                    >
                      移除
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={member?.avatar ? null : <UserOutlined />}
                      src={resourcePath(member?.avatar) || undefined}
                    />
                  }
                  title={
                    <Space>
                      <Typography.Text>{member?.username}</Typography.Text>
                      <div>
                        {member.gender === 1 && (
                          <Tag
                            color="#2db7f5"
                            icon={<ManOutlined />}
                          />
                        )}
                        {member?.gender === 2 && (
                          <Tag
                            color="#f50"
                            icon={<WomanOutlined />}
                          />
                        )}
                        {member?.email && <Tag icon={<MailOutlined />}>{member?.email}</Tag>}
                        {member?.mobile && <Tag icon={<PhoneOutlined />}>{member?.mobile}</Tag>}
                        {member?.assignee && <Tag color="green">项目负责人</Tag>}
                      </div>
                    </Space>
                  }
                  description={member?.position}
                />
              </List.Item>
            )}
          />
        </Card>

        <Divider />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ marginBottom: 12 }}>任务描述</h3>
          {(task?.creator?.id === id || assignee) && (
            <Button
              icon={isEdit ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => {
                if (isEdit && html !== task?.desc) {
                  updateTaskMutation.mutate({
                    id: task.id,
                    project_id: task.project_id,
                    desc: html,
                  })
                }
                setIsEdit(!isEdit)
              }}
            >
              {isEdit ? "保存" : "编辑"}
            </Button>
          )}
        </div>
        <div style={{ border: "1px solid #f0f0f0", padding: 12, borderRadius: 6 }}>
          {isEdit ? (
            <>
              <Toolbar
                editor={editor}
                mode="default"
                defaultConfig={{
                  excludeKeys: ["fullScreen"],
                }}
              />
              <div style={{ border: "1px solid #d9d9d9", borderRadius: 4 }}>
                <Editor
                  defaultConfig={{
                    placeholder: "请输入任务描述...",
                    MENU_CONF: {
                      uploadImage: {
                        customUpload: async (file: File, insertFn: any) => {
                          const md5 = await computeFileMD5(file)
                          const formData = new FormData()
                          formData.append("file", file)
                          formData.append("md5", md5)

                          const result = await upload(formData)

                          insertFn(resourcePath(result.URL), file.name, resourcePath(result.URL))
                        },
                      },
                      uploadVideo: {
                        customUpload: async (file: File, insertFn: InsertFnType) => {
                          const md5 = await computeFileMD5(file)
                          const formData = new FormData()
                          formData.append("file", file)
                          formData.append("md5", md5)

                          const result = await upload(formData)

                          insertFn(resourcePath(result.URL), file.name, resourcePath(result.URL))
                        },
                      },
                    },
                  }}
                  mode="default"
                  value={html}
                  onCreated={setEditor}
                  onChange={(editor) => setHtml(editor.getHtml())}
                  style={{ height: 300, overflowY: "auto" }}
                />
              </div>
            </>
          ) : (
            <Editor
              mode="default"
              defaultConfig={{ readOnly: true }}
              value={html}
            />
          )}
        </div>
      </Card>
    </div>
  )
}

export default TaskInfo
