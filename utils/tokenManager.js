// Token Management Utility
// Handles token storage, expiration, cleanup, and authentication

const TOKEN_KEY = 'token';
const EMPLOYEE_TOKEN_KEY = 'employeeToken';
const ADMIN_KEY = 'admin';
const ADMIN_EMAIL_KEY = 'adminEmail';
const EMPLOYEE_KEY = 'employee';
const EMPLOYEE_EMAIL_KEY = 'employeeEmail';
const EMPLOYEE_ID_KEY = 'employeeId';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const EMPLOYEE_TOKEN_EXPIRY_KEY = 'employeeTokenExpiry';

// Token expiration time in milliseconds (1 hour)
const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour

// Keys to preserve (won't be cleared during cleanup)
const PRESERVED_KEYS = ['next-auth.session-token', 'next-auth.csrf-token', 'next-auth.callback-url'];

class TokenManager {
  // Store token with expiration timestamp
  static storeToken(token, isEmployee = false) {
    const tokenKey = isEmployee ? EMPLOYEE_TOKEN_KEY : TOKEN_KEY;
    const expiryKey = isEmployee ? EMPLOYEE_TOKEN_EXPIRY_KEY : TOKEN_EXPIRY_KEY;
    
    const expiryTime = Date.now() + TOKEN_EXPIRY_TIME;
    
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(expiryKey, expiryTime.toString());
    
    // Set up automatic cleanup
    this.scheduleCleanup(expiryTime);
  }

  // Get token if valid, null if expired
  static getToken(isEmployee = false) {
    const tokenKey = isEmployee ? EMPLOYEE_TOKEN_KEY : TOKEN_KEY;
    const expiryKey = isEmployee ? EMPLOYEE_TOKEN_EXPIRY_KEY : TOKEN_EXPIRY_KEY;
    
    const token = localStorage.getItem(tokenKey);
    const expiryTime = localStorage.getItem(expiryKey);
    
    if (!token || !expiryTime) {
      return null;
    }
    
    // Check if token is expired
    if (Date.now() > parseInt(expiryTime)) {
      this.clearToken(isEmployee);
      return null;
    }
    
    return token;
  }

  // Check if token exists and is valid
  static isTokenValid(isEmployee = false) {
    return this.getToken(isEmployee) !== null;
  }

  // Clear specific token
  static clearToken(isEmployee = false) {
    const tokenKey = isEmployee ? EMPLOYEE_TOKEN_KEY : TOKEN_KEY;
    const expiryKey = isEmployee ? EMPLOYEE_TOKEN_EXPIRY_KEY : TOKEN_EXPIRY_KEY;
    
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(expiryKey);
    
    if (isEmployee) {
      localStorage.removeItem(EMPLOYEE_ID_KEY);
    }
  }

  // Clear all tokens and user data (except preserved keys)
  static clearAllTokens() {
    const keysToRemove = [
      TOKEN_KEY,
      EMPLOYEE_TOKEN_KEY,
      ADMIN_KEY,
      ADMIN_EMAIL_KEY,
      EMPLOYEE_KEY,
      EMPLOYEE_EMAIL_KEY,
      EMPLOYEE_ID_KEY,
      TOKEN_EXPIRY_KEY,
      EMPLOYEE_TOKEN_EXPIRY_KEY
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Clean up expired tokens and user data
  static cleanupExpiredTokens() {
    const now = Date.now();
    
    // Check regular token
    const tokenExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (tokenExpiry && now > parseInt(tokenExpiry)) {
      this.clearToken(false);
    }
    
    // Check employee token
    const employeeTokenExpiry = localStorage.getItem(EMPLOYEE_TOKEN_EXPIRY_KEY);
    if (employeeTokenExpiry && now > parseInt(employeeTokenExpiry)) {
      this.clearToken(true);
    }
  }

  // Schedule cleanup at specific time
  static scheduleCleanup(expiryTime) {
    const timeUntilExpiry = expiryTime - Date.now();
    
    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        this.cleanupExpiredTokens();
        this.redirectToLogin();
      }, timeUntilExpiry);
    }
  }

  // Redirect to appropriate login page
  static redirectToLogin() {
    // Check if we're on an employee page
    const isEmployeePage = window.location.pathname.includes('/employees/');
    const loginPath = isEmployeePage ? '/employees/login' : '/login';
    
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      window.location.href = loginPath;
    }
  }

  // Initialize token management
  static init() {
    // Clean up any expired tokens on page load
    this.cleanupExpiredTokens();
    
    // Set up periodic cleanup check (every 5 minutes)
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 5 * 60 * 1000);
    
    // Set up beforeunload event to clear tokens if needed
    window.addEventListener('beforeunload', () => {
      // Optional: Clear tokens on page unload for security
      // this.clearAllTokens();
    });
  }

  // Get remaining time until token expires (in milliseconds)
  static getTokenExpiryTime(isEmployee = false) {
    const expiryKey = isEmployee ? EMPLOYEE_TOKEN_EXPIRY_KEY : TOKEN_EXPIRY_KEY;
    const expiryTime = localStorage.getItem(expiryKey);
    
    if (!expiryTime) return 0;
    
    const remaining = parseInt(expiryTime) - Date.now();
    return Math.max(0, remaining);
  }

  // Check if token will expire soon (within 5 minutes)
  static isTokenExpiringSoon(isEmployee = false) {
    const remainingTime = this.getTokenExpiryTime(isEmployee);
    return remainingTime > 0 && remainingTime < 5 * 60 * 1000; // 5 minutes
  }

  // Refresh token (call this when making API requests)
  static refreshTokenIfNeeded(isEmployee = false) {
    const token = this.getToken(isEmployee);
    if (token && this.isTokenExpiringSoon(isEmployee)) {
      // Token is expiring soon, you might want to refresh it here
      // For now, we'll just return the current token
      return token;
    }
    return token;
  }
}

// Initialize token management when this module is imported
if (typeof window !== 'undefined') {
  TokenManager.init();
}

export default TokenManager; 