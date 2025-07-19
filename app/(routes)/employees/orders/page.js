"use client"
import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, Eye, MoreHorizontal } from 'lucide-react';
import Sidebar from '@/components/employee/sidebar';

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const orders = [
    {
      id: 1,
      customer: "John Smith",
      email: "john.smith@gmail.com",
      orderNumber: "#12047 LG-APL",
      orderId: "#12047",
      amount: "$2,450",
      status: "Active",
      statusColor: "bg-green-100 text-green-800",
      date: "Jan 15, 2024",
      quantity: 1,
      items: 8,
      avatar: "JS",
      avatarColor: "bg-blue-500"
    },
    {
      id: 2,
      customer: "Sarah Johnson",
      email: "sarah.j@gmail.com",
      orderNumber: "#12046 XL-BLK",
      orderId: "#12046",
      amount: "$600",
      status: "Active",
      statusColor: "bg-green-100 text-green-800",
      date: "Jan 14, 2024",
      quantity: 1,
      items: 4,
      avatar: "SJ",
      avatarColor: "bg-pink-500"
    },
    {
      id: 3,
      customer: "Michael Chen",
      email: "mchen@gmail.com",
      orderNumber: "#12045 MD-GRY",
      orderId: "#12045",
      amount: "$3,200",
      status: "VIP",
      statusColor: "bg-yellow-100 text-yellow-800",
      date: "Jan 13, 2024",
      quantity: 1,
      items: 12,
      avatar: "MC",
      avatarColor: "bg-orange-500"
    }
  ];

  const recentOrders = [
    {
      orderId: "#12047",
      customer: "John Smith",
      amount: "$245.00",
      status: "Today"
    },
    {
      orderId: "#12046",
      customer: "Sarah Johnson",
      amount: "$60.00",
      status: "Yesterday"
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
        <Sidebar/>
      <div className="min-w-7xl mx-auto mt-10 text-black">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 w-80 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                  <span className="text-sm text-gray-600">{order.customer}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">{order.amount}</span>
                  <span className="text-sm text-gray-500">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Total customers</span>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">247</span>
              <span className="text-sm text-green-600 mb-1">+3% this month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Total orders</span>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">1,429</span>
              <span className="text-sm text-green-600 mb-1">+8% last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Total revenue</span>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">$89,420</span>
              <span className="text-sm text-green-600 mb-1">+12% last month</span>
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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${order.avatarColor} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-medium text-sm">
                          {order.avatar}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{order.orderId}</p>
                      <p className="text-sm text-gray-500">{order.orderNumber}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{order.amount}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-900">{order.quantity}</span>
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
      </div>
    </div>
  );
};

export default OrdersPage;