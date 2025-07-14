"use client"

import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Package2 } from 'lucide-react';

import Sidebar from '../../../components/sidebar'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    image: '', // Add image field
    variations: [
      { type: 'Color', options: ['Black', 'White', 'Blue'], status: 'ACTIVE' }
    ]
  });
  const [uploading, setUploading] = useState(false); // Track upload state
  
  const products = [
    {
      id: 1,
      name: 'iPhone 14 Pro',
      sku: 'IPH14PRO001',
      category: 'Electronics',
      price: 999.00,
      stock: 156,
      status: 'ACTIVE',
      sales: 2847,
      salesChange: '+12%',
      image: '📱'
    },
    {
      id: 2,
      name: 'MacBook Air M2',
      sku: 'MBA13M2001',
      category: 'Computers',
      price: 1299.00,
      stock: 89,
      status: 'ACTIVE',
      sales: 1234,
      salesChange: '+8%',
      image: '💻'
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      sku: 'APP2GEN001',
      category: 'Audio',
      price: 249.00,
      stock: 12,
      status: 'LOW STOCK',
      sales: 3891,
      salesChange: '+25%',
      image: '🎧'
    },
    {
      id: 4,
      name: 'iPad Pro 12.9"',
      sku: 'IPADPRO129',
      category: 'Tablets',
      price: 1099.00,
      stock: 0,
      status: 'OUT OF STOCK',
      sales: 567,
      salesChange: '-5%',
      image: '📱'
    },
    {
      id: 5,
      name: 'Apple Watch Series 9',
      sku: 'AWSERIES9001',
      category: 'Wearables',
      price: 399.00,
      stock: 234,
      status: 'ACTIVE',
      sales: 1789,
      salesChange: '+18%',
      image: '⌚'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'LOW STOCK':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'OUT OF STOCK':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getSalesChangeColor = (change) => {
    return change.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  const addNewVariation = () => {
    setProductForm(prev => ({
      ...prev,
      variations: [...prev.variations, { type: '', options: [], status: 'ACTIVE' }]
    }));
  };

  const updateVariation = (index, field, value) => {
    setProductForm(prev => ({
      ...prev,
      variations: prev.variations.map((variation, i) => 
        i === index ? { ...variation, [field]: value } : variation
      )
    }));
  };

  const removeVariation = (index) => {
    setProductForm(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  // Handle image file selection and upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.path) {
        setProductForm(prev => ({ ...prev, image: data.path }));
      } else {
        alert('Image upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Image upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          stock: Number(productForm.stockQuantity),
          price: Number(productForm.price),
          category: productForm.category,
          image: productForm.image, // Include image path
          // status: productForm.status, // Add if you have status in your form
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setShowAddProductModal(false);
      } else {
        alert('Failed to save product: ' + result.error);
      }
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-slate-100 pt-10">
        {/* Header */}
        <div className="bg-slate-100 border-b border-gray-100 px-6 py-4 rounded-xl mb-5 mx-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
            </div>
            <button 
              onClick={() => setShowAddProductModal(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-md mx-6 text-gray-500">
          <div className="flex items-center gap-4 flex-wrap">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Computers</option>
              <option>Audio</option>
              <option>Tablets</option>
              <option>Wearables</option>
            </select>
            
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>All Status</option>
              <option>ACTIVE</option>
              <option>LOW STOCK</option>
              <option>OUT OF STOCK</option>
            </select>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Stock</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 px-6">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                            {product.image}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">{product.category}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{product.stock}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
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
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing 1-5 of {filteredProducts.length} products
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg border border-gray-300 transition-colors duration-150">
                  1
                </button>
                <button className="px-3 py-2 text-sm text-white bg-blue-900 rounded-lg border border-blue-900">
                  2
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar text-black">
            {/* Modal Header */}
            <div className="bg-slate-800 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Product Details</h2>
                  <p className="text-slate-300 mt-1">Create and manage your product information</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors duration-200">
                    Generate
                  </button>
                  <button 
                    onClick={handleFormSubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setShowAddProductModal(false)}
                    className="text-slate-300 hover:text-white p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-8">
              {/* General Information */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    ℹ
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
                    <p className="text-sm text-gray-600">Basic product details and description</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your product name here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your product features and benefits..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Media Assets */}
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    📷
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Media Assets</h3>
                    <p className="text-sm text-gray-600">Upload product images and videos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="text-4xl text-gray-400 mb-2">📷</div>
                      <p className="text-sm text-gray-600 mb-1">Add Images</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                      {productForm.image && (
                        <div className="mt-2 flex flex-col items-center">
                          <img src={productForm.image} alt="Product Preview" className="h-24 rounded border mb-1" />
                          <p className="text-xs text-gray-500">{productForm.image}</p>
                        </div>
                      )}
                      {uploading && <p className="text-blue-600 text-sm mt-1">Uploading...</p>}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="product-image-upload"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
                    onClick={() => document.getElementById('product-image-upload').click()}
                    disabled={uploading}
                  >
                    Browse Files
                  </button>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    💰
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h3>
                    <p className="text-sm text-gray-600">Set pricing and manage stock levels</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div className="relative">
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      >
                        <option value="">Select category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Computers">Computers</option>
                        <option value="Audio">Audio</option>
                        <option value="Tablets">Tablets</option>
                        <option value="Wearables">Wearables</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Variations */}
              <div className="bg-orange-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      🎨
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Product Variations</h3>
                      <p className="text-sm text-gray-600">Define product variants and options</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addNewVariation}
                    className="px-4 py-2 border-2 border-dashed border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add New Variation
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                    <div className="col-span-3">Variation Type</div>
                    <div className="col-span-4">Options</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3">Actions</div>
                  </div>
                  
                  {/* Variations */}
                  {productForm.variations.map((variation, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <select
                            value={variation.type}
                            onChange={(e) => updateVariation(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Color">Color</option>
                            <option value="Size">Size</option>
                            <option value="Material">Material</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="col-span-4">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="ml-2 text-sm text-gray-600">
                            {variation.options.join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                          {variation.status}
                        </span>
                      </div>
                      
                      <div className="col-span-3">
                        <button
                          type="button"
                          onClick={() => removeVariation(index)}
                          className="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-sm transition-colors duration-200"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}