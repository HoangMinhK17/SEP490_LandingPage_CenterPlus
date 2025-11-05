import React from 'react'
import './index.css'
import Hero from './components/Hero'
import Features from './components/Features'
import CourseInfo from './components/CourseInfo'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <CourseInfo />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
