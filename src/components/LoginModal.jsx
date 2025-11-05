import React, { useState } from 'react'
import { login } from '../services/auth'

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(formData.username, formData.password)
      onLoginSuccess()
      onClose()
      setFormData({ username: '', password: '' })
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Đăng Nhập</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Vui lòng đăng nhập để xem danh sách khóa học
        </p>
        
        {error && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập hoặc Email *"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu *"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <button 
          className="btn btn-secondary" 
          onClick={onClose}
          style={{ marginTop: '10px', width: '100%' }}
          disabled={loading}
        >
          Hủy
        </button>
      </div>
    </div>
  )
}

export default LoginModal
