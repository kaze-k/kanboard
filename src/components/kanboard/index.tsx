import {
  Announcements,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { BoardColumn } from "./BoardColumn"
import type { Column } from "./BoardColumn"
import { type Task, TaskCard } from "./TaskCard"
import { coordinateGetter } from "./multipleContainersKeyboardPreset"
import { hasDraggableData } from "./utils"

const defaultCols = [
  {
    id: 0 as const,
    title: "未完成",
  },
  {
    id: 1 as const,
    title: "进行中",
  },
  {
    id: 2 as const,
    title: "完成",
  },
] satisfies Column[]

export type ColumnId = (typeof defaultCols)[number]["id"]

const initialTasks: Task[] = [
  {
    id: "task1",
    status: 2,
    title: "Task 1",
    desc: "Project initiation and planning",
    proiority: 1,
  },
  {
    id: "task2",
    status: 2,
    title: "Task 2",
    desc: "Gather requirements from stakeholders",
    proiority: 1,
  },
  {
    id: "task3",
    status: 2,
    title: "Task 3",
    desc: "Create wireframes and mockups",
    proiority: 1,
  },
  {
    id: "task4",
    status: 1,
    title: "Task 4",
    desc: "Develop homepage layout",
    proiority: 0,
  },
  {
    id: "task5",
    status: 1,
    title: "Task 5",
    desc: "Design color scheme and typography",
    proiority: 0,
  },
  {
    id: "task6",
    status: 0,
    title: "Task 6",
    desc: "Implement user authentication",
    proiority: 0,
  },
  {
    id: "task7",
    status: 0,
    title: "Task 7",
    desc: "Build contact us page",
    proiority: 0,
  },
  {
    id: "task8",
    status: 0,
    title: "Task 8",
    desc: "Create product catalog",
    proiority: 0,
  },
  {
    id: "task9",
    status: 0,
    title: "Task 9",
    desc: "Develop about us page",
    proiority: 0,
  },
  {
    id: "task10",
    status: 0,
    title: "Task 10",
    desc: "Optimize website for mobile devices",
    proiority: -1,
  },
  {
    id: "task11",
    status: 0,
    title: "Task 11",
    desc: "Integrate payment gateway",
    proiority: 0,
  },
  {
    id: "task12",
    status: 0,
    title: "Task 12",
    desc: "Perform testing and bug fixing",
    proiority: 1,
  },
  {
    id: "task13",
    status: 0,
    title: "Task 13",
    desc: "Launch website and deploy to server",
    proiority: 0,
  },
]
export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols)
  const pickedUpTaskColumn = useRef<ColumnId | null>(null)
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const [activeColumn, setActiveColumn] = useState<Column | null>(null)

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    }),
  )

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.status === columnId)
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId)
    const column = columns.find((col) => col.id === columnId)
    return {
      tasksInColumn,
      taskPosition,
      column,
    }
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id)
        const startColumn = columns[startColumnIdx]
        return `Picked up Column ${startColumn?.title} at position: ${startColumnIdx + 1} of ${columnsId.length}`
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.status
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current as ColumnId,
        )
        return `Picked up Task ${active.data.current.task.desc} at position: ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return

      if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id)
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`
      } else if (active.data.current?.type === "Task" && over.data.current?.type === "Task") {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(over.id, over.data.current.task.status)
        if (over.data.current.task.status !== pickedUpTaskColumn.current) {
          return `Task ${active.data.current.task.desc} was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`
        }
        return `Task was moved over position ${taskPosition + 1} of ${tasksInColumn.length} in column ${column?.title}`
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null
        return
      }
      if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id)

        return `Column ${active.data.current.column.title} was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`
      } else if (active.data.current?.type === "Task" && over.data.current?.type === "Task") {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(over.id, over.data.current.task.status)
        if (over.data.current.task.status !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`
      }
      pickedUpTaskColumn.current = null
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null
      if (!hasDraggableData(active)) return
      return `Dragging ${active.data.current?.type} cancelled.`
    },
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 80px",
      }}
    >
      <DndContext
        accessibility={{
          announcements,
        }}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.status === col.id)}
            />
          ))}
        </SortableContext>

        {"document" in window &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <BoardColumn
                  isOverlay
                  column={activeColumn}
                  tasks={tasks.filter((task) => task.status === activeColumn.id)}
                />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  isOverlay
                />
              )}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </div>
  )

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return
    const data = event.active.data.current
    if (data?.type === "Column") {
      setActiveColumn(data.column)
      return
    }

    if (data?.type === "Task") {
      setActiveTask(data.task)
      return
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null)
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (!hasDraggableData(active)) return

    const activeData = active.data.current

    if (activeId === overId) return

    const isActiveAColumn = activeData?.type === "Column"
    if (!isActiveAColumn) return

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId)

      const overColumnIndex = columns.findIndex((col) => col.id === overId)

      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    })
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    if (!hasDraggableData(active) || !hasDraggableData(over)) return

    const activeData = active.data.current
    const overData = over.data.current

    const isActiveATask = activeData?.type === "Task"
    const isOverATask = overData?.type === "Task"

    if (!isActiveATask) return

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)
        const activeTask = tasks[activeIndex]
        const overTask = tasks[overIndex]
        if (activeTask && overTask && activeTask.status !== overTask.status) {
          activeTask.status = overTask.status
          return arrayMove(tasks, activeIndex, overIndex - 1)
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = overData?.type === "Column"

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const activeTask = tasks[activeIndex]
        if (activeTask) {
          activeTask.status = overId as ColumnId
          return arrayMove(tasks, activeIndex, activeIndex)
        }
        return tasks
      })
    }
  }
}
