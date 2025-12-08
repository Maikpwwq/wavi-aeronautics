
/**
 * Service to handle authentication API requests.
 */
const authService = {
  /**
   * Defines the base API URL.
   * Adjust if running on different environments (e.g. process.env.NEXT_PUBLIC_API_URL).
   * Currently hardcoded to localhost:3000 based on previous code.
   */
  apiBaseUrl: 'http://localhost:3000/api',

  /**
   * Helper to handle fetch responses and errors.
   */
  async _handleResponse(response) {
    const data = await response.json()
    if (!response.ok) {
      // Create a consistent error object or throw
      console.error('Auth Service Error:', data)
      // Allow the caller to handle specific error codes inside data
    }
    return data
  },

  /**
   * Sign In request
   * @param {Object} credentials - { email, password }
   */
  async signIn(credentials) {
    const response = await fetch(`${this.apiBaseUrl}/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // matched from original code
      body: JSON.stringify(credentials),
      next: { revalidate: 60 }
    })
    return this._handleResponse(response)
  },

  /**
   * Sign Up request
   * @param {Object} userInfo - { email, password, firstName, lastName }
   */
  async signUp(userInfo) {
    const response = await fetch(`${this.apiBaseUrl}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo),
      next: { revalidate: 60 }
    })
    return this._handleResponse(response)
  }
}

export default authService
