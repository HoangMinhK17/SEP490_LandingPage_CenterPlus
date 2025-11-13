import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography
} from 'antd'
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  ReadOutlined,
  DollarCircleOutlined
} from '@ant-design/icons'
import { fetchCourses } from '../services/api'

const { Title, Paragraph, Text } = Typography
const { Search } = Input

const CourseInfo = ({ onRegisterCourse }) => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('all')

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        const data = await fetchCourses()
        const courseList = Array.isArray(data)
          ? data
          : data?.courses || data?.data || data?.results || []

        if (!courseList.length) {
          setError('Hiện chưa có dữ liệu khóa học. Vui lòng quay lại sau.')
        }
        setCourses(courseList)
      } catch (err) {
        setError(err?.message || 'Không thể tải danh sách khóa học')
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const getCourseTitle = (course) => course?.name || course?.title || course?.courseName || 'Khóa học'

  const getCourseId = (course) =>
    course?.id ||
    course?._id ||
    course?.courseId ||
    course?.course_id ||
    course?.slug ||
    ''

  const getCourseMode = (course) => {
    if (!course?.mode) return null
    const modeMap = {
      online: 'Trực tuyến',
      offline: 'Tại trung tâm',
      hybrid: 'Kết hợp',
      onsite: 'Tại trung tâm'
    }
    return modeMap[course.mode] || course.mode
  }

  const getCourseBranchInfo = (course) => {
    if (!course) return { id: '', name: '' }

    if (course.branch && typeof course.branch === 'object') {
      return {
        id: course.branch.id || course.branch._id || course.branch.branchId || course.branch.branch_id || course.branchId || '',
        name: course.branch.name || course.branch.branchName || course.branch.title || course.branch.label || ''
      }
    }

    if (Array.isArray(course.branches) && course.branches.length > 0) {
      const primaryBranch = course.branches[0]
      if (typeof primaryBranch === 'string') {
        return { id: course.branchId || '', name: primaryBranch }
      }
      if (primaryBranch && typeof primaryBranch === 'object') {
        return {
          id: primaryBranch.id || primaryBranch._id || primaryBranch.branchId || primaryBranch.branch_id || '',
          name: primaryBranch.name || primaryBranch.branchName || primaryBranch.title || ''
        }
      }
    }

    return {
      id: course.branchId || course.branch_id || course.branchID || '',
      name: typeof course.branch === 'string' ? course.branch : course.branchName || ''
    }
  }

  const getCourseTopics = (course) => {
    if (Array.isArray(course?.topics) && course.topics.length) return course.topics
    if (course?.description) return [course.description]
    if (course?.content) return Array.isArray(course.content) ? course.content : [course.content]
    return ['Nội dung khóa học đang được cập nhật']
  }

  const getPricesByMode = (course) => {
    const modeMap = {
      offline: 'Tại trung tâm',
      online: 'Trực tuyến',
      hybrid: 'Kết hợp'
    }
    const pricesByMode = []
    let generalPrice = null
    let currency = 'VND'
    const billingCycle = course?.tuitionPlanBillingCycle || 'once'
    let priceType = billingCycle === 'monthly' ? 'monthly' : 'session'

    if (course?.pricingOverride?.isOverridden) {
      const override = course.pricingOverride

      if (override.overriddenMonthlyPriceByMode) {
        Object.entries(override.overriddenMonthlyPriceByMode).forEach(([mode, info]) => {
          if (info?.amount) {
            pricesByMode.push({
              mode: modeMap[mode] || mode,
              amount: info.amount,
              currency: info.currency || override.overriddenPrice?.currency || 'VND',
              type: 'monthly',
              source: 'monthly'
            })
          }
        })
      }

      if (override.overriddenPerSessionPriceByMode) {
        Object.entries(override.overriddenPerSessionPriceByMode).forEach(([mode, info]) => {
          if (info?.amount) {
            const exists = pricesByMode.find((price) => price.mode === (modeMap[mode] || mode))
            if (!exists) {
              pricesByMode.push({
                mode: modeMap[mode] || mode,
                amount: info.amount,
                currency: info.currency || override.overriddenPrice?.currency || 'VND',
                type: 'session',
                source: 'perSession'
              })
            }
          }
        })
      }

      if (override.overriddenPrice?.amount) {
        generalPrice = {
          amount: override.overriddenPrice.amount,
          currency: override.overriddenPrice.currency || 'VND',
          source: 'pricingOverride'
        }
        currency = generalPrice.currency
      }
    }

    if (!pricesByMode.length && !generalPrice) {
      if (course?.tuitionPlanMonthlyPriceByMode) {
        Object.entries(course.tuitionPlanMonthlyPriceByMode).forEach(([mode, info]) => {
          if (info?.amount) {
            pricesByMode.push({
              mode: modeMap[mode] || mode,
              amount: info.amount,
              currency: info.currency || course.tuitionPrice?.currency || 'VND',
              type: 'monthly',
              source: 'monthly'
            })
          }
        })
      }

      if (course?.tuitionPlanPerSessionPriceByMode) {
        Object.entries(course.tuitionPlanPerSessionPriceByMode).forEach(([mode, info]) => {
          if (info?.amount) {
            const exists = pricesByMode.find((price) => price.mode === (modeMap[mode] || mode))
            if (!exists) {
              pricesByMode.push({
                mode: modeMap[mode] || mode,
                amount: info.amount,
                currency: info.currency || course.tuitionPrice?.currency || 'VND',
                type: 'session',
                source: 'perSession'
              })
            }
          }
        })
      }

      if (course?.tuitionPrice?.amount) {
        generalPrice = {
          amount: course.tuitionPrice.amount,
          currency: course.tuitionPrice.currency || 'VND',
          source: 'tuitionPrice'
        }
        currency = generalPrice.currency
      }
    }

    if (!pricesByMode.length && !generalPrice && course?.price) {
      if (typeof course.price === 'string') {
        return { type: 'string', value: course.price }
      }
      generalPrice = {
        amount: course.price,
        currency: course.priceUnit || course.currency || 'VND'
      }
    }

    return { pricesByMode, generalPrice, currency, priceType }
  }

  const formatPrice = (course) => {
    const priceInfo = getPricesByMode(course)
    if (priceInfo?.type === 'string') return priceInfo.value

    const { pricesByMode, generalPrice, currency, priceType } = priceInfo
    const currencyMap = { VND: 'VNĐ', USD: 'USD', vnd: 'VNĐ', usd: 'USD' }
    const displayCurrency = currencyMap[currency] || currency

    if (pricesByMode.length >= 2) {
      return {
        type: 'multi-mode',
        prices: pricesByMode.map((price) => {
          let label = ''
          if (price.source === 'perSession') label = '/buổi'
          if (price.source === 'monthly') label = '/tháng'
          if (!label) label = price.type === 'session' ? '/buổi' : '/tháng'

          return {
            mode: price.mode,
            formatted: `${new Intl.NumberFormat('vi-VN').format(price.amount)} ${currencyMap[price.currency] || price.currency}${label}`
          }
        })
      }
    }

    if (pricesByMode.length === 1) {
      const price = pricesByMode[0]
      let label = ''
      if (price.source === 'perSession') label = '/buổi'
      if (price.source === 'monthly') label = '/tháng'
      if (!label) label = price.type === 'session' ? '/buổi' : '/tháng'

      return `${new Intl.NumberFormat('vi-VN').format(price.amount)} ${currencyMap[price.currency] || price.currency}${label}`
    }

    if (generalPrice?.amount) {
      const label =
        generalPrice.source === 'tuitionPrice' || generalPrice.source === 'pricingOverride'
          ? ''
          : priceType === 'session'
            ? '/buổi'
            : (course.tuitionPlanBillingCycle === 'once' ? '' : '/tháng')

      return `${new Intl.NumberFormat('vi-VN').format(generalPrice.amount)} ${displayCurrency}${label}`
    }

    return 'Liên hệ'
  }

  const uniqueBranches = useMemo(() => {
    const set = new Set()
    courses.forEach((course) => {
      const { name } = getCourseBranchInfo(course)
      if (name) set.add(name)
    })
    return Array.from(set).sort()
  }, [courses])

  const filteredCourses = useMemo(() => {
    if (!courses.length) return []

    return courses.filter((course) => {
      const title = getCourseTitle(course).toLowerCase()
      const query = searchQuery.trim().toLowerCase()
      const branch = getCourseBranchInfo(course).name
      const topics = getCourseTopics(course).join(' ').toLowerCase()

      const matchesSearch = !query || title.includes(query) || topics.includes(query)
      const matchesBranch = selectedBranch === 'all' || branch === selectedBranch
      return matchesSearch && matchesBranch
    })
  }, [courses, searchQuery, selectedBranch])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedBranch('all')
  }

  const renderPrice = (course) => {
    const display = formatPrice(course)
    if (typeof display === 'string') {
      return <Text strong className="course-price">{display}</Text>
    }

    if (display?.type === 'multi-mode') {
      return (
        <Card size="small" type="inner" className="course-price-card" bordered={false}>
          <Space direction="vertical" size="small">
            <Text type="secondary">Học phí theo hình thức</Text>
            {display.prices.map((price) => (
              <Space key={price.mode} align="center" className="course-price-row">
                <Tag color="blue">{price.mode}</Tag>
                <Text strong>{price.formatted}</Text>
              </Space>
            ))}
          </Space>
        </Card>
      )
    }

    return null
  }

  return (
    <section className="page-section course-section" id="course-section">
      <div className="section-container">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="section-heading">
            <Title level={2}>Danh sách khóa học nổi bật</Title>
            <Paragraph type="secondary">
              Chọn khóa học phù hợp với mục tiêu và lịch học của bạn. Đội ngũ tư vấn sẽ hỗ trợ miễn phí để bạn lựa chọn lộ trình tối ưu.
            </Paragraph>
          </div>

          {error && <Alert type="warning" message={error} showIcon />}

          <Card bordered={false} className="course-filter-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Search
                  placeholder="Tìm theo tên khóa học hoặc nội dung"
                  allowClear
                  size="large"
                  prefix={<ReadOutlined />}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </Col>
              <Col xs={24} md={12}>
                <Select
                  size="large"
                  value={selectedBranch}
                  onChange={setSelectedBranch}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'all', label: `Tất cả chi nhánh (${courses.length})` },
                    ...uniqueBranches.map((branch) => ({
                      value: branch,
                      label: branch
                    }))
                  ]}
                />
              </Col>
            </Row>

            {(searchQuery || selectedBranch !== 'all') && (
              <Space
                style={{ marginTop: 16 }}
                wrap
                size="small"
                className="filter-summary"
              >
                <Text type="secondary">
                  Đang hiển thị {filteredCourses.length}/{courses.length} khóa học
                </Text>
                <Button size="small" onClick={handleResetFilters}>
                  Xoá bộ lọc
                </Button>
              </Space>
            )}
          </Card>

          {loading ? (
            <Spin tip="Đang tải khóa học..." />
          ) : !filteredCourses.length ? (
            <Card bordered={false}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không tìm thấy khóa học phù hợp"
              >
                <Button type="primary" onClick={handleResetFilters}>
                  Xoá toàn bộ bộ lọc
                </Button>
              </Empty>
            </Card>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredCourses.map((course) => {
                const status = course?.status === 'active'
                const priceDisplay = formatPrice(course)
                const branchInfo = getCourseBranchInfo(course)

                return (
                  <Col xs={24} md={12} key={getCourseId(course) || getCourseTitle(course)}>
                    <Card
                      bordered={false}
                      className="course-card"
                      title={
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <Text strong className="course-title">
                            {getCourseTitle(course)}
                          </Text>
                          <Space size="small" wrap>
                            <Tag color={status ? 'success' : 'red'}>
                              {status ? 'Đang tuyển sinh' : 'Tạm ngưng'}
                            </Tag>
                            {branchInfo.name && (
                              <Tag icon={<EnvironmentOutlined />} color="processing">
                                {branchInfo.name}
                              </Tag>
                            )}
                            {getCourseMode(course) && (
                              <Tag color="purple">{getCourseMode(course)}</Tag>
                            )}
                          </Space>
                        </Space>
                      }
                      extra={
                        typeof priceDisplay === 'string' ? (
                          <Space align="center">
                            <DollarCircleOutlined style={{ color: '#5b7bff' }} />
                            <Text strong>{priceDisplay}</Text>
                          </Space>
                        ) : null
                      }
                    >
                      {renderPrice(course)}

                      <Divider />
                      <Space direction="vertical" size="small" className="course-content">
                        {getCourseTopics(course).map((topic, index) => (
                          <Space key={index} align="start">
                            <CheckCircleOutlined style={{ color: '#52c41a', marginTop: 4 }} />
                            <Text>{topic}</Text>
                          </Space>
                        ))}
                      </Space>

                      <Divider />

                      <Button
                        type="primary"
                        block
                        size="large"
                        className="course-register-button"
                        disabled={!status}
                        onClick={() => {
                          if (!status) return
                          onRegisterCourse?.({
                            branchId: branchInfo.id || '',
                            branchName: branchInfo.name || '',
                            courseId: getCourseId(course),
                            courseName: getCourseTitle(course)
                          })
                        }}
                      >
                        Đăng ký tư vấn khóa học
                      </Button>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          )}

          <Card bordered={false} className="course-summary-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Space direction="vertical" size={4}>
                  <Text type="secondary">Thời lượng học</Text>
                  <Text strong>2 - 3 buổi mỗi tuần, 90 phút/buổi</Text>
                </Space>
              </Col>
              <Col xs={24} sm={8}>
                <Space direction="vertical" size={4}>
                  <Text type="secondary">Hình thức</Text>
                  <Text strong>Offline tại trung tâm hoặc Online linh hoạt</Text>
                </Space>
              </Col>
              <Col xs={24} sm={8}>
                <Space direction="vertical" size={4}>
                  <Text type="secondary">Ưu đãi hiện hành</Text>
                  <Text strong>Giảm 20% khi đăng ký nhóm hoặc từ 2 môn trở lên</Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </div>
    </section>
  )
}

export default CourseInfo
