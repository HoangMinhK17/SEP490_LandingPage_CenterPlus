import React from 'react'

const Features = () => {
  const features = [
    {
      icon: '👨‍🏫',
      title: 'Giáo Viên Giàu Kinh Nghiệm',
      description: 'Đội ngũ giáo viên chuyên nghiệp, nhiều năm kinh nghiệm giảng dạy, tận tâm với học viên'
    },
    {
      icon: '📖',
      title: 'Chương Trình Học Chất Lượng',
      description: 'Giáo trình được biên soạn kỹ lưỡng, bám sát chương trình học và đề thi thực tế'
    },
    {
      icon: '🎯',
      title: 'Phương Pháp Học Hiệu Quả',
      description: 'Học từ cơ bản đến nâng cao, luyện tập bài tập đa dạng, củng cố kiến thức vững chắc'
    },
    {
      icon: '📊',
      title: 'Theo Dõi Tiến Độ Thường Xuyên',
      description: 'Đánh giá và báo cáo tiến độ học tập định kỳ, điều chỉnh phương pháp phù hợp với từng học viên'
    },
    {
      icon: '🏆',
      title: 'Luyện Thi Chuyên Sâu',
      description: 'Ôn luyện các kỳ thi quan trọng: thi học kỳ, thi tốt nghiệp, thi đại học với đề thi sát thực tế'
    },
    {
      icon: '💬',
      title: 'Hỗ Trợ 24/7',
      description: 'Giáo viên luôn sẵn sàng giải đáp thắc mắc, hỗ trợ học viên mọi lúc mọi nơi'
    }
  ]

  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Tại Sao Chọn Trung Tâm Chúng Tôi?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
