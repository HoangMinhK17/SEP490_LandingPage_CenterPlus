import React, { useMemo } from 'react'
import { Button, Typography, Row, Col, Card, Statistic, Space, Carousel } from 'antd'
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons'

const slideSources = ['/1.jpg', '/center.svg', '/3.jpg']

const stats = [
  { value: '5000+', label: 'Học viên đã tham gia' },
  { value: '4.9/5', label: 'Đánh giá trung bình' },
  { value: '98%', label: 'Học viên đạt điểm cao' }
]

const Hero = ({ onRegisterClick }) => {
  const slides = useMemo(() => {
    const base = import.meta.env.BASE_URL ?? '/'
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base

    return slideSources.map((path) => {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`
      if (!normalizedBase) return normalizedPath
      return `${normalizedBase}${normalizedPath}`
    })
  }, [])

  const handleScrollToCourses = () => {
    const courseSection = document.getElementById('course-section')
    if (courseSection) {
      courseSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleScrollToRegister = () => {
    if (typeof onRegisterClick === 'function') {
      onRegisterClick()
      return
    }

    const ctaSection = document.getElementById('cta-section')
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section className="hero-section">
      <div className="hero-background">
        <Carousel autoplay effect="fade" dots className="hero-carousel">
          {slides.map((slide, index) => (
            <div className="hero-slide" key={index}>
              <img className="hero-slide-image" src={slide} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Carousel>
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <Space direction="vertical" size="large">
          <Typography.Title level={1} className="hero-title">
            CenterPlus - Trung Tâm Luyện Thi & Bồi Dưỡng Kiến Thức
          </Typography.Title>
          <Typography.Paragraph className="hero-subtitle">
            Khám phá các khóa học chất lượng cao cùng đội ngũ giáo viên giàu kinh nghiệm. 
            Cá nhân hoá lộ trình học tập, theo sát tiến độ để bạn bứt phá trong mọi kỳ thi quan trọng.
          </Typography.Paragraph>

          <Space size="middle" wrap>
            <Button type="primary" size="large" icon={<ArrowRightOutlined />} onClick={handleScrollToRegister}>
              Đăng ký tư vấn miễn phí
            </Button>
            <Button size="large" ghost icon={<PlayCircleOutlined />} onClick={handleScrollToCourses}>
              Xem danh sách khóa học
            </Button>
          </Space>

          <Row gutter={[16, 16]}>
            {stats.map((stat) => (
              <Col xs={24} sm={8} key={stat.label}>
                <Card bordered={false} className="hero-stat-card">
                  <Statistic
                    title={stat.label}
                    value={stat.value}
                    valueStyle={{ color: '#ffffff', fontWeight: 600 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      </div>
    </section>
  )
}

export default Hero
