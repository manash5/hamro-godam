"use client"
import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';

const AddOrderModal = ({ isOpen, onClose, onSave }) => {
  const [orderForm, setOrderForm] = useState({
    customerName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    shippingAddress: '123 Main St, New York, NY 10001',
    paymentMethod: 'Credit Card',
    status: 'PAID',
    comments: '',
    items: [
      { name: 'iPhone 14 Pro - 128GB', price: 999.00 },
      { name: 'AirPods Pro 2', price: 249.00 }
    ]
  });

  const calculateTotal = () => {
    return orderForm.items.reduce((sum, item) => sum + item.price, 0);
  };

  const updateItemPrice = (index, price) => {
    const newItems = [...orderForm.items];
    newItems[index].price = parseFloat(price) || 0;
    setOrderForm(prev => ({ ...prev, items: newItems }));
  };

  const updateItemName = (index, name) => {
    const newItems = [...orderForm.items];
    newItems[index].name = name;
    setOrderForm(prev => ({ ...prev, items: newItems }));
  };

  const addNewItem = () => {
    setOrderForm(prev => ({
      ...prev,
      items: [...prev.items, { name: '', price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (orderForm.items.length > 1) {
      const newItems = orderForm.items.filter((_, i) => i !== index);
      setOrderForm(prev => ({ ...prev, items: newItems }));
    }
  };

  const handleSave = () => {
    onSave(orderForm);
    setOrderForm({
      customerName: '',
      email: '',
      phone: '',
      shippingAddress: '',
      paymentMethod: 'Credit Card',
      status: 'PAID',
      comments: '',
      items: [
        { name: 'iPhone 14 Pro - 128GB', price: 999.00 },
        { name: 'AirPods Pro 2', price: 249.00 }
      ]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl text-gray-500">
        
        {/* Header */}
        <div className="bg-slate-700 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium"># Draft No.</h2>
              <p className="text-sm text-gray-300">Order management and details</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50">
          
          {/* Top Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                placeholder="—"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modified:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                placeholder="—"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  PAID
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                  COMPLETE
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method:</label>
              <div className="text-sm text-gray-600 py-2">Credit Card</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Order Summary */}
            <div className="bg-white rounded border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Order Summary</h3>
                <Search size={16} className="text-gray-400" />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Product Items</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-700">iPhone 14 Pro - 128GB</span>
                    </div>
                    <span className="text-sm font-medium">$999.00</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-700">AirPods Pro 2</span>
                    </div>
                    <span className="text-sm font-medium">$249.00</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">$1,248.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-4">Customer Details</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">Customer Name</div>
                  <div className="text-sm text-gray-600 mt-1">John Doe</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700">Email</div>
                  <div className="text-sm text-gray-600 mt-1">john.doe@email.com</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700">Phone</div>
                  <div className="text-sm text-gray-600 mt-1">+1 (555) 123-4567</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700">Shipping Address</div>
                  <div className="text-sm text-gray-600 mt-1">123 Main St, New York, NY 10001</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments:</label>
            <textarea
              value={orderForm.comments}
              onChange={(e) => setOrderForm(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Add order notes or special instructions..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrderModal;