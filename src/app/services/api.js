/**
 * API CONFIGURATION
 * The base URL for all backend communication.
 * Make sure your Laravel server is running on this port (e.g., php artisan serve --port=8001)
 */
const BASE_URL = 'http://localhost:8001';
const API_URL = `${BASE_URL}/api`;

export { BASE_URL, API_URL };

/**
 * CORE FETCH WRAPPER
 * A private utility to handle all HTTP requests consistently.
 * 
 * @param {string} endpoint - The API path (e.g., '/users')
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} - The parsed JSON response
 * @throws {Error} - If the response is not OK or network fails
 */
const callApi = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Handle HTTP errors (4xx, 5xx)
    if (!response.ok) {
      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMsg += ` - ${errorData.error}`;
        } else if (errorData && errorData.message) {
          errorMsg += ` - ${errorData.message}`;
        }
      } catch (e) {
        // Fallback if body is not JSON
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
};

/**
 * API MANAGER
 * Use this object throughout the React app to interact with the Laravel backend.
 */
export const ApiManager = {
  
  /**
   * Health check to verify the connection between React and Laravel.
   * @returns {Promise<{message: string}>}
   */
  testConnection: () => callApi('/test'),

  /* ========================================================================
     USER MANAGEMENT
     ======================================================================== */

  /**
   * Fetch all registered users from the database.
   * @returns {Promise<Array>}
   */
  getUsers: () => callApi('/users'),

  /**
   * Fetch details for a specific user.
   * @param {number|string} id - The User ID
   * @returns {Promise<Object>}
   */
  getUser: (id) => callApi(`/users/${id}`),

  /**
   * Register a new user in the system.
   * @param {Object} data - User details {name, email, password, etc.}
   */
  createUser: (data) => callApi('/users', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),

  /**
   * Update an existing user's information.
   * @param {number|string} id - The User ID
   * @param {Object} data - Fields to update
   */
  updateUser: (id, data) => callApi(`/users/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),

  /**
   * Remove a user from the system.
   * @param {number|string} id - The User ID
   */
  deleteUser: (id) => callApi(`/users/${id}`, { 
    method: 'DELETE' 
  }),

  /* ========================================================================
     DASHBOARD & ANALYTICS
     ======================================================================== */

  /**
   * Fetch statistics for the dashboard cards.
   * @returns {Promise<Object>}
   */
  getDashboardStats: () => callApi('/dashboard-stats'),

  /* ========================================================================
     STORE MANAGEMENT
     ======================================================================== */

  getStores: () => callApi('/stores'),
  
  createStore: (data) => callApi('/stores', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  updateStore: (id, data) => callApi(`/stores/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  deleteStore: (id) => callApi(`/stores/${id}`, { 
    method: 'DELETE' 
  }),

  /* ========================================================================
     COMPANY MANAGEMENT
     ======================================================================== */

  getCompanies: () => callApi('/companies'),
  getCompany: (id) => callApi(`/companies/${id}`),
  
  createCompany: (data) => callApi('/companies', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  updateCompany: (id, data) => callApi(`/companies/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  deleteCompany: (id) => callApi(`/companies/${id}`, { 
    method: 'DELETE' 
  }),

  /* ========================================================================
     DEPARTMENT MANAGEMENT
     ======================================================================== */

  getDepartments: () => callApi('/departments'),
  getDepartment: (id) => callApi(`/departments/${id}`),
  
  createDepartment: (data) => callApi('/departments', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  updateDepartment: (id, data) => callApi(`/departments/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  deleteDepartment: (id) => callApi(`/departments/${id}`, { 
    method: 'DELETE' 
  }),

  /* ========================================================================
     DESIGNATION MANAGEMENT
     ======================================================================== */

  getDesignations: () => callApi('/designations'),
  getDesignation: (id) => callApi(`/designations/${id}`),
  
  createDesignation: (data) => callApi('/designations', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  updateDesignation: (id, data) => callApi(`/designations/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  deleteDesignation: (id) => callApi(`/designations/${id}`, { 
    method: 'DELETE' 
  }),

};

export default ApiManager;
