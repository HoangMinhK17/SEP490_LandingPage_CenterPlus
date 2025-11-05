// Authentication service to manage tokens

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * Save authentication token to localStorage
 * @param {string} token - The authentication token
 */
export const saveToken = (token) => {
  if (!token) {
    console.warn('Attempting to save empty token')
    return
  }
  
  // Clean token: trim and remove any invalid characters
  let cleanToken = String(token).trim()
  
  // Remove any non-printable characters that might cause issues
  cleanToken = cleanToken.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
  
  if (!cleanToken) {
    console.error('Token is empty after cleaning')
    throw new Error('Token không hợp lệ. Token không được để trống.')
  }
  
  localStorage.setItem(TOKEN_KEY, cleanToken)
}

/**
 * Get authentication token from localStorage
 * @returns {string|null} The authentication token or null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getToken()
}

/**
 * Save refresh token
 * @param {string} refreshToken - The refresh token
 */
export const saveRefreshToken = (refreshToken) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

/**
 * Get refresh token
 * @returns {string|null} The refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Login function - Call your login API and save token
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @returns {Promise<Object>} Login response
 */
export const login = async (username, password) => {
  // Use relative URL to go through Vite proxy, same as API calls
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
  // Adjust login endpoint - common formats:
  // /api/auth/login, /api/tenant/auth/login, /api/login, /auth/login
  // Default to /api/tenant/auth/login based on your API structure
  const loginEndpoint = `${API_BASE_URL}/tenant/auth/login` // Change this if your endpoint is different
  
  try {
    console.log('Attempting login at:', loginEndpoint)
    const response = await fetch(loginEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Đăng nhập thất bại')
    }

    const data = await response.json()
    console.log('Login response:', data)
    
    // Save tokens (adjust based on your API response structure)
    // Try different possible token field names
    const token = data.token || data.accessToken || data.access_token || 
                  (data.data && (data.data.token || data.data.accessToken)) ||
                  data.data?.token || data.data?.accessToken
    
    if (token) {
      saveToken(token)
      console.log('Token saved successfully')
    } else {
      console.warn('No token found in response. Response structure:', data)
    }
    
    // Save refresh token if available
    const refreshToken = data.refreshToken || data.refresh_token || 
                        (data.data && data.data.refreshToken) ||
                        data.data?.refreshToken
    if (refreshToken) {
      saveRefreshToken(refreshToken)
    }
    
    return data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Auto login using credentials from environment variables
 * This will automatically login when app starts if credentials are provided
 * @returns {Promise<boolean>} True if login successful, false otherwise
 */
export const autoLogin = async () => {
  // Check if already have token
  if (isAuthenticated()) {
    console.log('Token already exists, skipping auto login')
    return true
  }

  // Get credentials from environment variables
  const username = import.meta.env.VITE_API_USERNAME
  const password = import.meta.env.VITE_API_PASSWORD

  // If no credentials provided, skip auto login
  if (!username || !password) {
    console.log('No auto login credentials found in environment variables')
    return false
  }

  try {
    console.log('Attempting auto login...')
    await login(username, password)
    console.log('Auto login successful')
    return true
  } catch (error) {
    console.warn('Auto login failed:', error.message)
    return false
  }
}

/**
 * Logout function
 */
export const logout = () => {
  removeToken()
  // Redirect to login page if needed
  window.location.href = '/'
}
