import React, { useState } from 'react'

const CTA = ({ status = 'active' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const isActive = status === 'active'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isActive) {
      return
    }
    alert(`Cảm ơn ${formData.name}! Chúng tôi sẽ liên hệ với bạn sớm nhất qua email ${formData.email} hoặc số điện thoại ${formData.phone}`)
    setFormData({ name: '', email: '', phone: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Sẵn Sàng Bắt Đầu Hành Trình Của Bạn?</h2>
          <p className="cta-subtitle">
            Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt và tư vấn miễn phí về khóa học
          </p>
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Họ và tên *"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại *"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={!isActive}
              style={{
                opacity: isActive ? 1 : 0.6,
                cursor: isActive ? 'pointer' : 'not-allowed'
              }}
            >
              Đăng Ký Ngay - Nhận Ưu Đãi 30%
            </button>
          </form>
          <p className="cta-note">
            * Chúng tôi cam kết bảo mật thông tin của bạn
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTA

