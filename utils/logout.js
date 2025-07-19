// Logout Utility
// Handles proper logout and cleanup

import TokenManager from './tokenManager';

class LogoutManager {
  // Logout and redirect to appropriate login page
  static logout(isEmployee = false) {
    // Clear all tokens and user data
    TokenManager.clearAllTokens();
    
    // Redirect to appropriate login page
    const loginPath = isEmployee ? '/employees/login' : '/login';
    window.location.href = loginPath;
  }

  // Logout from current page (detects if employee or admin)
  static logoutFromCurrentPage() {
    // Detect if we're on an employee page
    const isEmployeePage = window.location.pathname.includes('/employees/');
    
    // Clear all tokens and user data
    TokenManager.clearAllTokens();
    
    // Redirect to appropriate login page
    const loginPath = isEmployeePage ? '/employees/login' : '/login';
    window.location.href = loginPath;
  }

  // Force logout (clears everything and redirects to main login)
  static forceLogout() {
    // Clear all tokens and user data
    TokenManager.clearAllTokens();
    
    // Redirect to main login page
    window.location.href = '/login';
  }

  // Logout with custom redirect
  static logoutWithRedirect(redirectPath) {
    // Clear all tokens and user data
    TokenManager.clearAllTokens();
    
    // Redirect to specified path
    window.location.href = redirectPath;
  }
}

export default LogoutManager; 