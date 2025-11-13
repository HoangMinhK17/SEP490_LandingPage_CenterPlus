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
  const url = `${API_BASE_URL}/courses/public`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('API Response data:', data)
    return data
  } catch (error) {
    console.error('Error fetching courses:', error)

    // Lỗi fetch (network lỗi, server không chạy…)
    if (error.name === 'TypeError') {
      throw new Error(
        `Không thể kết nối API:
- Server chưa chạy
- URL sai: ${url}
- Lỗi mạng hoặc CORS`
      )
    }

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

/**
 * Fetch all subjects from the API
 * @param {Object} params - Query parameters { page, limit, search, status }
 * @returns {Promise<Array>} Array of subject objects
 */
export const fetchSubjects = async (params = {}) => {
  try {
    const url = `${API_BASE_URL}/subjects/public`
    console.log('Fetching subjects from:', url)
    
    const headers = getAuthHeaders()
    
    // Build query string
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    
    const queryString = queryParams.toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: headers,
      credentials: 'same-origin',
    })

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
    
    // Handle different response formats
    // API returns { success: true, data: [...], pagination: {...} } or directly array
    const subjectsData = Array.isArray(data) 
      ? data 
      : data.data || data.subjects || data.results || []
    
    return subjectsData
  } catch (error) {
    console.error('Error fetching subjects:', error)
    throw error
  }
}

/**
 * Fetch all branches from the API
 * @returns {Promise<Array>} Array of branch objects
 */
export const fetchBranches = async () => {
  try {
    const url = `${API_BASE_URL}/branches/public`
    console.log('Fetching branches from:', url)
    
    const headers = getAuthHeaders()
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'same-origin',
    })

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
    
    // Handle different response formats
    // API returns { success: true, data: [...] } or directly array
    const branchesData = Array.isArray(data) 
      ? data 
      : data.data || data.branches || data.results || []
    
    return branchesData
  } catch (error) {
    console.error('Error fetching branches:', error)
    throw error
  }
}

/**
 * Create a new lead
 * @param {Object} leadData - Lead data
 * @param {Object} leadData.name - Lead name {firstName, middleName, lastName}
 * @param {Object} leadData.contact - Contact info {phone, email}
 * @param {string} leadData.source - Lead source
 * @param {string} leadData.gradeCode - Grade code
 * @param {Array} leadData.interestedSubjectIds - Array of subject IDs
 * @param {string} leadData.notes - Additional notes
 * @param {string} leadData.branchId - Branch ID
 * @returns {Promise<Object>} Created lead data
 */
export const createLead = async (leadData) => {
  try {
    // Use /api/tenant/leads endpoint
    const url = '/api/tenant/leads/public'
    console.log('Creating lead at:', url)
    
    const headers = getAuthHeaders()
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      credentials: 'same-origin',
      body: JSON.stringify(leadData)
    })

    if (response.status === 401 || response.status === 403) {
      const errorText = await response.text()
      console.error('Authentication failed:', errorText)
      throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng cập nhật token.')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`
      console.error('API Error Response:', errorMessage)
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('Lead created successfully:', data)
    return data
  } catch (error) {
    console.error('Error creating lead:', error)
    throw error
  }
}
