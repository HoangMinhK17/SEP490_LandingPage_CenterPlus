import React, { useEffect, useState } from 'react'
import {
  Alert,
  Form,
  Input,
  Modal,
  Space,
  Typography,
  message
} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '../services/auth'

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return

    setError(null)
    form.resetFields()
  }, [isOpen, form])

  const handleClose = () => {
    if (loading) return

    form.resetFields()
    setError(null)
    onClose?.()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      setError(null)

      await login(values.username.trim(), values.password)
      message.success('Đăng nhập thành công!')
      onLoginSuccess?.()
      handleClose()
    } catch (err) {
      if (err?.errorFields) {
        setError('Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.')
        return
      }

      const errorMessage = err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      cancelText="Huỷ"
      confirmLoading={loading}
      title="Đăng nhập"
      centered
      destroyOnClose
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Vui lòng đăng nhập để xem danh sách khóa học.
        </Typography.Paragraph>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
          />
        )}

        <Form
          form={form}
          layout="vertical"
          initialValues={{ username: '', password: '' }}
          disabled={loading}
        >
          <Form.Item
            label="Tên đăng nhập hoặc Email"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập hoặc email' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập hoặc Email"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              autoComplete="current-password"
            />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  )
}

export default LoginModal
