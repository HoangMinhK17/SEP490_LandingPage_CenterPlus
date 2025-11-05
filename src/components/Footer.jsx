import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Thông Tin Liên Hệ</h3>
            <p>📧 Email: CenterPlus@gmail.com</p>
            <p>📞 Hotline: 1900 1234</p>
            <p>📍 Địa chỉ: Đại học FPT ,Thạch Thất, Hà Nội</p>
          </div>
          <div className="footer-section">
            <h3>Giờ Làm Việc</h3>
            <p>Thứ 2 - Thứ 6: 17:00 - 20:30</p>
            <p>Thứ 7 - Chủ nhật: 8:00 - 12:00, 14:00 - 18:00</p>
          </div>
          <div className="footer-section">
            <h3>Theo Dõi Chúng Tôi</h3>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">YouTube</a>
              <a href="#" className="social-link">Zalo</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Trung Tâm Dạy Thêm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
