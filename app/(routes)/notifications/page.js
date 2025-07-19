"use client"

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import TokenManager from '@/utils/tokenManager';

 function page() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper: get token from TokenManager
  const getToken = () => {
    return TokenManager.getToken(false);
  };

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('/api/notification', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`/api/notification/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isUnread: false })
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, isUnread: false } : n
          )
        );
        
        // Store in localStorage to prevent showing again
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
          // Extract task title from message for task notifications
          let taskTitle = null;
          if (notification.category === 'task' && notification.message) {
            const match = notification.message.match(/"([^"]+)"/);
            taskTitle = match ? match[1] : null;
          }
          
          // Import NotificationManager dynamically to avoid SSR issues
          const NotificationManager = (await import('@/utils/notificationManager')).default;
          NotificationManager.markAsRead(
            notificationId, 
            notification.relatedProduct, 
            notification.category,
            taskTitle
          );
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const unreadNotifications = notifications.filter(n => n.isUnread);
      
      for (const notification of unreadNotifications) {
        await fetch(`/api/notification/${notification.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isUnread: false })
        });
      }
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`/api/notification/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle size={20} className="text-red-500" />;
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Filter notifications based on active filter and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === 'All' || 
      (activeFilter === 'Unread' && notification.isUnread) ||
      (activeFilter === 'Alerts' && notification.type === 'alert') ||
      (activeFilter === 'Tasks' && notification.category === 'task');
    
    const matchesSearch = !searchTerm || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Get unread count
  const unreadCount = notifications.filter(n => n.isUnread).length;

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  const filterTabs = [
    { name: 'All', count: null },
    { name: 'Unread', count: unreadCount > 0 ? unreadCount : null },
    { name: 'Alerts', count: null },
    { name: 'Tasks', count: null },
    { name: 'Settings', count: null }
  ];



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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              />
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white border border-gray-200 rounded-xl p-4 transition-all hover:shadow-sm ${
                  notification.isUnread ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-gray-50">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <div className="flex items-center space-x-2">
                        {notification.isUnread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatTimestamp(notification.createdAt)}</span>
                      {notification.isUnread && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>


      </div>
    </div>
  );
}

export default page;
