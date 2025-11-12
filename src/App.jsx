import React, { useState, useEffect } from 'react'
import './index.css'
import Hero from './components/Hero'
import Features from './components/Features'
import CourseInfo from './components/CourseInfo'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'
import LeadModal from './components/LeadModal'

function App() {
  const [status, setStatus] = useState('active') // Default là 'active'
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [leadModalDefaults, setLeadModalDefaults] = useState({
    branchId: '',
    branchName: '',
    courseId: '',
    courseName: ''
  })

  // Có thể fetch status từ API nếu cần
  useEffect(() => {
    // Nếu cần lấy status từ API, có thể thêm logic ở đây
    // Ví dụ: fetchStatusFromAPI().then(setStatus)
  }, [])

  const handleOpenLeadModal = (config = {}) => {
    setLeadModalDefaults({
      branchId: config.branchId || '',
      branchName: config.branchName || '',
      courseId: config.courseId || '',
      courseName: config.courseName || ''
    })
    setIsLeadModalOpen(true)
  }

  const handleCloseLeadModal = () => {
    setIsLeadModalOpen(false)
  }

  const handleLeadSuccess = () => {
    alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.')
  }

  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <CourseInfo
        status={status}
        onRegisterCourse={handleOpenLeadModal}
      />
      <Testimonials />
      <CTA
        status={status}
        onRegisterClick={handleOpenLeadModal}
      />
      <Footer />
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={handleCloseLeadModal}
        onSuccess={handleLeadSuccess}
        defaultBranchId={leadModalDefaults.branchId}
        defaultBranchName={leadModalDefaults.branchName}
        defaultCourseId={leadModalDefaults.courseId}
        defaultCourseName={leadModalDefaults.courseName}
      />
    </div>
  )
}

export default App
