"use client"
import { useEffect } from 'react';
import TokenManager from '@/utils/tokenManager';

const TokenManagerInitializer = () => {
  useEffect(() => {
    // Initialize token management
    TokenManager.init();
    
    // Set up visibility change listener to check tokens when user returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        TokenManager.cleanupExpiredTokens();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set up focus listener to check tokens when window gains focus
    const handleFocus = () => {
      TokenManager.cleanupExpiredTokens();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default TokenManagerInitializer; 