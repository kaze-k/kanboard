import { resourcePath } from "@/utils"
import { BarsOutlined, UserOutlined } from "@ant-design/icons"
import type { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Avatar, Button, Card, Tag, Tooltip, Typography } from "antd"
import { useNavigate } from "react-router"

import type { ColumnId } from "./index"

const { Text } = Typography

interface Member {
  avatar: string
  user_id: number
  username: string
}

export interface Task {
  id: UniqueIdentifier
  status: ColumnId
  title: string
  desc: string
  priority: number
  members: Member[]
  creator: Member
}

interface TaskCardProps {
  task: Task
  isOverlay?: boolean
}

export type TaskType = "Task"

export interface TaskDragData {
  type: TaskType
  task: Task
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const navigate = useNavigate()

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  })

  const style: React.CSSProperties = {
    transition,
    transform: CSS.Translate.toString(transform),
    border: isOverlay ? "2px solid #1677ff" : isDragging ? "2px solid #d9d9d9" : "1px solid #f0f0f0",
    boxShadow: isOverlay ? "0 0 0 2px #1677ff" : undefined,
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    overflow: "hidden",
    opacity: isDragging ? 0.5 : 1,
  }

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    borderBottom: "2px solid #f0f0f0",
    padding: "12px 12px",
    backgroundColor: "#fafafa",
  }

  const contentStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    whiteSpace: "pre-wrap",
    textAlign: "left",
    backgroundColor: "#fff",
    marginBottom: 8,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div style={headerStyle}>
        <Button
          type="text"
          icon={<BarsOutlined />}
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            color: "rgba(0, 0, 0, 0.45)",
            padding: 4,
            marginRight: "auto",
          }}
        />
        <Text>{task.title}</Text>
        <Tag
          bordered={true}
          style={{ marginLeft: "auto", fontWeight: 500 }}
          color={task.priority === 0 ? "blue" : task.priority === 1 ? "red" : "green"}
        >
          {task.priority === 0 ? "普通" : task.priority === 1 ? "高" : "低"}
        </Tag>
      </div>
      <Card
        style={{ backgroundColor: "#fff", cursor: "pointer" }}
        onClick={() => {
          const id = (task.id as string).split("-")[1]
          navigate(`/task/${id}`)
        }}
      >
        <div style={contentStyle}>
          <Text
            type="secondary"
            style={{ marginRight: 8 }}
          >
            任务创建人：
          </Text>
          <Tooltip title={task.creator.username}>
            <Avatar
              src={resourcePath(task.creator.avatar) || undefined}
              icon={!task.creator.avatar && <UserOutlined />}
            />
          </Tooltip>
        </div>
        <div style={contentStyle}>
          <Text
            type="secondary"
            style={{ marginRight: 8 }}
          >
            任务负责人：
          </Text>
          <Avatar.Group
            max={{
              count: 3,
            }}
          >
            {task?.members?.map((member) => (
              <Tooltip
                key={member.user_id}
                title={member.username}
              >
                <Avatar
                  src={resourcePath(member.avatar) || undefined}
                  icon={!member.avatar && <UserOutlined />}
                />
              </Tooltip>
            ))}
          </Avatar.Group>
        </div>
      </Card>
    </div>
  )
}
