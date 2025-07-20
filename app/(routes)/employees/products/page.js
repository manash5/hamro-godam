"use client"
import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, X } from 'lucide-react';
import Sidebar from '@/components/employee/sidebar';
import AddProductModal from '@/components/AddProductModal';

const LOW_STOCK_THRESHOLD = 10;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =  localStorage.getItem('token'); 
      const res = await fetch('/api/product', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Stats
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock < LOW_STOCK_THRESHOLD).length;

  // Tab logic (optional, can be expanded)
  const filteredProducts = products.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-stock') return product.stock > 0;
    if (activeTab === 'low-stock') return product.stock > 0 && product.stock < LOW_STOCK_THRESHOLD;
    if (activeTab === 'out-of-stock') return product.stock === 0;
    return true;
  });

  // Status helpers
  const getStatus = (product) => {
    if (product.stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (product.stock < LOW_STOCK_THRESHOLD) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  // Pagination (simple, static for now)
  const pageSize = 10;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  // Tabs
  const tabs = [
    { id: 'all', label: `All (${totalProducts})` },
    { id: 'in-stock', label: `In Stock (${products.filter(p => p.stock > 0).length})` },
    { id: 'low-stock', label: `Low Stock (${lowStockCount})` },
    { id: 'out-of-stock', label: `Out of Stock (${products.filter(p => p.stock === 0).length})` },
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="min-w-7xl mx-auto mt-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-80 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                // TODO: implement search
              />
            </div>
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-gray-600 text-sm mb-2">Total Products</h3>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">{totalProducts}</span>
              {/* Example: +8% from last month */}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-gray-600 text-sm mb-2">Low Stock Items</h3>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">{lowStockCount}</span>
              {lowStockCount > 0 && (
                <div className="flex items-center text-sm text-red-600 mb-1">
                  <span>Needs attention</span>
                  <span className="ml-1">⚠ Alert</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.map((product) => {
                  const status = getStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">
                              {product.name?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        ${product.price?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {product.stock}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-400 text-sm font-medium">
                          View only
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length === 0 ? 0 : ((currentPage - 1) * pageSize + 1)}-
            {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded-md text-sm ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchProducts}
          showSupplier={true}
          showImage={true}
          employeeMode={true}
        />
      </div>
    </div>
  );
};

export default ProductsPage;