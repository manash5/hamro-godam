"use client";

import { useEffect, useState } from "react";

export default function AddOrderModal({ isOpen, onClose, onSave, existingOrder }) {
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerNumber: "",
    customerAddress: "",
    email: "",
    productName: [],
    productQuantity: [],
    totalAmount: 0,
    status: "pending",
    paymentMethod: "",
    comment: "",
    deliveryDate: "",
  });

  useEffect(() => {
    if (existingOrder) {
      setOrderData(existingOrder);
    } else {
      setOrderData({
        customerName: "",
        customerNumber: "",
        customerAddress: "",
        email: "",
        productName: [],
        productQuantity: [],
        totalAmount: 0,
        status: "pending",
        paymentMethod: "",
        comment: "",
        deliveryDate: "",
      });
    }
  }, [existingOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const names = [...orderData.productName];
    const quantities = [...orderData.productQuantity];

    if (field === "name") names[index] = value;
    else quantities[index] = parseInt(value) || 0;

    setOrderData((prev) => ({
      ...prev,
      productName: names,
      productQuantity: quantities,
    }));
  };

  const addProduct = () => {
    setOrderData((prev) => ({
      ...prev,
      productName: [...prev.productName, ""],
      productQuantity: [...prev.productQuantity, 1],
    }));
  };

  const removeProduct = (index) => {
    const names = [...orderData.productName];
    const quantities = [...orderData.productQuantity];
    names.splice(index, 1);
    quantities.splice(index, 1);

    setOrderData((prev) => ({
      ...prev,
      productName: names,
      productQuantity: quantities,
    }));
  };

  const handleSubmit = () => {
    const totalAmount = orderData.productQuantity.reduce((sum, qty) => sum + qty * 500, 0);
    onSave({ ...orderData, totalAmount });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto hide-scrollbar text-black">
        {/* Header */}
        <div className="bg-slate-700 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold mb-2">
            # {existingOrder ? "Edit Order" : "Draft No."}
          </h2>
          <p className="text-slate-300 text-sm">Order management and details</p>
        </div>

        <div className="p-6 text-black">
          {/* Status and Payment Method Section */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Status:</label>
              <div className="flex gap-2">
                <select 
                  name="status" 
                  value={orderData.status} 
                  onChange={handleChange} 
                  className="px-4 py-2 border border-gray-500 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">⏳ PENDING</option>
                  <option value="shipped">🚚 SHIPPED</option>
                  <option value="delivered">✅ DELIVERED</option>
                  <option value="cancelled">❌ CANCELLED</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Payment Method:</label>
              <input 
                name="paymentMethod" 
                value={orderData.paymentMethod} 
                onChange={handleChange} 
                placeholder="Credit Card" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>

                {/* Product Items */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-gray-700">Product Items</h4>
                  {orderData.productName.map((product, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={product}
                          onChange={(e) => handleProductChange(index, "name", e.target.value)}
                          placeholder="Product Name"
                          className="w-full border-none outline-none font-medium"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={orderData.productQuantity[index]}
                          onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                        />
                        <span className="text-gray-500">×</span>
                        <span className="font-medium">$500</span>
                      </div>
                      <button 
                        onClick={() => removeProduct(index)} 
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addProduct} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add Product
                  </button>
                </div>

                {/* Total Amount */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${orderData.productQuantity.reduce((sum, qty) => sum + qty * 500, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer Details */}
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input 
                      name="customerName" 
                      value={orderData.customerName} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      name="email" 
                      value={orderData.email} 
                      onChange={handleChange} 
                      placeholder="john.doe@email.com" 
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      name="customerNumber" 
                      value={orderData.customerNumber} 
                      onChange={handleChange} 
                      placeholder="+1 (555) 123-4567" 
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                    <input 
                      name="customerAddress" 
                      value={orderData.customerAddress} 
                      onChange={handleChange} 
                      placeholder="123 Main St, New York, NY 10001" 
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments:</label>
            <textarea 
              name="comment" 
              value={orderData.comment} 
              onChange={handleChange} 
              placeholder="Add order notes or special instructions..." 
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {existingOrder ? "Update Order" : "Save Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}