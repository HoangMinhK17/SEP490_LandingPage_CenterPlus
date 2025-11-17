import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  Pagination,
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

const gradeLabelMap = {
  G6: 'Lớp 6',
  G7: 'Lớp 7',
  G8: 'Lớp 8',
  G9: 'Lớp 9',
  G10: 'Lớp 10',
  G11: 'Lớp 11',
  G12: 'Lớp 12'
}

const getGradeLabel = (code) => gradeLabelMap[code] || code || 'Khối'

const pageSize = 4

const CourseInfo = ({ onRegisterCourse }) => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

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

const getPriceHighlight = (course) => {
  const priceInfo = getPricesByMode(course)
  if (!priceInfo) return null

  const currencyMap = { VND: 'VNĐ', USD: 'USD', vnd: 'VNĐ', usd: 'USD' }
  const { pricesByMode, generalPrice, currency, priceType } = priceInfo
  const displayCurrency = currencyMap[currency] || currency || 'VNĐ'

  if (generalPrice?.amount) {
    const label =
      course?.tuitionPlanBillingCycle === 'once' || priceType === 'session'
        ? 'Học phí khóa học'
        : 'Học phí theo chu kỳ'
    let suffix = ''

    if (label !== 'Học phí khóa học') {
      suffix =
        priceType === 'monthly' || course?.tuitionPlanBillingCycle === 'monthly'
          ? '/tháng'
          : priceType === 'session'
            ? '/buổi'
            : ''
    }

    return {
      label,
      value: `${new Intl.NumberFormat('vi-VN').format(generalPrice.amount)} ${displayCurrency}${suffix}`
    }
  }

  if (priceInfo?.type === 'string') {
    return {
      label: 'Học phí',
      value: priceInfo.value
    }
  }

  if (pricesByMode?.length) {
    const primaryPrice = pricesByMode.reduce((selected, price) => {
      if (!selected) return price
      return price.amount < selected.amount ? price : selected
    }, null)

    if (primaryPrice) {
      const suffix = primaryPrice.source === 'monthly' ? '/tháng' : '/buổi'
      const prefix = pricesByMode.length > 1 ? 'Từ ' : ''
      return {
        label: 'Học phí theo buổi',
        value: `${prefix}${new Intl.NumberFormat('vi-VN').format(primaryPrice.amount)} ${
          currencyMap[primaryPrice.currency] || primaryPrice.currency || displayCurrency
        }${suffix}`
      }
    }
  }

  return null
}

  const uniqueBranches = useMemo(() => {
    const set = new Set()
    courses.forEach((course) => {
      const { name } = getCourseBranchInfo(course)
      if (name) set.add(name)
    })
    return Array.from(set).sort()
  }, [courses])

  const uniqueGrades = useMemo(() => {
    const set = new Set()
    courses.forEach((course) => {
      const code = getCourseGradeCode(course)
      if (code) set.add(code)
    })
    return Array.from(set)
      .sort()
      .map((code) => ({
        value: code,
        label: getGradeLabel(code)
      }))
  }, [courses])

  const filteredCourses = useMemo(() => {
    if (!courses.length) return []

    return courses.filter((course) => {
      const title = getCourseTitle(course).toLowerCase()
      const query = searchQuery.trim().toLowerCase()
      const branch = getCourseBranchInfo(course).name
      const topics = getCourseTopics(course).join(' ').toLowerCase()
      const gradeCode = getCourseGradeCode(course)

      const matchesSearch = !query || title.includes(query) || topics.includes(query)
      const matchesBranch = selectedBranch === 'all' || branch === selectedBranch
      const matchesGrade = selectedGrade === 'all' || gradeCode === selectedGrade
      return matchesSearch && matchesBranch && matchesGrade
    })
  }, [courses, searchQuery, selectedBranch, selectedGrade])

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredCourses.slice(startIndex, startIndex + pageSize)
  }, [filteredCourses, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedBranch, selectedGrade])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedBranch('all')
    setSelectedGrade('all')
    setCurrentPage(1)
  }

  const renderPrice = (course) => {
    const display = formatPrice(course)
    if (typeof display === 'string') {
      return null
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
              <Col xs={24} md={8}>
                <Search
                  placeholder="Tìm theo tên khóa học hoặc nội dung"
                  allowClear
                  size="large"
                  prefix={<ReadOutlined />}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </Col>
              <Col xs={24} md={8}>
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
              <Col xs={24} md={8}>
                <Select
                  size="large"
                  value={selectedGrade}
                  onChange={setSelectedGrade}
                  style={{ width: '100%' }}
                  placeholder="Chọn khối lớp"
                  options={[
                    { value: 'all', label: `Tất cả khối lớp (${courses.length})` },
                    ...uniqueGrades
                  ]}
                />
              </Col>
            </Row>

            {(searchQuery || selectedBranch !== 'all' || selectedGrade !== 'all') && (
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
            <>
              <Row gutter={[24, 24]}>
                {paginatedCourses.map((course) => {
                const status = course?.status === 'active'
                const priceDisplay = formatPrice(course)
                const priceHighlight = getPriceHighlight(course)
                const branchInfo = getCourseBranchInfo(course)
                const subjectInfo = getCourseSubjectInfo(course)
                const gradeCode = getCourseGradeCode(course)
                const gradeLabel = gradeCode ? getGradeLabel(gradeCode) : ''

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
                            {gradeLabel && <Tag color="cyan">{gradeLabel}</Tag>}
                            {subjectInfo.name && <Tag color="geekblue">{subjectInfo.name}</Tag>}
                          </Space>
                        </Space>
                      }
                      extra={
                        priceHighlight ? (
                          <div className="course-price-highlight">
                            <div className="course-price-highlight-icon">
                              <DollarCircleOutlined />
                            </div>
                            <Space direction="vertical" size={0} className="course-price-highlight-info">
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {priceHighlight.label}
                              </Text>
                              <Text strong>{priceHighlight.value}</Text>
                            </Space>
                          </div>
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
                            gradeCode: gradeCode || '',
                            subjectId: subjectInfo.id || '',
                            subjectName: subjectInfo.name || '',
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
              <div className="course-pagination">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredCourses.length}
                  showSizeChanger={false}
                  hideOnSinglePage={false}
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
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

const getCourseGradeCode = (course) =>
  course?.gradeCode ||
  course?.grade?.code ||
  course?.grade?.gradeCode ||
  course?.grade ||
  course?.grade_code ||
  ''

const getCourseSubjectInfo = (course) => {
  if (!course) return { id: '', name: '' }

  if (course.subjectId) {
    if (typeof course.subjectId === 'object') {
      return {
        id:
          course.subjectId.id ||
          course.subjectId._id ||
          course.subjectId.subjectId ||
          course.subjectId.subject_id ||
          '',
        name: course.subjectId.name || course.subjectId.subjectName || course.subjectName || ''
      }
    }

    return {
      id: course.subjectId,
      name: course.subjectName || course.subject || ''
    }
  }

  if (course.subject) {
    if (typeof course.subject === 'object') {
      return {
        id:
          course.subject.id ||
          course.subject._id ||
          course.subject.subjectId ||
          course.subject.subject_id ||
          course.subjectId ||
          '',
        name: course.subject.name || course.subject.subjectName || course.subjectName || ''
      }
    }

    return {
      id: course.subjectId || '',
      name: course.subject
    }
  }

  return { id: '', name: '' }
}

export default CourseInfo
