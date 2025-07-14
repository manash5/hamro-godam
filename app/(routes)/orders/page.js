"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import AddOrderModal from '@/components/order/AddOrderModel';



export default function OrdersPage() {
  const [editOrder, setEditOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRefs = useRef({});

 
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
          phone: order.customerNumber, // This is actually the phone number
          email: "", // We don't store email in the model
          date: new Date(order.createdAt).toLocaleDateString(),
          time: new Date(order.createdAt).toLocaleTimeString(),
          amount: order.totalAmount,
          status: order.status.toUpperCase(),
          items: `${order.productName.length} Items`,
          itemsDetail: order.productName.join(', '),
          payment: order.payment || 'Not specified',
          // Store original data for editing
          originalData: order,
        }))
      );
    }
  };
  fetchOrders(); 
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen) {
        const dropdownButton = dropdownRefs.current[dropdownOpen];
        const isClickInsideDropdown = event.target.closest('[data-dropdown]');
        const isClickOnButton = dropdownButton && dropdownButton.contains(event.target);
        
        if (!isClickInsideDropdown && !isClickOnButton) {
          setDropdownOpen(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800 border border-green-200';
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
                          order.phone.toString().includes(searchTerm.toLowerCase());
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
        const newOrder = {
          id: result.data._id,
          customer: result.data.customerName,
          phone: result.data.customerNumber,
          email: orderData.email,
          date: new Date(result.data.createdAt).toLocaleDateString(),
          time: new Date(result.data.createdAt).toLocaleTimeString(),
          amount: result.data.totalAmount,
          status: result.data.status.toUpperCase(),
          items: `${result.data.productName.length} Items`,
          itemsDetail: result.data.productName.join(', '),
          payment: result.data.payment || orderData.paymentMethod || 'Cash',
          originalData: result.data,
        };
        setOrders(prev => [newOrder, ...prev]);
        setShowAddOrderModal(false);
      } else {
        alert(`Failed to save order: ${result.error}`);
        console.error('Failed to save order:', result.error);
      }
    } catch (err) {
      alert('Error saving order. Please try again.');
      console.error('Save order error:', err);
    }
  };

  const handleEditOrder = async (orderData) => {
    try {
      const res = await fetch(`/api/order/${editOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();

      if (res.ok) {
        const updatedOrder = {
          id: result.data._id,
          customer: result.data.customerName,
          phone: result.data.customerNumber,
          email: orderData.email,
          date: new Date(result.data.createdAt).toLocaleDateString(),
          time: new Date(result.data.createdAt).toLocaleTimeString(),
          amount: result.data.totalAmount,
          status: result.data.status.toUpperCase(),
          items: `${result.data.productName.length} Items`,
          itemsDetail: result.data.productName.join(', '),
          payment: result.data.payment || orderData.paymentMethod || 'Cash',
          originalData: result.data,
        };
        setOrders(prev => prev.map(order => order.id === editOrder.id ? updatedOrder : order));
        setShowEditOrderModal(false);
        setEditOrder(null);
      } else {
        alert(`Failed to update order: ${result.error}`);
        console.error('Failed to update order:', result.error);
      }
    } catch (err) {
      alert('Error updating order. Please try again.');
      console.error('Update order error:', err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/order/${orderId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        setDeleteConfirm(null);
      } else {
        console.error('Failed to delete order');
      }
    } catch (err) {
      console.error('Delete order error:', err);
    }
  };

  const openEditModal = (order) => {
    setEditOrder(order);
    setShowEditOrderModal(true);
    setDropdownOpen(null);
  };

  const openDeleteConfirm = (orderId) => {
    setDeleteConfirm(orderId);
    setDropdownOpen(null);
  };

  const handleDropdownToggle = (orderId, event) => {
    if (dropdownOpen === orderId) {
      setDropdownOpen(null);
    } else {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 192, // 192px is the dropdown width
      });
      setDropdownOpen(orderId);
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
              <option>DELIVERED</option>
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
          <div className="overflow-x-auto text-black relative">
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
                      <div className="text-xs text-gray-500">{order.phone}</div>
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
                    <td className="py-4 px-6 relative dropdown-container">
                      <button 
                        ref={(el) => dropdownRefs.current[order.id] = el}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        onClick={(e) => handleDropdownToggle(order.id, e)}
                      >
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

      {/* Add Order Modal */}
      <AddOrderModal 
        isOpen={showAddOrderModal}
        onClose={() => setShowAddOrderModal(false)}
        onSave={handleSaveOrder}
      />

      {/* Edit Order Modal */}
      <AddOrderModal 
        isOpen={showEditOrderModal}
        onClose={() => {
          setShowEditOrderModal(false);
          setEditOrder(null);
        }}
        onSave={handleEditOrder}
        existingOrder={editOrder ? {
          customerName: editOrder.customer,
          customerNumber: editOrder.phone,
          customerAddress: editOrder.originalData?.customerAddress || "",
          email: editOrder.email,
          productName: editOrder.originalData?.productName || [],
          productQuantity: editOrder.originalData?.productQuantity || [],
          totalAmount: editOrder.amount,
          status: editOrder.status.toLowerCase(),
          paymentMethod: editOrder.payment,
          comment: "",
          deliveryDate: editOrder.originalData?.deliveryDate || "",
        } : null}
      />

      {/* Dropdown Menu Portal */}
      {dropdownOpen && (
        <div 
          data-dropdown
          className="fixed w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            minWidth: '192px'
          }}
        >
          <div className="py-1">
            <button
              onClick={() => openEditModal(orders.find(order => order.id === dropdownOpen))}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Edit size={16} className="mr-2" />
              Edit Order
            </button>
            <button
              onClick={() => openDeleteConfirm(dropdownOpen)}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Order
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Order</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(deleteConfirm)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
