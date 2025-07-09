"use client"
import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Menu, Bell } from 'lucide-react';
import Sidebar from '../../../components/sidebar'
import AddOrderModal from '../../../components/order/AddOrderModel'

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: '#ORD001',
      customer: 'John Smith',
      email: 'john.smith@email.com',
      date: 'May 24, 2025',
      time: '10:30 AM',
      amount: 2547.00,
      status: 'COMPLETED',
      items: '3 Items',
      itemsDetail: 'iPhone, MacBook',
      payment: 'Card'
    },
    {
      id: '#ORD002',
      customer: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      date: 'May 24,',
      time: '09:15 AM',
      amount: 1299.00,
      status: 'PENDING',
      items: '2 Items',
      itemsDetail: 'iPad, AirPods',
      payment: 'PayPal'
    },
    {
      id: '#ORD003',
      customer: 'Mike Davis',
      email: 'mike.davis@email.com',
      date: 'May 23,',
      time: '03:45 PM',
      amount: 899.00,
      status: 'PROCESSING',
      items: '1 Item',
      itemsDetail: 'Apple Watch',
      payment: 'Card'
    },
    {
      id: '#ORD004',
      customer: 'Emma Wilson',
      email: 'emma.w@email.com',
      date: 'May 23,',
      time: '11:20 AM',
      amount: 1599.00,
      status: 'SHIPPED',
      items: '4 Items',
      itemsDetail: 'iPhone, Case, Screen Protector',
      payment: 'Cash'
    },
    {
      id: '#ORD005',
      customer: 'Alex Brown',
      email: 'alex.brown@email.com',
      date: 'May 22,',
      time: '02:10 PM',
      amount: 799.00,
      status: 'CANCELLED',
      items: '1 Item',
      itemsDetail: 'MacBook Air',
      payment: 'Card'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomer = selectedCustomer === 'All Customers' || order.customer === selectedCustomer;
    const matchesStatus = selectedStatus === 'All Status' || order.status === selectedStatus;
    
    return matchesSearch && matchesCustomer && matchesStatus;
  });

  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleSaveOrder = (orderData) => {
    // Generate new order ID
    const newOrderId = `#ORD${String(orders.length + 1).padStart(3, '0')}`;
    
    // Create new order object
    const newOrder = {
      id: newOrderId,
      customer: orderData.customerName,
      email: orderData.email,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      amount: orderData.items.reduce((sum, item) => sum + item.price, 0),
      status: orderData.status === 'COMPLETE' ? 'COMPLETED' : orderData.status,
      items: `${orderData.items.length} Items`,
      itemsDetail: orderData.items.map(item => item.name).join(', '),
      payment: orderData.paymentMethod
    };

    // Add new order to the list
    setOrders(prev => [newOrder, ...prev]);
    
    console.log('New order created:', newOrder);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto py-10">
        {/* Page Header */}
        <div className="bg-slate-100 px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
              <p className="text-sm text-gray-500 mt-1">Track your orders instantly</p>
            </div>
            <button 
              onClick={() => setShowAddOrderModal(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <Plus size={18} />
              Add Order
            </button>
          </div>
        </div>
        
        

        {/* Filters */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 rounded-md mx-5">
          <div className="flex items-center gap-4 text-gray-600">
            <select 
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>All Customers</option>
              <option>John Smith</option>
              <option>Sarah Johnson</option>
              <option>Mike Davis</option>
              <option>Emma Wilson</option>
              <option>Alex Brown</option>
            </select>
            
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>All Status</option>
              <option>COMPLETED</option>
              <option>PENDING</option>
              <option>PROCESSING</option>
              <option>SHIPPED</option>
              <option>CANCELLED</option>
            </select>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white m-5 rounded-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Order ID</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Customer</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Amount</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Items</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-6">
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleOrderSelect(order.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900 text-sm">{order.id}</div>
                      <div className="text-xs text-gray-500">Payment: {order.payment}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900 text-sm">{order.customer}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{order.date}</div>
                      <div className="text-xs text-gray-500">{order.time}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold text-gray-900">${order.amount.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold text-gray-900">{order.items}</div>
                      <div className="text-xs text-gray-500">{order.itemsDetail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                        <MoreHorizontal size={16} className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1-{filteredOrders.length} of {filteredOrders.length} orders
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-white bg-blue-900 rounded-lg">
                1
              </button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-150">
                2
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Order Modal */}
      <AddOrderModal 
        isOpen={showAddOrderModal}
        onClose={() => setShowAddOrderModal(false)}
        onSave={handleSaveOrder}
        className = 'rounded-xl'
      />
    </div>
  );
}