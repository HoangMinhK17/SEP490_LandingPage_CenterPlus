import React from 'react'
import { Typography, Row, Col, Card, Space } from 'antd'
import {
  TeamOutlined,
  ReadOutlined,
  AimOutlined,
  BarChartOutlined,
  TrophyOutlined,
  MessageOutlined
} from '@ant-design/icons'

const features = [
  {
    icon: <TeamOutlined />,
    title: 'Giáo viên nhiều kinh nghiệm',
    description: 'Giảng viên xuất sắc, chuyên môn cao, tận tâm đồng hành cùng từng học viên.'
  },
  {
    icon: <ReadOutlined />,
    title: 'Giáo trình cập nhật',
    description: 'Nội dung bám sát chương trình chính khóa và đề thi thật, cập nhật liên tục.'
  },
  {
    icon: <AimOutlined />,
    title: 'Lộ trình cá nhân hoá',
    description: 'Thiết kế giáo án phù hợp với năng lực, mục tiêu để học viên tiến bộ bền vững.'
  },
  {
    icon: <BarChartOutlined />,
    title: 'Theo dõi sát sao',
    description: 'Báo cáo kết quả hàng tuần, điều chỉnh phương pháp ngay khi có dấu hiệu chững lại.'
  },
  {
    icon: <TrophyOutlined />,
    title: 'Luyện thi chuyên sâu',
    description: 'Bộ đề chuẩn, chiến lược làm bài tối ưu cho mọi kỳ thi quan trọng.'
  },
  {
    icon: <MessageOutlined />,
    title: 'Hỗ trợ đa kênh 24/7',
    description: 'Giải đáp nhanh chóng qua Zalo, Facebook, hotline – bất cứ khi nào bạn cần.'
  }
]

const Features = () => {
  return (
    <section className="page-section features-section">
      <div className="section-container">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="section-heading">
            <Typography.Title level={2}>
              Tại sao phụ huynh lựa chọn CenterPlus?
            </Typography.Title>
            <Typography.Paragraph type="secondary">
              Trải nghiệm học tập toàn diện với đội ngũ giáo viên tận tâm, nội dung hiện đại và hệ thống đánh giá liên tục.
            </Typography.Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature) => (
              <Col xs={24} sm={12} md={8} key={feature.title}>
                <Card bordered={false} className="feature-card">
                  <Space direction="vertical" size="middle">
                    <div className="feature-icon-wrapper">
                      {feature.icon}
                    </div>
                    <Typography.Title level={4} className="feature-title">
                      {feature.title}
                    </Typography.Title>
                    <Typography.Paragraph type="secondary">
                      {feature.description}
                    </Typography.Paragraph>
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

export default Features
