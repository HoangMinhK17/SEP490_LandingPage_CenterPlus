import React, { useState, useEffect } from 'react'
import { fetchCourses } from '../services/api'


const CourseInfo = ({ onRegisterCourse }) => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // const [showTokenInput, setShowTokenInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('all')

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCourses()
      // Handle different API response formats
      // If API returns { courses: [...] } or { data: [...] } or directly array
      const coursesData = Array.isArray(data) 
        ? data 
        : data.courses || data.data || data.results || []
      
      console.log('Processed courses data:', coursesData)
      
      if (coursesData.length === 0) {
        console.warn('No courses found in API response, using default courses')
       
        setError('API không trả về dữ liệu khóa học. Đang hiển thị danh sách mặc định.')
      } else {
        setCourses(coursesData)
      }
    } catch (err) {
      console.error('Failed to load courses:', err)
      const errorMessage = err.message || 'Không thể tải danh sách khóa học'
      
      // If authentication error, always show token input (token might be expired)
      // if (errorMessage.includes('Token') || errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('hết hạn')) {
      //   setShowTokenInput(true)
      // }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      // Try auto login first
      // const autoLoginSuccess = await autoLogin()
      
      // // If auto login failed and no token exists, show token input
      // if (!autoLoginSuccess && !isAuthenticated()) {
      //   setShowTokenInput(true)
      // }
      
      // Load courses
      await loadCourses()
    }
    
    initialize()
  }, [])

  // const handleTokenSet = () => {
  //   // Hide token input and reload courses when token is set
  //   setShowTokenInput(false)
  //   setError(null) // Clear error when token is updated
  //   loadCourses()
  // }

  // const handleTokenInputClose = () => {
  //   // Only allow closing if there's no authentication error
  //   if (!error || (!error.includes('Token') && !error.includes('401') && !error.includes('403'))) {
  //     setShowTokenInput(false)
  //   }
  // }



  // Get course mode (e.g., "online", "offline", "hybrid")
  const getCourseMode = (course) => {
    if (course.mode) {
      // Map mode to Vietnamese
      const modeMap = {
        'online': 'Trực tuyến',
        'offline': 'Tại trung tâm',
        'hybrid': 'Kết hợp',
        'onsite': 'Tại trung tâm',
        'Trực tuyến': 'Trực tuyến',
        'Tại trung tâm': 'Tại trung tâm',
        'Kết hợp': 'Kết hợp'
      }
      return modeMap[course.mode] || course.mode
    }
    return null
  }

  // Get prices by mode from course data
  const getPricesByMode = (course) => {
    const modeMap = {
      'offline': 'Tại trung tâm',
      'online': 'Trực tuyến',
      'hybrid': 'Kết hợp'
    }
    const pricesByMode = []
    let generalPrice = null
    let currency = 'VND'
    let priceType = 'session' // 'session' or 'monthly'
    const billingCycle = course.tuitionPlanBillingCycle || 'once'

    // Determine price type based on billing cycle
    priceType = billingCycle === 'monthly' ? 'monthly' : 'session'

    // Check for pricing override first
    if (course.pricingOverride && course.pricingOverride.isOverridden) {
      const override = course.pricingOverride

      // Check mode-specific prices (monthly)
      if (override.overriddenMonthlyPriceByMode) {
        Object.keys(override.overriddenMonthlyPriceByMode).forEach(mode => {
          const modePrice = override.overriddenMonthlyPriceByMode[mode]
          if (modePrice && modePrice.amount) {
            pricesByMode.push({
              mode: modeMap[mode] || mode,
              amount: modePrice.amount,
              currency: modePrice.currency || override.overriddenPrice?.currency || 'VND',
              type: 'monthly',
              source: 'monthly'
            })
          }
        })
      }

      // Check mode-specific prices (session)
      if (override.overriddenPerSessionPriceByMode) {
        Object.keys(override.overriddenPerSessionPriceByMode).forEach(mode => {
          const modePrice = override.overriddenPerSessionPriceByMode[mode]
          if (modePrice && modePrice.amount) {
            // Only add if not already added from monthly
            const exists = pricesByMode.find(p => p.mode === (modeMap[mode] || mode))
            if (!exists) {
                          pricesByMode.push({
              mode: modeMap[mode] || mode,
              amount: modePrice.amount,
              currency: modePrice.currency || override.overriddenPrice?.currency || 'VND',
              type: 'session',
              source: 'perSession'
            })
            }
          }
        })
      }

      // Check general price override (từ pricingOverride, không có label)
      if (override.overriddenPrice && override.overriddenPrice.amount) {
        generalPrice = {
          amount: override.overriddenPrice.amount,
          currency: override.overriddenPrice.currency || 'VND',
          source: 'pricingOverride' // Đánh dấu nguồn từ pricingOverride
        }
        currency = generalPrice.currency
      }
    }

    // If no override prices, check tuitionPlan prices
    if (pricesByMode.length === 0 && !generalPrice) {
      // Check mode-specific monthly prices
      if (course.tuitionPlanMonthlyPriceByMode) {
        Object.keys(course.tuitionPlanMonthlyPriceByMode).forEach(mode => {
          const modePrice = course.tuitionPlanMonthlyPriceByMode[mode]
          if (modePrice && modePrice.amount) {
            pricesByMode.push({
              mode: modeMap[mode] || mode,
              amount: modePrice.amount,
              currency: modePrice.currency || course.tuitionPrice?.currency || 'VND',
              type: 'monthly',
              source: 'monthly' // Đánh dấu nguồn từ MonthlyPriceByMode
            })
          }
        })
      }

      // Check mode-specific session prices
      if (course.tuitionPlanPerSessionPriceByMode) {
        Object.keys(course.tuitionPlanPerSessionPriceByMode).forEach(mode => {
          const modePrice = course.tuitionPlanPerSessionPriceByMode[mode]
          if (modePrice && modePrice.amount) {
            // Only add if not already added from monthly
            const exists = pricesByMode.find(p => p.mode === (modeMap[mode] || mode))
            if (!exists) {
              pricesByMode.push({
                mode: modeMap[mode] || mode,
                amount: modePrice.amount,
                currency: modePrice.currency || course.tuitionPrice?.currency || 'VND',
                type: 'session',
                source: 'perSession' // Đánh dấu nguồn từ PerSessionPriceByMode
              })
            }
          }
        })
      }

      // Check general tuition price (không có label /buổi hay /tháng)
      if (course.tuitionPrice && course.tuitionPrice.amount) {
        generalPrice = {
          amount: course.tuitionPrice.amount,
          currency: course.tuitionPrice.currency || 'VND',
          source: 'tuitionPrice' // Đánh dấu nguồn từ tuitionPrice
        }
        currency = generalPrice.currency
      }
    }

    // Legacy support
    if (pricesByMode.length === 0 && !generalPrice && course.price) {
      if (typeof course.price === 'string') {
        return { type: 'string', value: course.price }
      }
      generalPrice = {
        amount: course.price,
        currency: course.priceUnit || course.currency || 'VND'
      }
    }

    return {
      pricesByMode,
      generalPrice,
      currency,
      priceType
    }
  }

  // Format price for display based on new schema structure
  const formatPrice = (course) => {
    const priceInfo = getPricesByMode(course)

    // If string price (legacy)
    if (priceInfo && priceInfo.type === 'string') {
      return priceInfo.value
    }

    const { pricesByMode, generalPrice, currency } = priceInfo

    // Format currency
    const currencyMap = {
      'VND': 'VNĐ',
      'USD': 'USD',
      'vnd': 'VNĐ',
      'usd': 'USD'
    }
    const displayCurrency = currencyMap[currency] || currency

    // If have prices for multiple modes (2+), show them separately
    if (pricesByMode.length >= 2) {
      return {
        type: 'multi-mode',
        prices: pricesByMode.map(p => {
          // Xác định label dựa trên source
          let label = ''
          if (p.source === 'perSession') {
            label = '/buổi'
          } else if (p.source === 'monthly') {
            label = '/tháng'
          }
          // Nếu không có source, dùng type làm fallback
          if (!label) {
            label = p.type === 'session' ? '/buổi' : '/tháng'
          }
          
          return {
            mode: p.mode,
            formatted: `${new Intl.NumberFormat('vi-VN').format(p.amount)} ${currencyMap[p.currency] || p.currency}${label}`
          }
        })
      }
    }

    // If have one mode price, show it
    if (pricesByMode.length === 1) {
      const p = pricesByMode[0]
      // Xác định label dựa trên source
      let label = ''
      if (p.source === 'perSession') {
        label = '/buổi'
      } else if (p.source === 'monthly') {
        label = '/tháng'
      }
      // Nếu không có source, dùng type làm fallback
      if (!label) {
        label = p.type === 'session' ? '/buổi' : '/tháng'
      }
      
      return `${new Intl.NumberFormat('vi-VN').format(p.amount)} ${currencyMap[p.currency] || p.currency}${label}`
    }

    // If have general price, check if it's from tuitionPrice or pricingOverride (không có label)
    if (generalPrice && generalPrice.amount) {
      // Nếu source là tuitionPrice hoặc pricingOverride, không hiển thị label
      const label = (generalPrice.source === 'tuitionPrice' || generalPrice.source === 'pricingOverride')
        ? '' 
        : (priceInfo.priceType === 'session' ? '/buổi' : (course.tuitionPlanBillingCycle === 'once' ? '' : '/tháng'))
      return `${new Intl.NumberFormat('vi-VN').format(generalPrice.amount)} ${displayCurrency}${label}`
    }

    // No price found
    return 'Liên hệ'
  }

  // Handle different course data structures from API
  const getCourseTitle = (course) => {
    return course.name || course.title || course.courseName || 'Khóa học'
  }

  // Get course branch
  const getCourseId = (course) => {
    if (!course) return ''
    return (
      course.id ||
      course._id ||
      course.courseId ||
      course.course_id ||
      course.slug ||
      ''
    )
  }

  const getCourseBranchInfo = (course) => {
    if (!course) {
      return { id: '', name: '' }
    }

    if (course.branch && typeof course.branch === 'object') {
      return {
        id:
          course.branch.id ||
          course.branch._id ||
          course.branch.branchId ||
          course.branch.branch_id ||
          course.branchId ||
          '',
        name:
          course.branch.name ||
          course.branch.branchName ||
          course.branch.title ||
          course.branch.label ||
          ''
      }
    }

    if (Array.isArray(course.branches) && course.branches.length > 0) {
      const primaryBranch = course.branches[0]
      if (typeof primaryBranch === 'string') {
        return { id: course.branchId || '', name: primaryBranch }
      }
      if (primaryBranch && typeof primaryBranch === 'object') {
        return {
          id:
            primaryBranch.id ||
            primaryBranch._id ||
            primaryBranch.branchId ||
            primaryBranch.branch_id ||
            '',
          name:
            primaryBranch.name ||
            primaryBranch.branchName ||
            primaryBranch.title ||
            ''
        }
      }
    }

    return {
      id:
        course.branchId ||
        course.branch_id ||
        course.branchID ||
        '',
      name:
        course.branchName ||
        (typeof course.branch === 'string' ? course.branch : '') ||
        ''
    }
  }

  const getCourseBranch = (course) => {
    const branchInfo = getCourseBranchInfo(course)
    return branchInfo.name || null
  }

  const getCourseTopics = (course) => {
    if (course.topics && Array.isArray(course.topics)) {
      return course.topics
    }
    if (course.description) {
      return [course.description]
    }
    if (course.content) {
      return Array.isArray(course.content) ? course.content : [course.content]
    }
    return ['Chi tiết khóa học sẽ được cập nhật']
  }

  // Get unique branches from courses
  const getUniqueBranches = () => {
    const branches = new Set()
    courses.forEach(course => {
      const branch = getCourseBranch(course)
      if (branch) {
        branches.add(branch)
      }
    })
    return Array.from(branches).sort()
  }

  // Filter courses based on search query and selected branch
  const getFilteredCourses = () => {
    return courses.filter(course => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        getCourseTitle(course).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCourseTopics(course).some(topic => 
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        )
      
      // Filter by branch
      const matchesBranch = selectedBranch === 'all' || 
        getCourseBranch(course) === selectedBranch
      
      return matchesSearch && matchesBranch
    })
  }

  const filteredCourses = getFilteredCourses()
  const uniqueBranches = getUniqueBranches()

  if (loading) {
    return (
      <>
        {/* {showTokenInput && (
          <TokenInput 
            onTokenSet={handleTokenSet}
            onClose={handleTokenInputClose}
            error={error && (error.includes('Token') || error.includes('401') || error.includes('403')) ? error : null}
          />
        )} */}
        <section className="course-info">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Các Khóa Học Tham Khảo</h2>
              <p className="section-subtitle">Khám phá các khóa học chất lượng cao được thiết kế đặc biệt cho bạn</p>
            </div>
            <div className="loading-container">
              <p>Đang tải danh sách khóa học...</p>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* {showTokenInput && (
        <TokenInput 
          onTokenSet={handleTokenSet}
          onClose={handleTokenInputClose}
          error={error && (error.includes('Token') || error.includes('401') || error.includes('403')) ? error : null}
        />
      )} */}
      <section className="course-info">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Các Khóa Học Tham Khảo</h2>
            <p className="section-subtitle">Khám phá các khóa học chất lượng cao được thiết kế đặc biệt cho bạn</p>
          </div>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          {/* Search and Filter Section */}
          <div className="course-filters">
            <div className="search-container">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Xóa tìm kiếm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {uniqueBranches.length > 0 && (
              <div className="branch-filter">
                <span className="filter-label">Chi nhánh:</span>
                <div className="branch-buttons">
                  <button
                    className={`branch-btn ${selectedBranch === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedBranch('all')}
                  >
                    Tất cả ({courses.length})
                  </button>
                  {uniqueBranches.map((branch, idx) => {
                    const count = courses.filter(c => getCourseBranch(c) === branch).length
                    return (
                      <button
                        key={idx}
                        className={`branch-btn ${selectedBranch === branch ? 'active' : ''}`}
                        onClick={() => setSelectedBranch(branch)}
                      >
                        {branch} ({count})
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            
            {filteredCourses.length !== courses.length && (
              <div className="filter-results-info">
                <span>
                  Hiển thị {filteredCourses.length} / {courses.length} khóa học
                </span>
                {(searchQuery || selectedBranch !== 'all') && (
                  <button
                    className="clear-filters-btn"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedBranch('all')
                    }}
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            )}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <h3>Không tìm thấy khóa học nào</h3>
              <p>Vui lòng thử lại với từ khóa khác hoặc chọn chi nhánh khác</p>
              <button
                className="btn-clear-all"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedBranch('all')
                }}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="modules-list">
              {filteredCourses.map((course, index) => {
              const priceDisplay = formatPrice(course)
              const isMultiModePrice = typeof priceDisplay === 'object' && priceDisplay.type === 'multi-mode'
              
              return (
                <div key={course.id || course._id || index} className="module-card">
                  <div className="course-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 className="module-title">{getCourseTitle(course)}</h3>
                      {course.status === 'active' ? (
                        <span style={{
                          padding: '4px 12px',
                          background: '#4caf50',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Đang triển khai 
                        </span>
                      )
                      : (
                        <span
                          style={{
                            padding: '4px 12px',
                            background: '#f44336',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Ngừng triển khai
                        </span>
                      )}
                    </div>
                    {!isMultiModePrice && (
                      <span className="course-price-small">{priceDisplay}</span>
                    )}
                  </div>
                  {isMultiModePrice && (
                    <div style={{ 
                      marginBottom: '15px',
                      padding: '10px',
                      background: '#f5f5f5',
                      borderRadius: '8px'
                    }}>
                      <div style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 'bold', 
                        marginBottom: '8px',
                        color: '#666'
                      }}>
                        Giá theo hình thức:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {priceDisplay.prices.map((priceItem, priceIndex) => (
                          <div key={priceIndex} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 10px',
                            background: 'white',
                            borderRadius: '4px'
                          }}>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>{priceItem.mode}:</span>
                            <span style={{ 
                              fontSize: '1rem', 
                              fontWeight: 'bold',
                              color: '#1976d2'
                            }}>
                              {priceItem.formatted}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="course-meta" style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    marginBottom: '15px',
                    flexWrap: 'wrap',
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    {getCourseMode(course) && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontWeight: 'bold' }}>Hình thức:</span>
                        <span style={{ 
                          padding: '4px 10px', 
                          background: '#e3f2fd', 
                          borderRadius: '4px',
                          color: '#1976d2'
                        }}>
                          {getCourseMode(course)}
                        </span>
                      </span>
                    )}
                    {getCourseBranch(course) && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontWeight: 'bold' }}>Chi nhánh:</span>
                        <span style={{ 
                          padding: '4px 10px', 
                          background: '#f3e5f5', 
                          borderRadius: '4px',
                          color: '#7b1fa2'
                        }}>
                          {getCourseBranch(course)}
                        </span>
                      </span>
                    )}
                  </div>
                  <ul className="module-topics">
                    {getCourseTopics(course).map((topic, topicIndex) => (
                      <li key={topicIndex}>{topic}</li>
                    ))}
                  </ul>
                  <div className="course-action">
                    <button 
                      className="btn-register-course"
                      disabled={course.status !== 'active'}
                      onClick={() => {
                        if (course.status !== 'active') {
                          return
                        }

                        if (typeof onRegisterCourse === 'function') {
                          const branchInfo = getCourseBranchInfo(course)
                          onRegisterCourse({
                            branchId: branchInfo.id || '',
                            branchName: branchInfo.name || '',
                            courseId: getCourseId(course),
                            courseName: getCourseTitle(course)
                          })
                          return
                        }

                        const ctaSection = document.querySelector('.cta')
                        if (ctaSection) {
                          ctaSection.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      style={{
                        opacity: course.status === 'active' ? 1 : 0.6,
                        cursor: course.status === 'active' ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <span className="btn-icon">📝</span>
                      Đăng Ký Ngay
                    </button>
                  </div>
                </div>
              )
            })}
            </div>
          )}
          <div className="course-details">
            <div className="detail-item">
              <span className="detail-label">Thời gian học:</span>
              <span className="detail-value">2-3 buổi/tuần, 90 phút/buổi</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hình thức:</span>
              <span className="detail-value">Học tại trung tâm hoặc online</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Lớp học:</span>
              <span className="detail-value">Tối đa 40 học viên/lớp</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Ưu đãi:</span>
              <span className="detail-value discount">Giảm 20% khi đăng ký 2 môn trở lên</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CourseInfo
