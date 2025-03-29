import { Form, Input, Modal, Select } from "antd"
import { useEffect } from "react"

type ModalProps = {
  initialValues?: any
  open?: boolean
  onOk?: (value: any) => void
  onCancel?: () => void
  confirmLoading?: boolean
}

function UserEditForm({ initialValues, open, onOk, onCancel, confirmLoading }: ModalProps) {
  const { useForm } = Form
  const [form] = useForm()

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [open, initialValues, form])

  return (
    <Modal
      title="编辑用户"
      open={open}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        initialValues={initialValues}
        requiredMark="optional"
        onFinish={onOk}
      >
        <Form.Item
          label="职位"
          name="position"
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label="性别"
          rules={[{ required: true, message: "请选择性别" }]}
          name="gender"
        >
          <Select allowClear>
            <Select.Option value={1}>男</Select.Option>
            <Select.Option value={2}>女</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="登录"
          rules={[{ required: true, message: "请选择是否可登录" }]}
          name="loginable"
        >
          <Select allowClear>
            <Select.Option value={true}>可登录</Select.Option>
            <Select.Option value={false}>不可登录</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="管理员"
          rules={[{ required: true, message: "请选择是否为管理员" }]}
          name="is_admin"
        >
          <Select allowClear>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserEditForm
