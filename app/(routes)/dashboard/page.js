"use client"
import React, { useRef, useEffect, useState } from 'react'
import Sidebar from '../../../components/sidebar'
import { Search, ShoppingBag, Users, Package, TrendingUp, RefreshCw, CheckCircle, Tag, Sparkles, FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import GenerateReportButton from '../../../components/GenerateReportButton';
import NotificationBell from '../../../components/NotificationBell';
import TokenManager from '@/utils/tokenManager';
import NotificationManager from '@/utils/notificationManager';
import AuthGuard from '@/components/AuthGuard';

const page = () => {
  const dashboardRef = useRef(null);
  const chartRef = useRef(null);

  // State for backend data
  const [userName, setUserName] = useState('User');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [duesCount, setDuesCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [graphData, setGraphData] = useState([]);
  const [salesAmount, setSalesAmount] = useState(0);
  const [discountCount, setDiscountCount] = useState(0);

  // Helper: get token from TokenManager
  const getToken = () => {
    return TokenManager.getToken(false);
  };

  // Helper: get employeeId from token (decode JWT)
  const getEmployeeIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.employeeId || payload.userId || payload.id || null;
    } catch {
      return null;
    }
  };

  // Fetch user name and store in localStorage
  useEffect(() => {
    const fetchUserName = async () => {
      // Check for admin data first (since this is admin dashboard)
      let name = localStorage.getItem('admin');
      if (name) {
        setUserName(name);
        return;
      }
      
      // If no admin data, try to fetch from API
      const token = getToken();
      const employeeId = getEmployeeIdFromToken();
      if (!token || !employeeId) return;
      try {
        const res = await fetch(`/api/employee/${employeeId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          name = data.data?.name || 'User';
          setUserName(name);
          localStorage.setItem('admin', name);
          // Also store email if available
          if (data.data?.email) {
            localStorage.setItem('adminEmail', data.data.email);
          }
        }
      } catch {}
    };
    fetchUserName();
  }, []);

  // Add event listener to refresh user data when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'admin') {
        setUserName(e.newValue || 'User');
      }
    };

    // Also check for user changes on focus (in case localStorage was updated in another tab)
    const handleFocus = () => {
      const name = localStorage.getItem('admin');
      if (name) {
        setUserName(name);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []); // Remove userName dependency to prevent infinite re-renders

  // Fetch products and orders, then aggregate dashboard data
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;
      // Fetch products
      const prodRes = await fetch('/api/product', { headers: { 'Authorization': `Bearer ${token}` } });
      const prodData = prodRes.ok ? (await prodRes.json()).data : [];
      setProducts(prodData);
      setProductCount(prodData.length);
      // Fetch orders
      const orderRes = await fetch('/api/order', { headers: { 'Authorization': `Bearer ${token}` } });
      const orderData = orderRes.ok ? (await orderRes.json()).data : [];
      setOrders(orderData);
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
            image: '👟', // Placeholder, replace with prod.image if available
            color: prod.color || 'blue',
            rating: 4, // Placeholder, could be dynamic if available
            sold: qty + 'x',
          };
        });
      setPopularProducts(sortedPopular);
      // Unique customers
      const uniqueCustomers = new Set(orderData.map(o => `${o.customerName}|${o.customerNumber}`));
      setCustomerCount(uniqueCustomers.size);
      // Sales (delivered orders)
      setSalesCount(orderData.filter(o => o.status === 'delivered').length);
      // Dues (pending orders)
      setDuesCount(orderData.filter(o => o.status === 'pending').length);
      // Pending (shipped orders)
      setPendingCount(orderData.filter(o => o.status === 'shipped').length);
      // Graph data (sales per month)
      const salesByMonth = {};
      orderData.forEach(order => {
        if (order.status === 'delivered') {
          const date = new Date(order.createdAt);
          const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          salesByMonth[month] = (salesByMonth[month] || 0) + 1;
        }
      });
      setGraphData(Object.entries(salesByMonth).map(([month, count]) => ({ month, count })));
      // Sales Amount (sum of totalAmount for delivered orders)
      const salesAmt = orderData.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      setSalesAmount(salesAmt);
      // Discount: sum of 10% of the totalAmount of the sixth order for each customer with >5 orders
      const ordersByCustomer = {};
      orderData.forEach(o => {
        if (!ordersByCustomer[o.customerName]) ordersByCustomer[o.customerName] = [];
        ordersByCustomer[o.customerName].push(o);
      });
      let discountSum = 0;
      Object.values(ordersByCustomer).forEach(orderList => {
        if (orderList.length > 5) {
          // Sort by createdAt ascending
          orderList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const sixthOrder = orderList[5];
          if (sixthOrder && sixthOrder.totalAmount) {
            discountSum += sixthOrder.totalAmount * 0.10;
          }
        }
      });
      setDiscountCount(discountSum);
    };
    fetchData();
  }, []);

  // Check for low stock products and create notifications
  useEffect(() => {
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
              const notificationResponse = await fetch('/api/notification', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              
              if (notificationResponse.ok) {
                const notificationData = await notificationResponse.json();
                const existingNotification = notificationData.data?.find(
                  n => n.relatedProduct === product.id && n.category === 'stock' && n.isUnread
                );
                
                // Check if this notification was recently read
                const wasRecentlyRead = NotificationManager.wasRecentlyRead(product.id, 'stock');
                
                if (!existingNotification && !wasRecentlyRead) {
                  await fetch('/api/notification', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      title: 'Low Stock Alert',
                      message: `${product.name} inventory is running low (${product.stock} units remaining)`,
                      type: 'alert',
                      category: 'stock',
                      priority: 'high',
                      relatedProduct: product.id
                    })
                  });
                }
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

    checkLowStockProducts();
    
    // Set up periodic checks every 5 minutes
    const interval = setInterval(checkLowStockProducts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  // Budget vs Expenses data
  const budgetExpensesData = [
    { month: 'Oct-15', budget: 65, expenses: 45, line: 75 },
    { month: 'Nov-15', budget: 75, expenses: 65, line: 85 },
    { month: 'Dec-15', budget: 35, expenses: 25, line: 75 },
    { month: 'Jan-16', budget: 30, expenses: 25, line: 55 },
    { month: 'Feb-16', budget: 25, expenses: 20, line: 40 },
    { month: 'Mar-16', budget: 70, expenses: 55, line: 75 },
    { month: 'Apr-16', budget: 45, expenses: 35, line: 65 },
    { month: 'May-16', budget: 75, expenses: 30, line: 55 }
  ];

  // Earnings data (heights as percentages)
  const earningsData = [70, 85, 75, 90, 100];

  // Create SVG path for the red line
  const createLinePath = (data) => {
    const width = 100;
    const height = 100;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - d;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const lineValues = budgetExpensesData.map(d => d.line);
  const linePath = createLinePath(lineValues);
  const chartData = [
    { month: 'Jan', blue: 115, yellow: 180, green: 50 },
    { month: 'Feb', blue: 280, yellow: 200, green: 140 },
    { month: 'Mar', blue: 310, yellow: 280, green: 190 },
    { month: 'Apr', blue: 220, yellow: 150, green: 45 },
    { month: 'May', blue: 240, yellow: 190, green: 115 },
    { month: 'Jun', blue: 150, yellow: 200, green: 75 },
    { month: 'Jul', blue: 95, yellow: 210, green: 95 }
  ];

  const maxValue = 350;

  // Function to generate analysis text
  const generateAnalysis = () => {
    const totalCustomers = 30567;
    const totalProducts = 3037;
    const totalSales = 20509;
    const salesChange = '+33%';
    const totalRefunds = 21647;
    const refundsChange = '-12%';
    const mostPopularProduct = products.reduce((max, p) => (parseInt(p.sold) > parseInt(max.sold) ? p : max), products[0]);
    const highestSalesMonth = chartData.reduce((max, d) => (d.blue > max.blue ? d : max), chartData[0]);

    return (
      `Dashboard Analysis Report\n\n` +
      `- Total Customers: ${totalCustomers}\n` +
      `- Total Products: ${totalProducts}\n` +
      `- Total Sales: ${totalSales} (${salesChange})\n` +
      `- Total Refunds: ${totalRefunds} (${refundsChange})\n` +
      `- Most Popular Product: ${mostPopularProduct.name} (${mostPopularProduct.sold} sold)\n` +
      `- Highest Sales Month: ${highestSalesMonth.month} (${highestSalesMonth.blue} units)\n`
    );
  };

  return (
    <AuthGuard requireAuth={true} isEmployeeRoute={false}>
      <div
        className="flex min-h-screen"
        style={{ backgroundColor: '#f1f5f9' }}
      >
        <Sidebar />
        <div
          className="flex-1 p-6 overflow-y-auto max-h-screen hide-scrollbar"
          style={{ backgroundColor: '#f1f5f9' }}
        >
          <div
            className="max-w-[1800px] mx-auto space-y-6 pb-6"
            ref={dashboardRef}
            style={{ backgroundColor: '#f1f5f9' }}
          >
            {/* Welcome Section */}
            <div className="relative my-5 flex justify-between items-center">
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div style={{ width: '0.375rem', height: '2.5rem', background: 'linear-gradient(to bottom, #6366f1, #a21caf)', borderRadius: '9999px', marginRight: '1rem' }}></div>
                  <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #1f2937, #374151, #4b5563)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                    Welcome back, {userName}!
                  </h1>
                </div>
                <p style={{ color: '#6b7280', marginLeft: '1.5rem', fontSize: '1.125rem', fontWeight: 500 }}>Here's what's happening with your store today.</p>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <GenerateReportButton chartRef={chartRef} />
              </div>
            </div>

            {/* Upper Section - Now with exact design from first file */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Side - Popular Products (from first file) */}
              <div className="col-span-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Products</h2>
                  
                  <div className="space-y-4">
                    {popularProducts.map((product) => (
                      <div key={product.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{product.image}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-blue-600 font-bold text-sm">
                                {product.price}
                              </span>
                              <div className="flex">
                                {renderStars(product.rating)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            📦
                          </div>
                          <span className="text-sm font-medium text-gray-900">{product.sold}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side (from first file) */}
              <div className="col-span-8">
                {/* Stats Cards (from first file) */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {/* Customers */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-cyan-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{customerCount}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Customers</span>
                      {/* Removed percentage change */}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{productCount}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Products</span>
                      {/* Removed percentage change */}
                    </div>
                  </div>

                  {/* Sales */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{salesCount}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Sales</span>
                      {/* Removed percentage change */}
                    </div>
                  </div>

                  {/* Refunds */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{duesCount}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Refunds</span>
                      {/* Removed percentage change */}
                    </div>
                  </div>
                </div>

                {/* Charts Section (from first file) */}
                <div className="space-y-6">
                {/* Two Cards Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dues & Pending Orders */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Dues & Pending Orders</h3>
                      </div>
                      <span className="text-xs text-gray-400">22 - 29 nov</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Dues</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">{duesCount}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Pending Orders</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">{pendingCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sales & Discount */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Tag className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Sales & Discount</h3>
                      </div>
                      <span className="text-xs text-gray-400">22 - 29 nov 2025</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Sales</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">{salesAmount}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Discount</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">{discountCount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Below */}
                <div
                  ref={chartRef}
                  style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginTop: '1.5rem' }}
                >
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem', textAlign: 'center' }}>Units sold</h3>
                  
                  {/* Chart */}
                  <div style={{ position: 'relative', height: '20rem' }}>
                    {/* Y-axis labels */}
                    <div style={{ position: 'absolute', left: 0, top: 0, fontSize: '0.75rem', color: '#9ca3af' }}>350</div>
                    <div style={{ position: 'absolute', left: 0, top: '25%', fontSize: '0.75rem', color: '#9ca3af' }}>300</div>
                    <div style={{ position: 'absolute', left: 0, top: '50%', fontSize: '0.75rem', color: '#9ca3af' }}>250</div>
                    <div style={{ position: 'absolute', left: 0, top: '75%', fontSize: '0.75rem', color: '#9ca3af' }}>200</div>
                    <div style={{ position: 'absolute', left: 0, bottom: '8rem', fontSize: '0.75rem', color: '#9ca3af' }}>150</div>
                    <div style={{ position: 'absolute', left: 0, bottom: '4rem', fontSize: '0.75rem', color: '#9ca3af' }}>100</div>
                    <div style={{ position: 'absolute', left: 0, bottom: 0, fontSize: '0.75rem', color: '#9ca3af' }}>50</div>
                    <div style={{ position: 'absolute', left: 0, bottom: '-1rem', fontSize: '0.75rem', color: '#9ca3af' }}>0</div>

                    {/* Chart area */}
                    <div style={{ marginLeft: '2rem', marginRight: '1rem', height: '18rem', position: 'relative' }}>
                      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 400 280">
                        {/* Grid lines */}
                        <defs>
                          <pattern id="grid" width="57" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 57 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Blue line */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          points="0,165 57,120 114,90 171,140 228,125 285,165 342,195"
                        />
                        
                        {/* Yellow line */}
                        <polyline
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          points="0,100 57,80 114,56 171,130 228,90 285,80 342,70"
                        />
                        
                        {/* Green line */}
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          points="0,230 57,140 114,91 171,235 228,165 285,205 342,185"
                        />
                        
                        {/* Data points */}
                        {graphData.map((point, index) => (
                          <g key={index}>
                            <circle cx={index * 57} cy={280 - (point.count * 280 / maxValue)} r="4" fill="#3b82f6" />
                            <circle cx={index * 57} cy={280 - (point.count * 280 / maxValue)} r="4" fill="#fbbf24" />
                            <circle cx={index * 57} cy={280 - (point.count * 280 / maxValue)} r="4" fill="#10b981" />
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* X-axis labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', marginLeft: '2rem', marginRight: '1rem' }}>
                      {graphData.map((point, index) => (
                        <span key={index} style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{point.month}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default page
