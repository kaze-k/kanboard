import { getMsgByProjectId } from "@/api/services/message"
import { addProjectMember, getMembers, getProject, removeProjectMember } from "@/api/services/projects"
import { useCurrentProject, useCurrentProjectIsAssigned, useUserInfo } from "@/stores/userStore"
import { resourcePath } from "@/utils"
import {
  CarryOutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  FireOutlined,
  LoadingOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  SmileOutlined,
  UserAddOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd"
import { throttle } from "lodash"
import React, { useEffect, useRef, useState } from "react"

const Project: React.FC = () => {
  const [project, setProject] = useState<any>(null)
  const currentProject = useCurrentProject()
  const assignee = useCurrentProjectIsAssigned()
  const [isAdd, setIsAdd] = useState(false)
  const [selectedMembers, setSelectedAssignees] = useState([])
  const [members, setMembers] = useState([])
  const { id } = useUserInfo()

  const { data: recentUpdates } = useQuery({
    queryKey: ["recentUpdates", currentProject.project_id],
    queryFn: () => getMsgByProjectId(currentProject.project_id as number),
  })

  const getProjectMutation = useMutation({
    mutationFn: getProject,
    onSuccess: (data) => {
      setProject(data)
    },
  })

  const getMembersMutation = useMutation({
    mutationFn: getMembers,
    onSuccess: (data) => {
      setMembers(data)
      getProjectMutation.mutate(currentProject.project_id as number)
    },
  })

  const addMemberMutation = useMutation({
    mutationFn: addProjectMember,
    onSuccess: () => {
      getProjectMutation.mutate(currentProject.project_id as number)
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: removeProjectMember,
    onSuccess: () => {
      getProjectMutation.mutate(currentProject.project_id as number)
    },
  })

  useEffect(() => {
    getProjectMutation.mutate(currentProject.project_id as number)
  }, [currentProject.project_id])

  const handleAddMember = () => {
    if (selectedMembers.length === 0) return setIsAdd(false)
    addMemberMutation.mutate({
      project_id: currentProject.project_id as number,
      members: selectedMembers,
      user_id: Number(id),
    })
    setIsAdd(false)
  }

  const aheadGetMembers = useRef(
    throttle(() => {
      getMembersMutation.mutate(currentProject.project_id as number)
    }, 3000), // 每 3 秒最多触发一次
  ).current

  return (
    <div style={{ padding: 24, margin: "0 80px" }}>
      {/* 任务概览 */}
      <Card
        title="项目任务概览"
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="总任务数"
              value={project?.statistics?.task_total}
              prefix={<CarryOutOutlined style={{ color: "#1890ff", marginRight: 5 }} />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="进行中"
              value={project?.statistics?.task_in_progress}
              prefix={<LoadingOutlined style={{ color: "#faad14", marginRight: 5 }} />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="已完成"
              value={project?.statistics?.task_done}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a", marginRight: 5 }} />}
            />
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="高优先级"
              value={project?.statistics?.task_high}
              prefix={<FireOutlined style={{ color: "#f5222d", marginRight: 5 }} />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="中优先级"
              value={project?.statistics?.task_medium}
              prefix={<ClockCircleOutlined style={{ color: "#fa8c16", marginRight: 5 }} />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="低优先级"
              value={project?.statistics?.task_low}
              prefix={<SmileOutlined style={{ color: "#1890ff", marginRight: 5 }} />}
            />
          </Col>
        </Row>
      </Card>

      <Row
        justify="space-between"
        style={{ marginBottom: 24 }}
      >
        {/* 优先级分布 */}
        <Col span={4}>
          <Card title="高优先级任务占比">
            <Progress
              percent={Math.round((project?.statistics?.task_high / project?.statistics?.task_total) * 100)}
              status="exception"
              strokeColor="#f5222d"
              format={(p) => `${p}% 高优`}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card title="中优先级任务占比">
            <Progress
              percent={Math.round((project?.statistics?.task_medium / project?.statistics?.task_total) * 100)}
              strokeColor="#faad14"
              format={(p) => `${p}% 中优`}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card title="低优先级任务占比">
            <Progress
              percent={Math.round((project?.statistics?.task_low / project?.statistics?.task_total) * 100)}
              strokeColor="#1890ff"
              format={(p) => `${p}% 低优`}
            />
          </Card>
        </Col>

        {/* 正在进行任务进度 */}
        <Col span={4}>
          <Card title="进行中任务">
            <Progress
              percent={Math.round((project?.statistics?.task_in_progress / project?.statistics?.task_total) * 100)}
              status="active"
              format={(p) => `${p}% 进行中`}
            />
          </Card>
        </Col>

        {/* 已完成任务进度 */}
        <Col span={4}>
          <Card title="已完成任务">
            <Progress
              percent={Math.round((project?.statistics?.task_done / project?.statistics?.task_total) * 100)}
              status="success"
              strokeColor="#52c41a"
              format={(p) => `${p}% 已完成`}
            />
          </Card>
        </Col>
      </Row>

      {/* 项目成员 */}
      <Card
        title="项目成员"
        style={{ marginBottom: 24 }}
        extra={
          assignee &&
          (isAdd ? (
            <Space style={{ margin: "0 8px" }}>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="选择负责人"
                style={{ width: 200 }}
                mode="multiple"
                onClick={() => {
                  getMembersMutation.mutate(currentProject?.project_id as number)
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
                onClick={handleAddMember}
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
              onMouseMove={aheadGetMembers}
            >
              添加
            </Button>
          ))
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={project?.members}
          renderItem={(member: any) => (
            <List.Item
              actions={[
                assignee && (
                  <Button
                    icon={<DeleteOutlined />}
                    type="primary"
                    danger
                    onClick={() => {
                      removeMemberMutation.mutate({
                        project_id: currentProject?.project_id as number,
                        member_id: member.id,
                        user_id: Number(id),
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

      {/* 最近动态 */}
      <Card
        title="最近动态"
        style={{ marginTop: 24 }}
      >
        <List
          dataSource={recentUpdates}
          renderItem={(item: any, index) => (
            <List.Item key={item.id || index}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<ClockCircleOutlined />}
                    style={{ backgroundColor: "#faad14" }}
                  />
                }
                title={item.content}
                description={item.created_at}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default Project
