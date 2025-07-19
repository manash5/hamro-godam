"use client"
import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, X } from 'lucide-react';
import Sidebar from '@/components/employee/sidebar';

const LOW_STOCK_THRESHOLD = 10;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
    category: '',
    supplier: '', // Optional: adjust as needed
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

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

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, 
        body: JSON.stringify({
          ...addForm,
          stock: Number(addForm.stock),
          price: Number(addForm.price),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setAddForm({ name: '', description: '', stock: '', price: '', category: '', supplier: '' });
        fetchProducts();
      } else {
        setAddError(data.message || 'Failed to add product');
      }
    } catch (err) {
      setAddError('Failed to add product');
    }
    setAdding(false);
  };

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
                    Actions
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
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          view details ⋮
                        </button>
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
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4">Add Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={addForm.name}
                    onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={addForm.description}
                    onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={addForm.category}
                    onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={addForm.stock}
                    onChange={e => setAddForm(f => ({ ...f, stock: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={addForm.price}
                    onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                    required
                  />
                </div>
                {/* Optional: Supplier field if needed */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">Supplier</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={addForm.supplier}
                    onChange={e => setAddForm(f => ({ ...f, supplier: e.target.value }))}
                  />
                </div> */}
                {addError && <div className="text-red-500 text-sm">{addError}</div>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
                  disabled={adding}
                >
                  {adding ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;