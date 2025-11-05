import React, { useState } from 'react'
import { saveToken, getToken } from '../services/auth'

const TokenInput = ({ onTokenSet, onClose, error }) => {
  const [token, setToken] = useState(getToken() || '')
  const [isVisible, setIsVisible] = useState(!getToken())
  const [showInput, setShowInput] = useState(false)
  
  // Force show input if there's an error
  const shouldShowInput = error || !getToken() || showInput

  const handleSave = () => {
    if (!token || !token.trim()) {
      alert('Vui lòng nhập token!')
      return
    }
    
    try {
      saveToken(token.trim())
      setIsVisible(false)
      setShowInput(false)
      if (onTokenSet) {
        onTokenSet()
      }
      alert('Token đã được lưu thành công!')
    } catch (error) {
      alert(`Lỗi: ${error.message || 'Không thể lưu token. Vui lòng thử lại.'}`)
      console.error('Error saving token:', error)
    }
  }

  const handleClear = () => {
    saveToken('')
    setToken('')
    setShowInput(true)
  }

  // If there's an error, always show the input form (not the button)
  if (!shouldShowInput && !error) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        zIndex: 1000,
        background: '#f8f9fa',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={() => setShowInput(true)}
          className="btn btn-secondary"
          style={{ fontSize: '0.9rem', padding: '8px 15px' }}
        >
          Cập nhật Token
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999
        }}
        onClick={error ? undefined : (onClose || (() => setShowInput(false)))}
      />
      
      {/* Modal */}
      <div style={{ 
        position: 'fixed', 
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        minWidth: '400px',
        maxWidth: '500px',
        border: error ? '2px solid #f44336' : 'none'
      }}>
      <h3 style={{ 
        marginBottom: '15px', 
        fontSize: '1.2rem',
        color: error ? '#f44336' : '#333'
      }}>
        {error ? '⚠️ Token không hợp lệ' : 'Nhập API Token'}
      </h3>
      
      {error && (
        <div style={{
          padding: '12px',
          background: '#ffebee',
          borderRadius: '6px',
          marginBottom: '15px',
          border: '1px solid #f44336'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#c62828', margin: 0 }}>
            {error}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px', marginBottom: 0 }}>
            Vui lòng nhập token mới từ server API để tiếp tục.
          </p>
        </div>
      )}
      
      {!error && (
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
          Vui lòng nhập token từ server API để xem danh sách khóa học
        </p>
      )}
      
      <div className="form-group">
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '0.9rem',
          fontWeight: 'bold',
          color: '#333'
        }}>
          API Token:
        </label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Nhập API token của bạn"
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '0.95rem'
          }}
          autoFocus
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={handleSave}
          className="btn btn-primary"
          style={{ flex: 1, padding: '12px', fontSize: '1rem' }}
        >
          {error ? 'Cập nhật Token' : 'Lưu Token'}
        </button>
        {getToken() && !error && (
          <button 
            onClick={handleClear}
            className="btn btn-secondary"
            style={{ padding: '12px' }}
          >
            Xóa
          </button>
        )}
        {!error && onClose && (
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '12px' }}
          >
            Đóng
          </button>
        )}
      </div>
      
      <div style={{ 
        marginTop: '15px', 
        padding: '10px',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#666'
      }}>
        <strong>Hướng dẫn:</strong>
        <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
          <li>Lấy token từ API server của bạn</li>
          <li>Token thường có dạng: Bearer token hoặc JWT token</li>
          <li>Paste token vào ô trên và click "Lưu Token"</li>
        </ul>
      </div>
    </div>
    </>
  )
}

export default TokenInput
