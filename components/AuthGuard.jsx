"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TokenManager from '@/utils/tokenManager';

const AuthGuard = ({ children, requireAuth = true, isEmployeeRoute = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      // Clean up expired tokens first
      TokenManager.cleanupExpiredTokens();
      
      // Check if token is valid
      const hasValidToken = TokenManager.isTokenValid(isEmployeeRoute);
      
      if (requireAuth && !hasValidToken) {
        // No valid token, redirect to login
        const loginPath = isEmployeeRoute ? '/employees/login' : '/login';
        router.push(loginPath);
        return;
      }
      
      if (!requireAuth && hasValidToken) {
        // User is authenticated but on a public page (like login), redirect to dashboard
        const dashboardPath = isEmployeeRoute ? '/employees/dashboard' : '/dashboard';
        router.push(dashboardPath);
        return;
      }
      
      setIsAuthenticated(hasValidToken);
      setIsLoading(false);
    };

    checkAuth();
    
    // Set up periodic auth check
    const authCheckInterval = setInterval(checkAuth, 30000); // Check every 30 seconds
    
    return () => clearInterval(authCheckInterval);
  }, [requireAuth, isEmployeeRoute, router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is not required or user is authenticated, render children
  if (!requireAuth || isAuthenticated) {
    return children;
  }

  // This should not be reached due to redirect, but just in case
  return null;
};

export default AuthGuard; 