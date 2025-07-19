"use client"
 import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, Eye, MoreHorizontal } from 'lucide-react';
import Sidebar from '@/components/employee/sidebar';
import AddOrderModal from '@/components/order/AddOrderModel';

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalOrders: 0, totalCustomers: 0, recentOrders: [] });
  const [search, setSearch] = useState("");

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/order', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setOrders(data.data);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats (total orders, total customers, recent orders)
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/order?stats=true', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setStats({
          totalOrders: data.totalOrders || 0,
          totalCustomers: data.totalCustomers || 0,
          recentOrders: data.recentOrders || [],
        });
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  // Add order handler
  const handleAddOrder = async (orderPayload) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        fetchOrders();
        fetchStats();
      } else {
        setError(data.error || 'Failed to add order');
      }
    } catch (err) {
      setError('Failed to add order');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by search
  const filteredOrders = orders.filter(order =>
    order.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex">
        <Sidebar/>
      <div className="min-w-7xl mx-auto mt-10 text-black overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 w-80 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => setShowAddModal(true)}
          >
            + Add Order
          </button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {loading && <div className="text-gray-600 mb-4">Loading...</div>}
        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.map((order, index) => (
              <div key={order._id || index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">{order._id?.slice(-6)}</span>
                  <span className="text-sm text-gray-600">{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">${order.totalAmount}</span>
                  <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Total customers</span>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Total orders</span>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">{stats.totalOrders}</span>
            </div>
          </div>
        </div>
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center`}>
                        <span className="text-white font-medium text-sm">
                          {order.customerName ? order.customerName.split(' ').map(n => n[0]).join('') : '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{order._id?.slice(-6)}</p>
                      <p className="text-sm text-gray-500">{order.productName?.join(', ')}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">${order.totalAmount}</p>
                      <p className="text-sm text-gray-500">{order.payment}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-900">{order.productQuantity?.reduce((a, b) => a + b, 0)}</span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing 1-3 of 247 customers
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-2 rounded-md text-sm ${
                currentPage === 1 ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`px-3 py-2 rounded-md text-sm ${
                currentPage === 2 ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`px-3 py-2 rounded-md text-sm ${
                currentPage === 3 ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              3
            </button>
          </div>
        </div>
        <AddOrderModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddOrder}
        />
      </div>
    </div>
  );
};

export default OrdersPage;