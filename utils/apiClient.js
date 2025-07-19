// API Client Utility
// Handles API calls with automatic token management

import TokenManager from './tokenManager';

class ApiClient {
  // Base API URL
  static baseURL = '/api';

  // Default headers
  static getDefaultHeaders(isEmployee = false) {
    const token = TokenManager.getToken(isEmployee);
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  // Generic request method
  static async request(endpoint, options = {}, isEmployee = false) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getDefaultHeaders(isEmployee);
    
    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle token expiration
      if (response.status === 401 || response.status === 403) {
        TokenManager.clearToken(isEmployee);
        TokenManager.redirectToLogin();
        throw new Error('Authentication failed. Please login again.');
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  static async get(endpoint, isEmployee = false) {
    return this.request(endpoint, { method: 'GET' }, isEmployee);
  }

  // POST request
  static async post(endpoint, data, isEmployee = false) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, isEmployee);
  }

  // PUT request
  static async put(endpoint, data, isEmployee = false) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, isEmployee);
  }

  // DELETE request
  static async delete(endpoint, isEmployee = false) {
    return this.request(endpoint, { method: 'DELETE' }, isEmployee);
  }

  // PATCH request
  static async patch(endpoint, data, isEmployee = false) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, isEmployee);
  }

  // Upload file
  static async upload(endpoint, formData, isEmployee = false) {
    const token = TokenManager.getToken(isEmployee);
    const headers = {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        TokenManager.clearToken(isEmployee);
        TokenManager.redirectToLogin();
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}

export default ApiClient; 