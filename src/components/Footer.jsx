import React from 'react'
import { Layout, Row, Col, Space, Typography, Divider } from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  MessageOutlined
} from '@ant-design/icons'

const { Footer: AntFooter } = Layout

const Footer = () => {
  return (
    <AntFooter className="footer">
      <div className="section-container">
        <Row gutter={[32, 24]}>
          <Col xs={24} md={10}>
            <Space direction="vertical" size="small">
              <Typography.Title level={4} style={{ color: '#fff' }}>
                CenterPlus
              </Typography.Title>
              <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.75)' }}>
                Trung tâm luyện thi & bồi dưỡng kiến thức chuẩn quốc gia. Hơn 10 năm đồng hành cùng học sinh đạt thành tích cao trong các kỳ thi quan trọng.
              </Typography.Paragraph>
            </Space>
          </Col>
          <Col xs={24} md={7}>
            <Space direction="vertical" size="small">
              <Typography.Title level={5} style={{ color: '#fff' }}>
                Liên hệ
              </Typography.Title>
              <Typography.Text style={{ color: 'rgba(255,255,255,0.75)' }}>
                <MailOutlined /> CenterPlus@gmail.com
              </Typography.Text>
              <Typography.Text style={{ color: 'rgba(255,255,255,0.75)' }}>
                <PhoneOutlined /> 1900 1234
              </Typography.Text>
              <Typography.Text style={{ color: 'rgba(255,255,255,0.75)' }}>
                <EnvironmentOutlined /> Đại học FPT, Hoà Lạc, Hà Nội
              </Typography.Text>
            </Space>
          </Col>
          <Col xs={24} md={7}>
            <Space direction="vertical" size="small">
              <Typography.Title level={5} style={{ color: '#fff' }}>
                Kênh kết nối
              </Typography.Title>
              <Space size="middle">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <FacebookOutlined className="footer-social-icon" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer">
                  <YoutubeOutlined className="footer-social-icon" />
                </a>
                <a href="https://zalo.me" target="_blank" rel="noreferrer">
                  <MessageOutlined className="footer-social-icon" />
                </a>
              </Space>
              <Typography.Text style={{ color: 'rgba(255,255,255,0.75)' }}>
                Giờ làm việc: 17:00 - 20:30 (Thứ 2 - Thứ 6) • 08:00 - 18:00 (Cuối tuần)
              </Typography.Text>
            </Space>
          </Col>
        </Row>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
        <Typography.Text style={{ color: 'rgba(255,255,255,0.55)' }}>
          © {new Date().getFullYear()} CenterPlus. Đã đăng ký bản quyền.
        </Typography.Text>
      </div>
    </AntFooter>
  )
}

export default Footer
