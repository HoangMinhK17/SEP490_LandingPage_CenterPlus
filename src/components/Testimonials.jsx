import React from 'react'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'Học sinh lớp 12',
      content: 'Nhờ học tại trung tâm, điểm thi đại học môn Toán của em tăng từ 6 lên 8.5. Giáo viên dạy rất dễ hiểu, nhiệt tình giải đáp mọi thắc mắc. Em rất cảm ơn thầy cô!',
      rating: 5
    },
    {
      name: 'Trần Thị B',
      role: 'Phụ huynh học sinh lớp 10',
      content: 'Con tôi học Vật Lý tại đây được 1 năm, từ chỗ sợ môn học giờ đã yêu thích và đạt điểm cao. Phương pháp dạy của giáo viên rất hiệu quả, con tiến bộ rõ rệt.',
      rating: 5
    },
    {
      name: 'Lê Văn C',
      role: 'Học sinh lớp 11',
      content: 'Em đã học Toán, Lý, Hóa tại trung tâm. Kiến thức được truyền đạt rõ ràng, bài tập đa dạng. Nhờ vậy em luôn đứng top đầu lớp và tự tin trong các kỳ thi.',
      rating: 5
    }
  ]

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">Học Viên Và Phụ Huynh Nói Gì?</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {'⭐'.repeat(testimonial.rating)}
              </div>
              <p className="testimonial-content">"{testimonial.content}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
