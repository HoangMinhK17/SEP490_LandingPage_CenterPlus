import React, { useState, useEffect } from 'react'

const Hero = () => {
  // Danh sách các hình ảnh về môn học/dạy học
  // Thêm các hình ảnh vào thư mục public và cập nhật đường dẫn ở đây
  const backgroundImages = [
    '/1.jpg', '/center.svg', '/3.jpg' // Hình ảnh hiện có
    // Thêm các hình ảnh khác vào đây, ví dụ:
    // '/hero-math.jpg',
    // '/hero-english.jpg',
    // '/hero-physics.jpg',
    // '/hero-teaching.jpg',
  ]

  // Nếu chỉ có 1 hình ảnh, thêm các gradient backup để có slideshow
  const allBackgrounds = backgroundImages.length > 1 
    ? backgroundImages 
    : [
        ...backgroundImages,
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Tự động chuyển đổi background mỗi 5 giây
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % allBackgrounds.length
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [allBackgrounds.length])

  const handleScrollToCourses = () => {
    const courseSection = document.querySelector('.course-info')
    if (courseSection) {
      courseSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToRegister = () => {
    const ctaSection = document.querySelector('.cta')
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero">
      {/* Background slideshow */}
      <div className="hero-background-container">
        {allBackgrounds.map((bg, index) => {
          const isImage = bg.startsWith('/') || bg.startsWith('http')
          return (
            <div
              key={index}
              className={`hero-background-slide ${index === currentIndex ? 'active' : ''}`}
              style={
                isImage
                  ? {
                      backgroundImage: `url(${bg})`,
                    }
                  : {
                      background: bg,
                    }
              }
            />
          )
        })}
      </div>
      
      {/* Overlay để chữ dễ đọc hơn */}
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
       
        <h1 className="hero-title">
          CenterPlus - Trung tâm dạy thêm
        </h1>
        <p className="hero-subtitle">
          Khám phá các khóa học chất lượng cao với đội ngũ giáo viên giàu kinh nghiệm. 
          Học tập hiệu quả, tiến bộ nhanh chóng, đạt kết quả cao trong học tập và thi cử.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleScrollToRegister}>
            Đăng Ký Ngay
          </button>
          <button className="btn btn-secondary" onClick={handleScrollToCourses}>
            Xem Các Khóa Học
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">5000+</span>
            <span className="stat-label">Học viên đã tham gia</span>
          </div>
          <div className="stat">
            <span className="stat-number">4.9/5</span>
            <span className="stat-label">Đánh giá trung bình</span>
          </div>
          <div className="stat">
            <span className="stat-number">98%</span>
            <span className="stat-label">Học viên đạt điểm cao</span>
          </div>
        </div>
      </div>
      
      {/* Dots indicator */}
      {allBackgrounds.length > 1 && (
        <div className="hero-slideshow-dots">
          {allBackgrounds.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Hero
