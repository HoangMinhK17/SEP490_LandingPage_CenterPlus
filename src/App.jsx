import React, { useState } from 'react'
import { Layout, FloatButton } from 'antd'
import { PhoneFilled } from '@ant-design/icons'
import './index.css'
import Hero from './components/Hero'
import Features from './components/Features'
import CourseInfo from './components/CourseInfo'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'
import LeadModal from './components/LeadModal'

const { Content } = Layout

function App() {
  const [status] = useState('active')
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [leadModalDefaults, setLeadModalDefaults] = useState({
    branchId: '',
    branchName: '',
    courseId: '',
    courseName: '',
    gradeCode: '',
    subjectId: '',
    subjectName: ''
  })

  const handleOpenLeadModal = (config = {}) => {
    setLeadModalDefaults({
      branchId: config.branchId || '',
      branchName: config.branchName || '',
      courseId: config.courseId || '',
      courseName: config.courseName || '',
      gradeCode: config.gradeCode || '',
      subjectId: config.subjectId || '',
      subjectName: config.subjectName || ''
    })
    setIsLeadModalOpen(true)
  }

  const handleCloseLeadModal = () => {
    setIsLeadModalOpen(false)
  }

  return (
    <Layout className="landing-layout">
      <Content>
        <Hero onRegisterClick={() => handleOpenLeadModal()} />
        <Features />
        <CourseInfo onRegisterCourse={handleOpenLeadModal} />
        <Testimonials />
        <CTA status={status} onRegisterClick={handleOpenLeadModal} />
      </Content>
      <Footer />
      <FloatButton.BackTop visibilityHeight={400} />
      <FloatButton
        icon={<PhoneFilled />}
        tooltip="Liên hệ tư vấn"
        onClick={() => window.open('tel:19001234')}
      />
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={handleCloseLeadModal}
        onSuccess={() => null}
        defaultBranchId={leadModalDefaults.branchId}
        defaultBranchName={leadModalDefaults.branchName}
        defaultCourseId={leadModalDefaults.courseId}
        defaultCourseName={leadModalDefaults.courseName}
        defaultGradeCode={leadModalDefaults.gradeCode}
        defaultSubjectId={leadModalDefaults.subjectId}
        defaultSubjectName={leadModalDefaults.subjectName}
      />
    </Layout>
  )
}

export default App
