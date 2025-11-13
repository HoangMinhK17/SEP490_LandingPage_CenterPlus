import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  FloatButton,
  Form,
  Input,
  Modal,
  Space,
  Typography,
  message
} from 'antd'
import { KeyOutlined, ReloadOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { saveToken, getToken } from '../services/auth'

const TokenInput = ({ onTokenSet, onClose, error }) => {
  const [form] = Form.useForm()
  const storedToken = useMemo(() => getToken() || '', [])
  const [isModalOpen, setIsModalOpen] = useState(!storedToken)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (error) {
      setIsModalOpen(true)
    }
  }, [error])

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({ token: getToken() || '' })
    }
  }, [isModalOpen, form])

  const handleOpen = () => {
    setIsModalOpen(true)
  }

  const handleClose = () => {
    if (isSaving) return

    setIsModalOpen(false)
    form.resetFields()
    onClose?.()
  }

  const handleSave = async () => {
    try {
      const { token } = await form.validateFields()
      const trimmedToken = token.trim()
      if (!trimmedToken) {
        message.error('Vui lòng nhập token hợp lệ.')
        return
      }

      setIsSaving(true)
      saveToken(trimmedToken)
      message.success(error ? 'Token đã được cập nhật.' : 'Token đã được lưu thành công.')
      onTokenSet?.()
      handleClose()
    } catch (err) {
      if (!err?.errorFields) {
        const errorMessage = err?.message || 'Không thể lưu token. Vui lòng thử lại.'
        message.error(errorMessage)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = () => {
    saveToken('')
    form.setFieldsValue({ token: '' })
    message.success('Đã xoá token.')
    setIsModalOpen(true)
    onTokenSet?.()
  }

  const showFloatButton = !error && !isModalOpen && !!getToken()

  return (
    <>
      {showFloatButton && (
        <FloatButton
          tooltip="Cập nhật API Token"
          icon={<KeyOutlined />}
          onClick={handleOpen}
          style={{ right: 24, top: 96 }}
        />
      )}

      <Modal
        open={isModalOpen}
        onCancel={handleClose}
        title={error ? 'Token không hợp lệ' : 'Thiết lập API Token'}
        okText={isSaving ? 'Đang lưu...' : 'Lưu token'}
        cancelText="Huỷ"
        onOk={handleSave}
        confirmLoading={isSaving}
        centered
        destroyOnClose
        width={520}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {error ? (
            <Alert
              type="error"
              showIcon
              message={error}
              description="Vui lòng nhập token mới từ máy chủ API để tiếp tục."
            />
          ) : (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Vui lòng nhập token từ máy chủ API để đồng bộ dữ liệu khóa học.
            </Typography.Paragraph>
          )}

          <Form
            form={form}
            layout="vertical"
            initialValues={{ token: storedToken }}
            disabled={isSaving}
          >
            <Form.Item
              label="API Token"
              name="token"
              rules={[{ required: true, message: 'Token không được để trống' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập API token của bạn"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          </Form>

          <Space
            size="middle"
            wrap
            style={{ width: '100%', justifyContent: 'flex-end' }}
          >
            <Button
              icon={<CloseOutlined />}
              onClick={handleClose}
              disabled={isSaving}
            >
              Đóng
            </Button>
            <Button
              danger
              icon={<ReloadOutlined />}
              onClick={handleClear}
              disabled={isSaving || !getToken()}
            >
              Xoá token
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={isSaving}
              onClick={handleSave}
            >
              Lưu token
            </Button>
          </Space>

          <Typography.Paragraph type="secondary" style={{ fontSize: '0.9rem', marginBottom: 0 }}>
            Token thường có dạng chuỗi JWT hoặc Bearer. Sao chép chính xác từ hệ thống quản trị để đảm bảo kết nối thành công.
          </Typography.Paragraph>
        </Space>
      </Modal>
    </>
  )
}

export default TokenInput
