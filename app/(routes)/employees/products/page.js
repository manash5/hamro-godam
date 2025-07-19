"use client"
import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import Sidebar from '@/components/employee/sidebar';

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(2);

  const products = [
    {
      id: 1,
      name: "Nike Air Max 270",
      description: "Classic running shoes",
      category: "Footwear",
      price: "$8,500",
      stock: 45,
      sold: 23,
      status: "In Stock",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      name: "Jordan Retro 1",
      description: "Basketball sneakers",
      category: "Footwear",
      price: "$12,800",
      stock: 12,
      sold: 31,
      status: "Low Stock",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 3,
      name: "Adidas Ultraboost",
      description: "Performance running",
      category: "Footwear",
      price: "$9,200",
      stock: 28,
      sold: 18,
      status: "In Stock",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 4,
      name: "Nike Dri-FIT Shirt",
      description: "Athletic wear",
      category: "Apparel",
      price: "$3,500",
      stock: 0,
      sold: 42,
      status: "Out of Stock",
      statusColor: "bg-red-100 text-red-800"
    }
  ];

  const tabs = [
    { id: 'all', label: 'All (127)', count: 127 },
    { id: 'in-stock', label: 'In Stock (98)', count: 98 },
    { id: 'low-stock', label: 'Low Stock (14)', count: 14 },
    { id: 'out-of-stock', label: 'Out of Stock (15)', count: 15 }
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
        <Sidebar/>
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
              />
            </div>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-gray-600 text-sm mb-2">Total Products</h3>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">127</span>
              <div className="flex items-center text-sm text-green-600 mb-1">
                <span>+8% from last month</span>
                <span className="ml-1">↗ +8</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-gray-600 text-sm mb-2">Low Stock Items</h3>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">14</span>
              <div className="flex items-center text-sm text-red-600 mb-1">
                <span>Needs attention</span>
                <span className="ml-1">⚠ Alert</span>
              </div>
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
                onClick={() => setActiveTab(tab.id)}
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
                  Sold
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {product.name.charAt(0)}
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
                    {product.price}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {product.sold}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.statusColor}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      view details ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing 1-4 of 127 products
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-2 rounded-md text-sm ${
                currentPage === 1 ? 'bg-gray-200 text-gray-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`px-3 py-2 rounded-md text-sm ${
                currentPage === 2 ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`px-3 py-2 rounded-md text-sm ${
                currentPage === 3 ? 'bg-gray-200 text-gray-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;