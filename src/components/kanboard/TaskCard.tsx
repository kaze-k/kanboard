import { BarsOutlined } from "@ant-design/icons"
import type { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button, Tag, Typography } from "antd"

import type { ColumnId } from "./index"

const { Text } = Typography

export interface Task {
  id: UniqueIdentifier
  status: ColumnId
  title: string
  desc: string
  proiority: number
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
    padding: "12px",
    whiteSpace: "pre-wrap",
    textAlign: "left",
    backgroundColor: "#fff",
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
          color={task.proiority === 0 ? "blue" : task.proiority === 1 ? "red" : "green"}
        >
          {task.proiority === 0 ? "普通" : task.proiority === 1 ? "高" : "低"}
        </Tag>
      </div>
      <div style={contentStyle}>{task.desc}</div>
    </div>
  )
}
