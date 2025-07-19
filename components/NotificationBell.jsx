"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import TokenManager from '@/utils/tokenManager';
import NotificationManager from '@/utils/notificationManager';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Helper: get token from TokenManager
  const getToken = () => {
    return TokenManager.getToken(false);
  };

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('/api/notification', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
        setUnreadCount(data.data?.filter(n => n.isUnread).length || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Check for low stock products and create notifications
  const checkLowStockProducts = async () => {
    const token = getToken();
    if (!token) return;

    try {
      // Fetch products
      const productResponse = await fetch('/api/product', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (productResponse.ok) {
        const productData = await productResponse.json();
        const lowStockProducts = productData.data?.filter(product => product.stock < 5) || [];
        
        // Create notifications for low stock products
        for (const product of lowStockProducts) {
          // Check if we should create an alert for this product
          if (NotificationManager.shouldCreateLowStockAlert(product.id, product.stock)) {
            // Check if notification already exists in backend
            const existingNotification = notifications.find(
              n => n.relatedProduct === product.id && n.category === 'stock' && n.isUnread
            );
            
            // Check if this notification was recently read
            const wasRecentlyRead = NotificationManager.wasRecentlyRead(product.id, 'stock');
            
            if (!existingNotification && !wasRecentlyRead) {
              await createNotification({
                title: 'Low Stock Alert',
                message: `${product.name} inventory is running low (${product.stock} units remaining)`,
                type: 'alert',
                category: 'stock',
                priority: 'high',
                relatedProduct: product.id
              });
            }
          }
        }
        
        // Clean up alerts for products that are no longer low stock
        const currentProductIds = lowStockProducts.map(p => p.id);
        NotificationManager.cleanupLowStockAlerts(currentProductIds);
      }
    } catch (error) {
      console.error('Error checking low stock products:', error);
    }
  };

  // Check for task notifications and create them if needed
  const checkTaskNotifications = async () => {
    const token = getToken();
    if (!token) return;

    try {
      // Fetch tasks
      const taskResponse = await fetch('/api/task', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (taskResponse.ok) {
        const taskData = await taskResponse.json();
        const completedTasks = taskData.data?.filter(task => task.status === 'completed') || [];
        
        // Check for recently completed tasks (within last hour)
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        const recentCompletedTasks = completedTasks.filter(task => 
          new Date(task.updatedAt).getTime() > oneHourAgo
        );
        
        for (const task of recentCompletedTasks) {
          // Check if notification already exists for this task completion
          const existingNotification = notifications.find(
            n => n.category === 'task' && 
                 n.message.includes(task.title) && 
                 n.message.includes('completed') &&
                 n.isUnread
          );
          
          // Check if this task notification was recently read
          const wasRecentlyRead = NotificationManager.wasTaskRecentlyRead(task.title, 'task');
          
          if (!existingNotification && !wasRecentlyRead) {
            const employeeName = task.assignedTo?.name || 'Unknown Employee';
            await createNotification({
              title: 'Task Completed',
              message: `${employeeName} has completed the task: "${task.title}"`,
              type: 'success',
              category: 'task',
              priority: 'medium',
              relatedProduct: null
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking task notifications:', error);
    }
  };

  // Create notifications for all completed tasks in database
  const createNotificationsForAllCompletedTasks = async () => {
    const token = getToken();
    if (!token) return;

    try {
      // Use the backend endpoint to create notifications
      const response = await fetch('/api/task', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Created ${data.createdCount} notifications for ${data.totalCompletedTasks} completed tasks`);
        
        // Refresh notifications to show the new ones
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error creating notifications for completed tasks:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('/api/notification', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
        alert('All notifications cleared');
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Create new notification
  const createNotification = async (notificationData) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('/api/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationData)
      });
      
      if (response.ok) {
        // Refresh notifications after creating new one
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error creating notification:', error);
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
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Store read notification in localStorage to prevent showing again
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
          // Extract task title from message for task notifications
          let taskTitle = null;
          if (notification.category === 'task' && notification.message) {
            const match = notification.message.match(/"([^"]+)"/);
            taskTitle = match ? match[1] : null;
          }
          
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
      setUnreadCount(0);
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
        const deletedNotification = notifications.find(n => n.id === notificationId);
        if (deletedNotification?.isUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Manual refresh function
  const refreshNotifications = () => {
    fetchNotifications();
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initial fetch and periodic checks
  useEffect(() => {
    fetchNotifications();
    checkLowStockProducts();
    checkTaskNotifications();
    
    // Clean up old read notifications (older than 7 days)
    NotificationManager.cleanupOldReadNotifications();
    
    // Set up periodic checks every 5 minutes
    const interval = setInterval(() => {
      checkLowStockProducts();
      checkTaskNotifications();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshNotifications}
                className="text-sm text-blue-600 hover:text-blue-800"
                title="Refresh notifications"
              >
                🔄
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg mb-2 transition-colors ${
                    notification.isUnread ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {notification.isUnread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-1">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.createdAt)}
                      </span>
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 