"use client"

import React, { useState } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import Sidebar from '@/components/sidebar';

 function page() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'AirPods Pro 2 inventory is running low (12 units remaining)',
      timestamp: '2 minutes ago',
      isUnread: true,
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'success',
      title: 'Product Updated Successfully',
      message: 'iPhone 14 Pro pricing and inventory have been updated',
      timestamp: '15 minutes ago',
      isUnread: false,
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'info',
      title: 'New Product Category Added',
      message: '"Smart Home" category has been added to your product catalog',
      timestamp: '1 hour ago',
      isUnread: false,
      icon: Info
    },
    {
      id: 4,
      type: 'warning',
      title: 'Price Change Detected',
      message: 'MacBook Air M2 competitor pricing has changed significantly',
      timestamp: '3 hours ago',
      isUnread: false,
      icon: AlertTriangle
    }
  ];

  const filterTabs = [
    { name: 'All', count: null },
    { name: 'Unread', count: 1 },
    { name: 'Alerts', count: null },
    { name: 'Settings', count: null }
  ];

  const getNotificationStyle = (type) => {
    return {
      bg: 'bg-white',
      border: 'border-gray-200',
      iconColor: 'text-gray-500'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <Sidebar/>
      <div className="min-w-6xl mx-auto min-h-[90vh]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-blue-900 mb-6">Notifications</h1>
          
          {/* Filter Tabs and Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveFilter(tab.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    activeFilter === tab.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.name}
                  {tab.count && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Search notifications..."
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                Mark all as read
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => {
            const style = getNotificationStyle(notification.type);
            const Icon = notification.icon;
            
            return (
              <div
                key={notification.id}
                className={`${style.bg} ${style.border} border rounded-xl p-4 transition-all hover:shadow-sm`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${style.iconColor}`}>
                    <Icon size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      {notification.isUnread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    
                    <span className="text-xs text-gray-500">{notification.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State (hidden when notifications exist) */}
        <div className="hidden text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default page;
