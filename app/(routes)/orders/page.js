"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import AddOrderModal from '@/components/order/AddOrderModel';



export default function OrdersPage() {
  const [editOrder, setEditOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);

 
  useEffect(() => {
  const fetchOrders = async () => {
    const res = await fetch('/api/order');
    const data = await res.json();
    if (res.ok && data.data) {
      // Map your backend order fields to the frontend table format
      setOrders(
        data.data.map((order, idx) => ({
          id: order._id,
          customer: order.customerName,
          email: order.customerNumber, // or add email to your schema
          date: new Date(order.createdAt).toLocaleDateString(),
          time: new Date(order.createdAt).toLocaleTimeString(),
          amount: order.totalAmount,
          status: order.status.toUpperCase(),
          items: `${order.productName.length} Items`,
          itemsDetail: order.productName.join(', '),
        // or use a real field if available
        }))
      );
    }
  };
  fetchOrders(); 
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
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
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleSaveOrder = async (orderData) => {
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();

      if (res.ok) {
        const newOrderId = `#ORD${String(orders.length + 1).padStart(3, '0')}`;
        const newOrder = {
          id: newOrderId,
          customer: result.data.customerName,
          email: orderData.email,
          date: new Date(result.data.createdAt).toLocaleDateString(),
          time: new Date(result.data.createdAt).toLocaleTimeString(),
          amount: result.data.totalAmount,
          status: result.data.status.toUpperCase(),
          items: `${result.data.productName.length} Items`,
          itemsDetail: result.data.productName.join(', '),
          payment: orderData.paymentMethod || 'Cash',
        };
        setOrders(prev => [newOrder, ...prev]);
        setShowAddOrderModal(false);
      } else {
        console.error('Failed to save order:', result.error);
      }
    } catch (err) {
      console.error('Save order error:', err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-balck">
      <Sidebar />

      <div className="flex-1 overflow-auto py-10">
        <div className="bg-slate-100 px-6 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Track your orders instantly</p>
          </div>
          <button 
            onClick={() => setShowAddOrderModal(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Add Order
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 rounded-md mx-5">
          <div className="flex items-center gap-4 text-gray-600">
            <select 
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option>All Customers</option>
              {[...new Set(orders.map(order => order.customer))].map(customer => (
                <option key={customer}>{customer}</option>
              ))}
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
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
                  <th className="py-4 px-6">
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600"
                    />
                  </th>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Items</th>
                  <th className="py-4 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleOrderSelect(order.id)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold">{order.id}</div>
                      <div className="text-xs text-gray-500">Payment: {order.payment}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold">{order.customer}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div>{order.date}</div>
                      <div className="text-xs text-gray-500">{order.time}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold">${order.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold">{order.items}</div>
                      <div className="text-xs text-gray-500">{order.itemsDetail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreHorizontal size={16} className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (static for now) */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1-{filteredOrders.length} of {filteredOrders.length} orders
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-white bg-blue-900 rounded-lg">1</button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 border border-gray-300 rounded-lg">
                2
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddOrderModal 
        isOpen={showAddOrderModal}
        onClose={() => setShowAddOrderModal(false)}
        onSave={handleSaveOrder}
      />
    </div>
  );
}
