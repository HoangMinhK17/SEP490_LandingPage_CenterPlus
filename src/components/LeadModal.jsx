import React, { useState, useEffect } from 'react'
import { createLead, fetchBranches, fetchSubjects } from '../services/api'

const LeadModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    middleName: '',
    firstName: '',
    phone: '',
    email: '',
    branchId: '',
    source: 'campaign', // Default to campaign
    gradeCode: '',
    interestedSubjectIds: [],
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [branches, setBranches] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loadingBranches, setLoadingBranches] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [grades, setGrades] = useState([
    { code: 'G6', label: 'Lớp 6' },
    { code: 'G7', label: 'Lớp 7' },
    { code: 'G8', label: 'Lớp 8' },
    { code: 'G9', label: 'Lớp 9' },
    { code: 'G10', label: 'Lớp 10' },
    { code: 'G11', label: 'Lớp 11' },
    { code: 'G12', label: 'Lớp 12' }
  ])
  const [sources] = useState([
    { value: 'walk_in', label: 'Walk-in' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'zalo', label: 'Zalo' },
    { value: 'referral', label: 'Giới thiệu' },
    { value: 'campaign', label: 'Chiến dịch' },
    { value: 'other', label: 'Khác' }
  ])

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        lastName: '',
        middleName: '',
        firstName: '',
        phone: '',
        email: '',
        branchId: '',
        source: 'campaign', // Default to campaign
        gradeCode: '',
        interestedSubjectIds: [],
        notes: ''
      })
      setError(null)
      
      // Fetch branches from API
      const loadBranches = async () => {
        try {
          setLoadingBranches(true)
          const branchesData = await fetchBranches()
          
          // Handle different response formats
          const branchesList = Array.isArray(branchesData) 
            ? branchesData 
            : branchesData.branches || branchesData.data || branchesData.results || []
          
          // Map branches to format { id, name }
          const formattedBranches = branchesList.map(branch => ({
            id: branch.id || branch._id,
            name: branch.name || branch.branchName || 'Chi nhánh'
          }))
          
          setBranches(formattedBranches)
        } catch (err) {
          console.error('Error loading branches:', err)
          // Don't show error to user, just log it
          // User can still proceed with default branch if needed
        } finally {
          setLoadingBranches(false)
        }
      }
      
      // Fetch subjects from API
      const loadSubjects = async () => {
        try {
          setLoadingSubjects(true)
          // Fetch all active subjects (with high limit to get all)
          const subjectsData = await fetchSubjects({ 
            status: 'active',
            limit: 1000 // Get all subjects
          })
          
          // Handle different response formats
          const subjectsList = Array.isArray(subjectsData) 
            ? subjectsData 
            : subjectsData.subjects || subjectsData.data || subjectsData.results || []
          
          // Map subjects to format { id, name }
          const formattedSubjects = subjectsList.map(subject => ({
            id: subject.id || subject._id,
            name: subject.name || subject.subjectName || 'Môn học'
          }))
          
          setSubjects(formattedSubjects)
        } catch (err) {
          console.error('Error loading subjects:', err)
          // Don't show error to user, just log it
          // User can still proceed without subjects if needed
        } finally {
          setLoadingSubjects(false)
        }
      }
      
      // Load both branches and subjects in parallel
      Promise.all([loadBranches(), loadSubjects()]).catch(err => {
        console.error('Error loading data:', err)
      })
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setError(null)
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
    setError(null)
  }

  const handleMultiSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
    setError(null)
  }

  const validateForm = () => {
    if (!formData.lastName.trim()) {
      setError('Vui lòng nhập họ')
      return false
    }
    if (!formData.firstName.trim()) {
      setError('Vui lòng nhập tên')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Vui lòng nhập số điện thoại')
      return false
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email')
      return false
    }
    if (!formData.branchId) {
      setError('Vui lòng chọn chi nhánh')
      return false
    }
    if (!formData.gradeCode) {
      setError('Vui lòng chọn khối học')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Transform form data to API format
      const leadData = {
        name: {
          firstName: formData.firstName.trim(),
          middleName: formData.middleName.trim() || '',
          lastName: formData.lastName.trim()
        },
        contact: {
          phone: formData.phone.trim(),
          email: formData.email.trim()
        },
        source: 'campaign', // Always set to campaign (hidden from user)
        gradeCode: formData.gradeCode,
        interestedSubjectIds: formData.interestedSubjectIds || [],
        notes: formData.notes.trim() || '',
        branchId: formData.branchId
      }

      await createLead(leadData)
      
      // Success
      if (onSuccess) {
        onSuccess()
      }
      onClose()
      
      // Reset form
      setFormData({
        lastName: '',
        middleName: '',
        firstName: '',
        phone: '',
        email: '',
        branchId: '',
        source: 'campaign', // Always default to campaign
        gradeCode: '',
        interestedSubjectIds: [],
        notes: ''
      })
    } catch (err) {
      const errorMsg = err.message || 'Có lỗi xảy ra khi tạo khách hàng. Vui lòng thử lại.'
      setError(errorMsg)
      console.error('Create lead error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal lead-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Đăng ký tư vấn khóa học</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="lead-form">
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label>
                * Họ <span className="required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Nguyễn"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Tên đệm</label>
              <input
                type="text"
                name="middleName"
                placeholder="Văn"
                value={formData.middleName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>
                * Tên <span className="required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="An"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-row">
            <div className="form-group">
              <label>
                * Số điện thoại <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="0123456789"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>
                * Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Branch */}
          <div className="form-row">
            <div className="form-group">
              <label>
                * Chi nhánh <span className="required">*</span>
              </label>
              <select
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                required
                disabled={loading || loadingBranches}
              >
                <option value="">{loadingBranches ? 'Đang tải...' : 'Chọn chi nhánh'}</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grade */}
          <div className="form-row">
            <div className="form-group">
              <label>
                * Khối học <span className="required">*</span>
              </label>
              <select
                name="gradeCode"
                value={formData.gradeCode}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Chọn khối</option>
                {grades.map((grade) => (
                  <option key={grade.code} value={grade.code}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject of Interest */}
          <div className="form-row">
            <div className="form-group">
              <label>Môn học quan tâm</label>
              <select
                name="interestedSubjectIds"
                multiple
                value={formData.interestedSubjectIds}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value)
                  handleMultiSelectChange('interestedSubjectIds', selected)
                }}
                disabled={loading || loadingSubjects}
                style={{ minHeight: '100px' }}
              >
                {loadingSubjects ? (
                  <option value="">Đang tải môn học...</option>
                ) : subjects.length === 0 ? (
                  <option value="">Không có môn học</option>
                ) : (
                  subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))
                )}
              </select>
              <small style={{ color: '#666', fontSize: '0.85rem' }}>
                Giữ Ctrl (hoặc Cmd trên Mac) để chọn nhiều môn học
              </small>
            </div>
          </div>

          {/* Notes */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Ghi chú</label>
              <textarea
                name="notes"
                placeholder="Nhập ghi chú về khách hàng..."
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                disabled={loading}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-success"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadModal

