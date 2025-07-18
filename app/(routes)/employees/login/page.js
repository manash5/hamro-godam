"use client"

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../../../../components/Login/Navbar';
import TokenManager from '@/utils/tokenManager';
import AuthGuard from '@/components/AuthGuard';

const EmployeeLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setLoginError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setLoginError('');
    try {
      // Call the employee login API
      const res = await fetch('/api/employee/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const result = await res.json();
      
      if (res.ok) {
        // Store token with expiration using TokenManager
        TokenManager.storeToken(result.token, true);
        localStorage.setItem('employeeId', result.employeeId); // Store employeeId for My Task page
        
        // Fetch employee data and store in localStorage
        try {
          const empRes = await fetch(`/api/employee/${result.employeeId}`, {
            headers: { 'Authorization': `Bearer ${result.token}` }
          });
          if (empRes.ok) {
            const empData = await empRes.json();
            if (empData.data) {
              localStorage.setItem('employee', empData.data.name || 'User');
              localStorage.setItem('employeeEmail', empData.data.email || 'user@example.com');
              // Clear admin data to avoid conflicts
              localStorage.removeItem('admin');
              localStorage.removeItem('adminEmail');
            }
          }
        } catch (e) { /* ignore error, fallback to dashboard */ }
        
        window.location.href = '/employees/dashboard';
      } else {
        setLoginError(result.message || 'Login failed');
      }
    } catch (error) {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <AuthGuard requireAuth={false} isEmployeeRoute={true}>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar name="Register" hideButton={true} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-black">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back!</h1>
              <p className="text-gray-600">Employee Portal Login</p>
            </div>
            
            {/* Login Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email address"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="text-red-500 text-center">{loginError}</div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default EmployeeLoginPage;