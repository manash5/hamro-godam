"use client"
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, TrendingUp, AlertTriangle, Package, CreditCard, Settings, QrCode, Plus, BarChart3, Receipt, CheckCircle } from 'lucide-react';
import Sidebar from '@/components/employee/sidebar';
import TokenManager from '@/utils/tokenManager';
import AuthGuard from '@/components/AuthGuard';

const Dashboard = () => {
  const [userName, setUserName] = useState('User');

  // Get employee name from localStorage
  useEffect(() => {
    const updateUserName = () => {
      const name = localStorage.getItem('employee');
      if (name) {
        setUserName(name);
      }
    };

    // Update immediately
    updateUserName();

    // Also listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'employee') {
        setUserName(e.newValue || 'User');
      }
    };

    // Also check for user changes on focus
    const handleFocus = () => {
      const name = localStorage.getItem('employee');
      if (name && name !== userName) {
        setUserName(name);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userName]);

  return (
    <AuthGuard requireAuth={true} isEmployeeRoute={true}>
      <div className="h-screen bg-gray-50 flex">
        <Sidebar/>
        <div className="min-w-7xl mx-auto mt-10 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userName}!</h1>
            <p className="text-gray-600">Here's what's happening with your tasks today.</p>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Sales */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">$</span>
                  </div>
                </div>
                <span className="text-green-600 text-sm font-medium">+12%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900">$45,250</p>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-white rounded-sm"></div>
                  </div>
                </div>
                <span className="text-green-600 text-sm font-medium">+8%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">127</p>
            </div>

            {/* Low Stock */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-red-600 text-sm font-medium">-2</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Low Stock</p>
              <p className="text-3xl font-bold text-gray-900">14</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hot Products */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Hot Products</h3>
                  <p className="text-sm text-gray-500">Best selling items this week</p>
                </div>
                <div className="space-y-4">
                  {/* Nike Air Max 270 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">N</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Nike Air Max 270</p>
                        <p className="text-sm text-gray-500">45 units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$8,500</p>
                      <p className="text-sm text-green-600">+15%</p>
                    </div>
                  </div>

                  {/* Jordan Retro 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">J</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Jordan Retro 1</p>
                        <p className="text-sm text-gray-500">32 units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$12,800</p>
                      <p className="text-sm text-green-600">+22%</p>
                    </div>
                  </div>

                  {/* Adidas Ultraboost */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Adidas Ultraboost</p>
                        <p className="text-sm text-gray-500">28 units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$9,200</p>
                      <p className="text-sm text-green-600">+18%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Today's Tasks</h3>
                  <p className="text-sm text-gray-500">4 pending tasks</p>
                </div>
                <div className="space-y-4">
                  {/* Task 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <p className="text-gray-900">Restock Nike Air Max section</p>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">High</span>
                  </div>

                  {/* Task 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <p className="text-gray-900">Update product pricing</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Medium</span>
                  </div>

                  {/* Task 3 - Complete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-gray-900">Morning inventory check</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-500">Latest store activities</p>
                </div>
                <div className="space-y-4">
                  {/* Activity 1 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New order received</p>
                      <p className="text-xs text-gray-500">Order #12045 - Nike Air Max</p>
                    </div>
                    <p className="text-xs text-gray-400">2 min ago</p>
                  </div>

                  {/* Activity 2 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                      <p className="text-xs text-gray-500">Converse Chuck Taylor - 3 left</p>
                    </div>
                    <p className="text-xs text-gray-400">5 min ago</p>
                  </div>

                  {/* Activity 3 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Payment received</p>
                      <p className="text-xs text-gray-500">Order #12044 - $1,250</p>
                    </div>
                    <p className="text-xs text-gray-400">10 min ago</p>
                  </div>

                  {/* Activity 4 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New customer registered</p>
                      <p className="text-xs text-gray-500">John Doe - Premium member</p>
                    </div>
                    <p className="text-xs text-gray-400">15 min ago</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Plus className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Add Product</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <ShoppingCart className="w-6 h-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">New Order</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Reports</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <Settings className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;