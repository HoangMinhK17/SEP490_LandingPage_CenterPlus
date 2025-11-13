import React from 'react'
import { Avatar, Card, Col, Rate, Row, Space, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const testimonials = [
  {
    name: 'Nguyễn Văn Anh',
    role: 'Học sinh lớp 12',
    content:
      'Nhờ giáo trình bám sát đề thi và sự kèm cặp sát sao của giáo viên, điểm thi đại học môn Toán của em tăng từ 6 lên 8.5 chỉ trong 3 tháng.',
    rating: 5
  },
  {
    name: 'Trần Thu Hà',
    role: 'Phụ huynh học sinh lớp 10',
    content:
      'Con tôi từng sợ môn Vật Lý. Sau 1 học kỳ tại CenterPlus, con tự tin hơn, chủ động làm bài và đạt 9.0 trong kỳ thi gần nhất.',
    rating: 5
  },
  {
    name: 'Lê Quang Minh',
    role: 'Học sinh lớp 11',
    content:
      'Em thích nhất là hệ thống bài tập đa dạng và phần review cuối buổi. Em có thể hiểu ngay phần nào mình còn yếu để tập trung cải thiện.',
    rating: 5
  }
]

const Testimonials = () => {
  return (
    <section className="page-section testimonials-section">
      <div className="section-container">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="section-heading">
            <Typography.Title level={2}>
              Phụ huynh và học viên nói gì về CenterPlus?
            </Typography.Title>
            <Typography.Paragraph type="secondary">
              Sự tiến bộ rõ rệt của học viên là động lực lớn nhất khiến chúng tôi không ngừng đổi mới mỗi ngày.
            </Typography.Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {testimonials.map((testimonial) => (
              <Col xs={24} md={8} key={testimonial.name}>
                <Card bordered={false} className="testimonial-card">
                  <Space direction="vertical" size="middle">
                    <Rate disabled defaultValue={testimonial.rating} />
                    <Typography.Paragraph className="testimonial-content">
                      “{testimonial.content}”
                    </Typography.Paragraph>
                    <Space align="center">
                      <Avatar icon={<UserOutlined />} />
                      <Space direction="vertical" size={0}>
                        <Typography.Text strong>{testimonial.name}</Typography.Text>
                        <Typography.Text type="secondary">{testimonial.role}</Typography.Text>
                      </Space>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      </div>
    </section>
  )
}

export default Testimonials
