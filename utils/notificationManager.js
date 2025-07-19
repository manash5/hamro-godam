// Notification Manager - Handles notification tracking using localStorage
// This prevents duplicate notifications and tracks read status without database dependency

class NotificationManager {
  // Check if a low stock alert should be created for a product
  static shouldCreateLowStockAlert(productId, currentStock) {
    const lowStockAlerts = JSON.parse(localStorage.getItem('lowStockAlerts') || '{}');
    const productKey = `product_${productId}`;
    const lastAlert = lowStockAlerts[productKey];
    
    // Only create alert if:
    // 1. No previous alert exists for this product, OR
    // 2. Previous alert was for different stock level, OR
    // 3. It's been more than 1 hour since last alert
    const shouldCreate = !lastAlert || 
      lastAlert.stock !== currentStock || 
      (Date.now() - lastAlert.timestamp) > 60 * 60 * 1000; // 1 hour
    
    if (shouldCreate) {
      // Update localStorage with current alert
      lowStockAlerts[productKey] = {
        stock: currentStock,
        timestamp: Date.now()
      };
      localStorage.setItem('lowStockAlerts', JSON.stringify(lowStockAlerts));
    }
    
    return shouldCreate;
  }

  // Check if a notification was recently read (within 24 hours)
  static wasRecentlyRead(productId, category) {
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    const recentlyRead = readNotifications.find(
      rn => rn.relatedProduct === productId && 
            rn.category === category && 
            (Date.now() - rn.timestamp) < 24 * 60 * 60 * 1000 // 24 hours
    );
    
    return !!recentlyRead;
  }

  // Check if a task notification was recently read (within 12 hours for tasks)
  static wasTaskRecentlyRead(taskTitle, category) {
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    const recentlyRead = readNotifications.find(
      rn => rn.taskTitle === taskTitle && 
            rn.category === category && 
            (Date.now() - rn.timestamp) < 12 * 60 * 60 * 1000 // 12 hours
    );
    
    return !!recentlyRead;
  }

  // Mark a notification as read
  static markAsRead(notificationId, relatedProduct, category, taskTitle = null) {
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    readNotifications.push({
      id: notificationId,
      relatedProduct,
      category,
      taskTitle,
      timestamp: Date.now()
    });
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
  }

  // Clean up old read notifications (older than 7 days)
  static cleanupOldReadNotifications() {
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const filteredNotifications = readNotifications.filter(
      rn => rn.timestamp > sevenDaysAgo
    );
    localStorage.setItem('readNotifications', JSON.stringify(filteredNotifications));
  }

  // Remove low stock alerts for products that are no longer low stock
  static cleanupLowStockAlerts(currentLowStockProductIds) {
    const lowStockAlerts = JSON.parse(localStorage.getItem('lowStockAlerts') || '{}');
    const currentProductIds = new Set(currentLowStockProductIds);
    
    Object.keys(lowStockAlerts).forEach(key => {
      const productId = key.replace('product_', '');
      if (!currentProductIds.has(productId)) {
        delete lowStockAlerts[key];
      }
    });
    
    localStorage.setItem('lowStockAlerts', JSON.stringify(lowStockAlerts));
  }

  // Get all low stock alerts
  static getLowStockAlerts() {
    return JSON.parse(localStorage.getItem('lowStockAlerts') || '{}');
  }

  // Get all read notifications
  static getReadNotifications() {
    return JSON.parse(localStorage.getItem('readNotifications') || '[]');
  }

  // Clear all notification data (for testing or reset)
  static clearAll() {
    localStorage.removeItem('lowStockAlerts');
    localStorage.removeItem('readNotifications');
  }
}

export default NotificationManager; 