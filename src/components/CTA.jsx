import React from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { GiftOutlined } from '@ant-design/icons'

const CTA = ({ status = 'active', onRegisterClick }) => {
  const isActive = status === 'active'

  return (
    <section className="cta-section" id="cta-section">
      <div className="section-container">
        <Card bordered={false} className="cta-card">
          <Space direction="vertical" size="large" style={{ width: '100%' }} align="center">
            <GiftOutlined className="cta-icon" />
            <Space direction="vertical" size="small" align="center">
              <Typography.Title level={2} style={{ textAlign: 'center', color: '#fff' }}>
                Đăng ký ngay – Nhận ưu đãi đến 30%
              </Typography.Title>
              <Typography.Paragraph style={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)' }}>
                Tư vấn lộ trình miễn phí, kiểm tra trình độ đầu vào và nhận lịch học phù hợp với bạn.
              </Typography.Paragraph>
            </Space>
            <Button
              type="primary"
              size="large"
              onClick={() => isActive && onRegisterClick?.()}
              disabled={!isActive}
            >
              Đặt lịch tư vấn miễn phí
            </Button>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)' }}>
              Thông tin của bạn được bảo mật tuyệt đối bởi CenterPlus.
            </Typography.Text>
          </Space>
        </Card>
      </div>
    </section>
  )
}

export default CTA

