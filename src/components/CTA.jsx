import React, { useState } from 'react'
import LeadModal from './LeadModal'

const CTA = ({ status = 'active' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isActive = status === 'active'

  const handleOpenModal = () => {
    if (isActive) {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSuccess = () => {
    alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.')
  }

  return (
    <>
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn Sàng Bắt Đầu Hành Trình Của Bạn?</h2>
            <p className="cta-subtitle">
              Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt và tư vấn miễn phí về khóa học
            </p>
            <div className="registration-form">
              <button 
                type="button" 
                className="btn btn-primary btn-large"
                onClick={handleOpenModal}
                disabled={!isActive}
                style={{
                  opacity: isActive ? 1 : 0.6,
                  cursor: isActive ? 'pointer' : 'not-allowed',
                  width: '100%',
                  padding: '15px',
                  fontSize: '1.1rem'
                }}
              >
                Đăng Ký Ngay - Nhận Ưu Đãi 30%
              </button>
            </div>
            <p className="cta-note">
              * Chúng tôi cam kết bảo mật thông tin của bạn
            </p>
          </div>
        </div>
      </section>
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </>
  )
}

export default CTA

