import { TaskCreateRequest } from "#/api"
import { getProjectMembers } from "@/api/services/projects"
import { createTask, upload } from "@/api/services/tasks"
import { useCurrentProject, useUserInfo } from "@/stores/userStore"
import { computeFileMD5, resourcePath } from "@/utils"
import { LeftOutlined } from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import { Editor, Toolbar } from "@wangeditor/editor-for-react"
import "@wangeditor/editor/dist/css/style.css"
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Tag } from "antd"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export type InsertFnType = (url: string, alt: string, href: string) => void

const CreateTask: React.FC = () => {
  const navigate = useNavigate()
  const currentProject = useCurrentProject()
  const userInfo = useUserInfo()
  const [form] = Form.useForm()
  const [editor, setEditor] = useState<any>(null)
  const [html, setHtml] = useState("")
  const [members, setMembers] = useState([])
  const [selectedAssignees, setSelectedAssignees] = useState([])

  const getProjectMembersMutation = useMutation({
    mutationFn: getProjectMembers,
    onSuccess: (data) => {
      setMembers(data)
    },
  })

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      navigate("/task")
    },
    onError: () => {
      form.resetFields()
      setHtml("")
    },
  })

  useEffect(() => {
    getProjectMembersMutation.mutate(currentProject.project_id as number)
  }, [currentProject.project_id])

  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  useEffect(() => {
    form.setFieldValue("project_id", currentProject.project_id)
  }, [currentProject.project_id])

  const onFinish = (values: any) => {
    const taskData: TaskCreateRequest = {
      ...values,
      desc: html,
      due_date: values?.due_date?.valueOf(),
      assignees: selectedAssignees,
    }
    toast.success("任务创建成功", {
      position: "bottom-left",
    })
    createTaskMutation.mutate(taskData)
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
      <Card title="创建任务">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item
                label="项目"
                name="project_id"
                initialValue={currentProject.project_id}
              >
                <Select
                  options={[{ label: currentProject.project_name, value: currentProject.project_id }]}
                  variant="outlined"
                />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="创建人"
                name="user_id"
                initialValue={userInfo.id}
              >
                <Select
                  options={[{ label: userInfo.username, value: userInfo.id }]}
                  variant="outlined"
                />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="优先级"
                name="priority"
                initialValue={0}
                rules={[{ required: true, message: "请输入任务优先级" }]}
              >
                <Select
                  placeholder="优先级"
                  allowClear
                  options={[
                    { label: <Tag color="red">高</Tag>, value: 1 },
                    { label: <Tag color="blue">普通</Tag>, value: 0 },
                    { label: <Tag color="green">低</Tag>, value: -1 },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="截止时间"
                name="due_date"
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="任务标题"
            name="title"
            rules={[{ required: true, message: "请输入任务标题" }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>

          <Form.Item
            label="负责人"
            name="assignees"
            rules={[{ required: true, message: "请选择负责人" }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择负责人"
              onChange={(selectedValues) => {
                const selectedObjects = members?.filter((member: any) => selectedValues.includes(member.user_id))
                setSelectedAssignees(selectedObjects)
              }}
              onClick={() => {
                getProjectMembersMutation.mutate(currentProject.project_id as number)
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

          <Form.Item label="任务描述">
            <Toolbar
              editor={editor}
              mode="default"
              defaultConfig={{
                excludeKeys: ["fullScreen"],
              }}
            />
            <div style={{ border: "1px solid #d9d9d9", borderRadius: 4 }}>
              <Form.Item name="desc">
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
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
            >
              创建任务
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default CreateTask
