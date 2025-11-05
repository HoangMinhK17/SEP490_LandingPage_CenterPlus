import { getToken } from './auth'

// API Configuration - Use relative URL to go through Vite proxy
// This avoids CORS issues. The proxy in vite.config.js forwards /api to http://localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/tenant'

// Log the API URL being used (for debugging)
console.log('API Base URL:', API_BASE_URL)

/**
 * Get headers with authentication token
 * Token can come from:
 * 1. localStorage (if user manually set it)
 * 2. Environment variable VITE_API_TOKEN
 * @returns {Headers} Headers object with auth token
 */
const getAuthHeaders = () => {
  // Try to get token from localStorage first, then from env variable
  let token = getToken() || import.meta.env.VITE_API_TOKEN
  
  // Create Headers object to properly handle encoding
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  
  if (token) {
    // Clean and validate token
    token = String(token).trim()
    
    // Remove any invalid characters and ensure it's a valid token string
    // Remove any non-printable characters but keep standard token characters
    token = token.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    
    // Only set Authorization if token is not empty after cleaning
    if (token) {
      try {
        headers.set('Authorization', `Bearer ${token}`)
      } catch (e) {
        console.error('Error setting Authorization header:', e)
        console.error('Token value:', token.substring(0, 20) + '...')
        throw new Error('Token không hợp lệ. Vui lòng kiểm tra lại token.')
      }
    } else {
      console.warn('Token is empty after cleaning')
    }
  } else {
    console.warn('No API token found. Please set token in localStorage or VITE_API_TOKEN environment variable.')
  }
  
  return headers
}

/**
 * Fetch all courses from the API
 * @returns {Promise<Array>} Array of course objects
 */
export const fetchCourses = async () => {
  const url = `${API_BASE_URL}/courses`
  const headers = getAuthHeaders()
  
  console.log('Fetching courses from:', url)
  // Convert Headers object to plain object for logging
  const headersObj = {}
  headers.forEach((value, key) => {
    // Mask token for security
    if (key.toLowerCase() === 'authorization') {
      headersObj[key] = value.substring(0, 20) + '...'
    } else {
      headersObj[key] = value
    }
  })
  console.log('Request headers:', headersObj)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      // Ensure proper encoding
      credentials: 'same-origin',
    })

    console.log('Response status:', response.status, response.statusText)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (response.status === 401 || response.status === 403) {
      const errorText = await response.text()
      console.error('Authentication failed:', errorText)
      throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng cập nhật token.')
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText || ''}`)
    }

    const data = await response.json()
    console.log('API Response data:', data)
    return data
  } catch (error) {
    // More detailed error logging
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('Network error - Cannot connect to API:', url)
      console.error('Possible causes:')
      console.error('1. API server is not running')
      console.error('2. API URL is incorrect')
      console.error('3. CORS issue - check server CORS settings')
      throw new Error(`Không thể kết nối đến API server. Vui lòng kiểm tra:
- Server API đã chạy chưa?
- URL API có đúng không? (${url})
- Có vấn đề CORS không?`)
    }
    
    console.error('Error fetching courses:', error)
    throw error
  }
}

/**
 * Fetch a single course by ID
 * @param {string|number} courseId - The course ID
 * @returns {Promise<Object>} Course object
 */
export const fetchCourseById = async (courseId) => {
  try {
    const url = `${API_BASE_URL}/courses/${courseId}`
    console.log('Fetching course from:', url)
    
    const headers = getAuthHeaders()
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'same-origin',
    })

    if (response.status === 401 || response.status === 403) {
      throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng cập nhật token.')
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText || ''}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching course:', error)
    throw error
  }
}
