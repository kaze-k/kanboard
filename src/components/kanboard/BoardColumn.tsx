import { BarsOutlined } from "@ant-design/icons"
import { type UniqueIdentifier, useDndContext } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button, Card } from "antd"
import { useMemo } from "react"

import { Task, TaskCard } from "./TaskCard"
import { ScrollArea, ScrollBar } from "./scroll-area"

export interface Column {
  id: UniqueIdentifier
  status: number
  title: string
}

export type ColumnType = "Column"

export interface ColumnDragData {
  type: ColumnType
  column: Column
  status: number
}

interface BoardColumnProps {
  column: Column
  tasks: Task[]
  isOverlay?: boolean
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks])

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
      status: column.status,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    height: "70vh",
    maxHeight: "70vh",
    width: 350,
    backgroundColor: "#fff",
    flexShrink: 0,
    scrollSnapAlign: "center",
    border: isOverlay ? "2px solid #1677ff" : isDragging ? "2px solid #d9d9d9" : "2px solid transparent",
    boxShadow: isOverlay ? "0 0 0 2px #1677ff" : undefined,
    display: "flex",
    flexDirection: "column",
    opacity: isDragging ? 0.5 : 1,
  } as React.CSSProperties

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={<BarsOutlined />}
              {...attributes}
              {...listeners}
              style={{
                cursor: "grab",
                color: "#999",
                marginRight: "auto",
              }}
            />
            <span style={{ marginLeft: "auto" }}>{column.title}</span>
          </div>
        }
        styles={{
          body: {
            overflowY: "auto",
            padding: 0,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            height: "70vh",
            maxHeight: "70vh",
          },
          header: {
            borderBottom: "2px solid #f0f0f0",
            padding: "16px",
          },
        }}
        variant="borderless"
        style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}
      >
        <ScrollArea>
          <SortableContext
            items={tasksIds}
            id={column.id.toString()}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))}
          </SortableContext>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </Card>
    </div>
  )
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext()

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    padding: "0 8px 16px",
    overflowX: "auto",
    justifyContent: "center",
    scrollSnapType: dndContext.active ? "none" : "x mandatory",
  }

  return <div style={containerStyle}>{children}</div>
}
