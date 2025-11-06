import React, { useState, useEffect } from 'react'
import './index.css'
import Hero from './components/Hero'
import Features from './components/Features'
import CourseInfo from './components/CourseInfo'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  const [status, setStatus] = useState('active') // Default là 'active'

  // Có thể fetch status từ API nếu cần
  useEffect(() => {
    // Nếu cần lấy status từ API, có thể thêm logic ở đây
    // Ví dụ: fetchStatusFromAPI().then(setStatus)
  }, [])

  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <CourseInfo status={status} />
      <Testimonials />
      <CTA status={status} />
      <Footer />
    </div>
  )
}

export default App
