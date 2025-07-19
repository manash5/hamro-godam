"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../../../components/Login/Navbar'
import Footer from '../../../components/Landing/Footer'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation';
import TokenManager from '@/utils/tokenManager';
import AuthGuard from '@/components/AuthGuard';

const page = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');
    try {
      // 1. Check if account exists
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const result = await res.json();
      console.log(result?.token);
      
      if (!result.exists) {
        setLoginError('Account does not exist or password is incorrect.');
        setIsLoading(false);
        return;
      }

      // Store token with expiration using TokenManager
      TokenManager.storeToken(result?.token, false);

      // You now have the user ID
      const userId = result.id;

      // 2. Call /api/send to send email
      const token = result?.token;
      await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: data.email }),
      });

      // Fetch user data and store in localStorage
      try {
        const userRes = await fetch(`/api/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.data) {
            localStorage.setItem('admin', userData.data.FirstName || 'User');
            localStorage.setItem('adminEmail', userData.data.email || 'user@example.com');
            // Clear employee data to avoid conflicts
            localStorage.removeItem('employee');
            localStorage.removeItem('employeeEmail');
          }
        }
      } catch (e) { /* ignore error, fallback to dashboard */ }

      // 3. Navigate to dashboard (optionally pass userId)
      router.push('/dashboard');
      // Or, if you want to fetch user details:
      // const userRes = await fetch(`/api/user/${userId}`);
      // const userData = await userRes.json();
    } catch (err) {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false} isEmployeeRoute={false}>
      <>
        <Navbar name='Register' hideButton={false} />
        <div className="min-h-[90vh] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <div className="bg-white  text-black shadow-xl p-8 transform transition-all duration-300 hover:shadow-3xl">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>

              {/* Login Form */}
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email.message}</span>
                  )}
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                  )}
                </div>

                {/* Error Message */}
                {loginError && (
                  <div className="text-red-500 text-center">{loginError}</div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => signIn('google')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 group hover:border-gray-400 hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 font-medium">Login with Google</span>
                </button>

                <button
                  onClick={() => signIn('facebook')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 group hover:border-gray-400 hover:shadow-md"
                >
                  <img className="w-8 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" src='/meta.png' alt="Meta" />
                  <span className="text-gray-700 font-medium">Login with Meta</span>
                </button>
              </div>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  onClick={() => alert('Register clicked!')}
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </AuthGuard>
  );
};

export default page;