import React, { useEffect, useState } from 'react'
import {
  Alert,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography,
  message,
  Spin,
  Tag
} from 'antd'
import { createLead, fetchBranches, fetchSubjects } from '../services/api'

const { Title, Text } = Typography

const gradeOptions = [
  { value: 'G6', label: 'Lớp 6' },
  { value: 'G7', label: 'Lớp 7' },
  { value: 'G8', label: 'Lớp 8' },
  { value: 'G9', label: 'Lớp 9' },
  { value: 'G10', label: 'Lớp 10' },
  { value: 'G11', label: 'Lớp 11' },
  { value: 'G12', label: 'Lớp 12' }
]

const LeadModal = ({
  isOpen,
  onClose,
  onSuccess,
  defaultBranchId = '',
  defaultBranchName = '',
  defaultCourseId = '',
  defaultCourseName = ''
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [branches, setBranches] = useState([])
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return

    form.resetFields()
    form.setFieldsValue({
      branchId: defaultBranchId || undefined,
      courseId: defaultCourseId || undefined,
      courseName: defaultCourseName || ''
    })
    setError(null)

    const loadData = async () => {
      try {
        setFetching(true)
        const [branchesResponse, subjectsResponse] = await Promise.all([
          fetchBranches().catch(() => []),
          fetchSubjects({ status: 'active', limit: 1000 }).catch(() => [])
        ])

        const normalizedBranches = Array.isArray(branchesResponse)
          ? branchesResponse
          : branchesResponse?.branches || branchesResponse?.data || branchesResponse?.results || []
        const normalizedSubjects = Array.isArray(subjectsResponse)
          ? subjectsResponse
          : subjectsResponse?.subjects || subjectsResponse?.data || subjectsResponse?.results || []

        setBranches(
          normalizedBranches.map((branch) => ({
            value: branch.id || branch._id,
            label: branch.name || branch.branchName || 'Chi nhánh'
          }))
        )
        setSubjects(
          normalizedSubjects.map((subject) => ({
            value: subject.id || subject._id,
            label: subject.name || subject.subjectName || 'Môn học'
          }))
        )
      } catch (err) {
        setError(err?.message || 'Không thể tải dữ liệu chi nhánh/ môn học.')
      } finally {
        setFetching(false)
      }
    }

    loadData()
  }, [isOpen, defaultBranchId, defaultCourseId, defaultCourseName, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      setError(null)

      const payload = {
        name: {
          firstName: values.firstName.trim(),
          middleName: values.middleName?.trim() || '',
          lastName: values.lastName.trim()
        },
        contact: {
          phone: values.phone.trim(),
          email: values.email.trim()
        },
        source: 'campaign',
        gradeCode: values.gradeCode,
        interestedSubjectIds: values.interestedSubjectIds || [],
        notes: values.notes?.trim() || '',
        branchId: values.branchId,
        courseId: defaultCourseId || null
      }

      await createLead(payload)
      message.success('Đăng ký tư vấn thành công. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.')
      onSuccess?.()
      onClose()
    } catch (err) {
      if (err?.errorFields) {
        setError('Vui lòng kiểm tra lại các trường thông tin bắt buộc.')
      } else {
        const errorMsg = err?.message || 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.'
        setError(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      onCancel={() => !loading && onClose()}
      onOk={handleSubmit}
      okText={loading ? 'Đang lưu...' : 'Lưu thông tin'}
      confirmLoading={loading}
      title="Đăng ký tư vấn khóa học"
      centered
      width={720}
      destroyOnClose
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {(defaultCourseName || defaultBranchName) && (
          <Space direction="vertical" className="selected-course-banner">
            <Title level={5} style={{ margin: 0 }}>
              Thông tin khóa học quan tâm
            </Title>
            <Space size="middle" wrap>
              {defaultCourseName && (
                <Tag color="blue">Khóa: {defaultCourseName}</Tag>
              )}
              {defaultBranchName && (
                <Tag color="purple">Chi nhánh: {defaultBranchName}</Tag>
              )}
            </Space>
          </Space>
        )}

        {error && <Alert type="error" message={error} showIcon />}

        {fetching ? (
          <Spin tip="Đang tải dữ liệu..." />
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              lastName: '',
              middleName: '',
              firstName: '',
              phone: '',
              email: '',
              branchId: defaultBranchId || undefined,
              gradeCode: undefined,
              interestedSubjectIds: [],
              notes: ''
            }}
          >
            <Form.Item
              label="Họ"
              name="lastName"
              rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
            >
              <Input placeholder="Nguyễn" />
            </Form.Item>

            <Form.Item label="Tên đệm" name="middleName">
              <Input placeholder="Văn" />
            </Form.Item>

            <Form.Item
              label="Tên"
              name="firstName"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input placeholder="An" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^\d{8,11}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input placeholder="0123456789" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
              label="Chi nhánh"
              name="branchId"
              rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}
            >
              <Select
                placeholder="Chọn chi nhánh bạn muốn học"
                options={branches}
                loading={fetching}
              />
            </Form.Item>

            <Form.Item
              label="Khối lớp"
              name="gradeCode"
              rules={[{ required: true, message: 'Vui lòng chọn khối lớp' }]}
            >
              <Select placeholder="Chọn khối lớp" options={gradeOptions} />
            </Form.Item>

            <Form.Item label="Môn học quan tâm" name="interestedSubjectIds">
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn tối đa 3 môn học"
                options={subjects}
                maxTagCount={3}
              />
            </Form.Item>

            <Form.Item label="Ghi chú thêm" name="notes">
              <Input.TextArea rows={4} placeholder="Yêu cầu riêng hoặc lịch học mong muốn..." />
            </Form.Item>
          </Form>
        )}

        <Text type="secondary">
          Thông tin được bảo mật bởi CenterPlus. Chúng tôi sẽ liên hệ trong vòng 24 giờ.
        </Text>
      </Space>
    </Modal>
  )
}

export default LeadModal

