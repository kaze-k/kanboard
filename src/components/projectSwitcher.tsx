import { useAction, useCurrentProject, useProject } from "@/stores/userStore"
import { Select, Space, Tag } from "antd"
import { useEffect, useState } from "react"

const { Option } = Select

function ProjectSwitcher() {
  const { setCurrentProject } = useAction()
  const projects = useProject()
  const currentProject = useCurrentProject()
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    // 初始化选中的项目
    if (currentProject.project_id) {
      setSelectedProject(currentProject.project_id)
    }
  }, [currentProject.project_id])

  const handleProjectChange = (value: number) => {
    // 处理项目切换
    setSelectedProject(value)
    setCurrentProject({ project_id: value, project_name: projects?.find((p) => p.project_id === value)?.project_name })
  }

  const handleFocus = () => {
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(false)
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {projects?.length !== 0 ? (
        <Select
          suffixIcon={null}
          style={{ width: 200 }}
          value={selectedProject}
          onChange={handleProjectChange}
          variant={focused ? "filled" : "borderless"}
          onFocus={handleFocus} // 当选择框聚焦时显示边框
          onBlur={handleBlur} // 当选择框失去焦点时隐藏边框
          className="project-switcher"
        >
          {projects?.map((project) => (
            <Option
              key={project.project_id}
              value={project.project_id}
              style={{ textAlign: "center" }}
            >
              <Space>
                <Tag color="blue">{project.project_name}</Tag>
              </Space>
            </Option>
          ))}
        </Select>
      ) : (
        <Tag color="blue">无项目</Tag>
      )}
    </div>
  )
}

export default ProjectSwitcher
