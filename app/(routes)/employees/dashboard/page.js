"use client"
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, TrendingUp, AlertTriangle, Package, CreditCard, Settings, QrCode, Plus, BarChart3, Receipt, CheckCircle } from 'lucide-react';
import Sidebar from '@/components/employee/sidebar';
import TokenManager from '@/utils/tokenManager';
import AuthGuard from '@/components/AuthGuard';

const Dashboard = () => {
  const [userName, setUserName] = useState('User');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentOrder, setRecentOrder] = useState(null);
  const [recentProduct, setRecentProduct] = useState(null);
  const [recentSupplier, setRecentSupplier] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  // Helper: get employeeId from token (decode JWT)
  const getEmployeeIdFromToken = () => {
    const token = TokenManager.getToken(false);
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.employeeId || payload.userId || payload.id || null;
    } catch {
      return null;
    }
  };

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

  // Fetch products and orders, then aggregate popular products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = TokenManager.getToken(false);
        if (!token) return;
        // Fetch products
        const prodRes = await fetch('/api/product', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const prodData = prodRes.ok ? (await prodRes.json()).data : [];
        setProducts(prodData);
        setRecentProduct(prodData[0] || null);
        // Fetch orders
        const orderRes = await fetch('/api/order', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const orderData = orderRes.ok ? (await orderRes.json()).data : [];
        setOrders(orderData);
        setRecentOrder(orderData[0] || null);
        // Fetch suppliers
        const supplierRes = await fetch('/api/supplier', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const supplierData = supplierRes.ok ? (await supplierRes.json()).data : [];
        setRecentSupplier(supplierData[0] || null);
        // --- Aggregations ---
        // Popular products (by total quantity ordered)
        const productOrderMap = {};
        orderData.forEach(order => {
          (order.productName || []).forEach((name, idx) => {
            const qty = order.productQuantity?.[idx] || 0;
            if (!productOrderMap[name]) productOrderMap[name] = 0;
            productOrderMap[name] += qty;
          });
        });
        const sortedPopular = Object.entries(productOrderMap)
          .sort((a, b) => b[1] - a[1])
          .map(([name, qty]) => {
            const prod = prodData.find(p => p.name === name) || {};
            return {
              name,
              qty,
              price: prod.price ? `₹${prod.price}` : '-',
              image: prod.image || '👟',
              color: prod.color || 'blue',
              rating: 4,
              sold: qty + 'x',
            };
          });
        setPopularProducts(sortedPopular);
        // Fetch tasks for this employee (use localStorage like My Task page)
        const employeeId = typeof window !== 'undefined' ? localStorage.getItem('employeeId') : null;
        if (employeeId && token) {
          const taskRes = await fetch(`/api/task?assignedTo=${employeeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const taskData = taskRes.ok ? (await taskRes.json()).data : [];
          setTasks(taskData);
        }
        // Fetch events for this user
        const eventRes = await fetch('/api/event', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const eventData = eventRes.ok ? (await eventRes.json()).data : [];
        setEventCount(eventData.length);
        // Calculate low stock products
        const lowStock = prodData.filter(p => p.stock < 5);
        setLowStockCount(lowStock.length);
      } catch (err) {
        // Handle error
      }
    };
    fetchData();
  }, []);

  // Helper to render stars for rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

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
            {/* Events */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                </div>
                <span className="text-blue-600 text-sm font-medium">Events</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Events</p>
              <p className="text-3xl font-bold text-gray-900">{eventCount}</p>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-white rounded-sm"></div>
                  </div>
                </div>
                <span className="text-green-600 text-sm font-medium">Orders</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            </div>

            {/* Low Stock */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-red-600 text-sm font-medium">Low Stock</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Low Stock</p>
              <p className="text-3xl font-bold text-gray-900">{lowStockCount}</p>
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
                  {popularProducts.length === 0 ? (
                    <div className="text-gray-500">No popular products yet.</div>
                  ) : (
                    popularProducts.slice(0, 3).map((product) => (
                      <div key={product.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{product.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.sold} sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{product.price}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Tasks</h3>
                  <p className="text-sm text-gray-500">{tasks.length} assigned tasks</p>
                </div>
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <div className="text-gray-500">No tasks assigned.</div>
                  ) : (
                    tasks.slice(0, 8).map((task) => (
                      <div key={task._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 border-2 rounded ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}></div>
                          <p className="text-gray-900">{task.title}</p>
                          <span className="text-xs text-gray-400">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{task.status === 'completed' ? 'Complete' : task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}</span>
                      </div>
                    ))
                  )}
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
                  {recentOrder && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New order received</p>
                        <p className="text-xs text-gray-500">Order #{recentOrder._id} - {recentOrder.productName?.[0]}</p>
                      </div>
                      <p className="text-xs text-gray-400">{recentOrder.createdAt ? new Date(recentOrder.createdAt).toLocaleString() : ''}</p>
                    </div>
                  )}
                  {recentProduct && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New product added</p>
                        <p className="text-xs text-gray-500">{recentProduct.name}</p>
                      </div>
                      <p className="text-xs text-gray-400">{recentProduct.createdAt ? new Date(recentProduct.createdAt).toLocaleString() : ''}</p>
                    </div>
                  )}
                  {recentSupplier && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New supplier registered</p>
                        <p className="text-xs text-gray-500">{recentSupplier.name}</p>
                      </div>
                      <p className="text-xs text-gray-400">{recentSupplier.createdAt ? new Date(recentSupplier.createdAt).toLocaleString() : ''}</p>
                    </div>
                  )}
                  {!recentOrder && !recentProduct && !recentSupplier && (
                    <div className="text-gray-500">No recent activity.</div>
                  )}
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