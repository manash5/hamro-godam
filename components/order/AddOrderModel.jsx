"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

export default function AddOrderModal({ isOpen, onClose, onSave, existingOrder }) {
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerNumber: "",
    customerAddress: "",
    email: "",
    products: [], // Changed to store product objects with id, name, price, stock
    totalAmount: 0,
    status: "pending",
    paymentMethod: "",
    comment: "",
    deliveryDate: "",
  });

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/product', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products.filter(product => product.status));
    } else {
      setFilteredProducts(
        products.filter(product => 
          product.status && 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, products]);

  useEffect(() => {
    if (existingOrder) {
      // Convert existing order format to new format
      const convertedProducts = existingOrder.productName.map((name, index) => {
        const product = products.find(p => p.name === name);
        return {
          id: product?._id || product?.id || "",
          name: name,
          price: product?.price || 0,
          stock: product?.stock || 0,
          quantity: existingOrder.productQuantity[index] || 1
        };
      });
      
      setOrderData({
        ...existingOrder,
        products: convertedProducts
      });
    } else {
      setOrderData({
        customerName: "",
        customerNumber: "",
        customerAddress: "",
        email: "",
        products: [],
        totalAmount: 0,
        status: "pending",
        paymentMethod: "",
        comment: "",
        deliveryDate: "",
      });
    }
  }, [existingOrder, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProductDropdown !== null) {
        const isClickInsideDropdown = event.target.closest('[data-product-dropdown]');
        const isClickOnInput = event.target.closest('[data-product-input]');
        
        if (!isClickInsideDropdown && !isClickOnInput) {
          setShowProductDropdown(null);
          setSearchTerm("");
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProductDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...orderData.products];
    
    if (field === "quantity") {
      updatedProducts[index].quantity = parseInt(value) || 0;
    }
    
    setOrderData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  const addProduct = () => {
    setOrderData((prev) => ({
      ...prev,
      products: [...prev.products, { id: "", name: "", price: 0, stock: 0, quantity: 1 }],
    }));
  };

  const removeProduct = (index) => {
    const updatedProducts = [...orderData.products];
    updatedProducts.splice(index, 1);
    setOrderData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  const selectProduct = (product, index) => {
    const updatedProducts = [...orderData.products];
    updatedProducts[index] = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      quantity: 1
    };
    
    setOrderData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
    setShowProductDropdown(null);
    setSearchTerm("");
  };

  const calculateTotal = () => {
    return orderData.products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
  };

  const handleSubmit = () => {
    const totalAmount = calculateTotal();
    const orderPayload = {
      ...orderData,
      totalAmount,
      productName: orderData.products.map(p => p.name),
      productQuantity: orderData.products.map(p => p.quantity),
      productIds: orderData.products.map(p => p.id), // Add product IDs for stock update
    };
    onSave(orderPayload);
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
                  {orderData.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 relative">
                        <div className="relative" data-product-input>
                          <input
                            type="text"
                            value={product.name}
                            placeholder="Search and select product..."
                            className="w-full border-none outline-none font-medium pr-8"
                            readOnly
                            onClick={() => setShowProductDropdown(index)}
                          />
                          <button
                            onClick={() => setShowProductDropdown(showProductDropdown === index ? null : index)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          >
                            <ChevronDown size={16} className="text-gray-400" />
                          </button>
                        </div>
                        
                        {/* Product Dropdown */}
                        {showProductDropdown === index && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto" data-product-dropdown>
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                  type="text"
                                  placeholder="Search products..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="py-1">
                              {filteredProducts.length > 0 ? (
                                filteredProducts.map((prod) => (
                                  <button
                                    key={prod._id || prod.id}
                                    onClick={() => selectProduct(prod, index)}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex justify-between items-center"
                                  >
                                    <span>{prod.name}</span>
                                    <span className="text-gray-500">${prod.price} (Stock: {prod.stock})</span>
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-gray-500 text-sm">No products found</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                        />
                        <span className="text-gray-500">×</span>
                        <span className="font-medium">${product.price || 0}</span>
                      </div>
                      <button 
                        onClick={() => removeProduct(index)} 
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X size={16} />
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
                      ${calculateTotal().toLocaleString()}
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