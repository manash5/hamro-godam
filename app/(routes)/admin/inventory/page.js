"use client"
import { useState, useEffect } from 'react';
import { Search, Package, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import Sidebar from '../../../../components/sidebar';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required. Please login first.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/product', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication failed. Please login again.');
            localStorage.removeItem('token');
          } else {
            throw new Error(`Failed to fetch products: ${response.status}`);
          }
          return;
        }

        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter items based on search
  const filteredItems = products.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get border color based on stock level
  const getStockBorderColor = (stock) => {
    if (stock < 10) return 'border-b-red-500';
    if (stock < 20) return 'border-b-yellow-500';
    return 'border-b-green-500';
  };

  // Get stock status info
  const getStockStatus = (stock) => {
    if (stock < 10) return { 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      icon: TrendingDown, 
      label: 'Low Stock' 
    };
    if (stock < 20) return { 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50', 
      icon: AlertTriangle, 
      label: 'Medium Stock' 
    };
    return { 
      color: 'text-green-600', 
      bgColor: 'bg-green-50', 
      icon: CheckCircle, 
      label: 'In Stock' 
    };
  };

  const totalItems = products.length;
  const lowStockItems = products.filter(item => item.stock < 10).length;
  const mediumStockItems = products.filter(item => item.stock >= 10 && item.stock < 20).length;
  const inStockItems = products.filter(item => item.stock >= 20).length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex">
        <Sidebar />
        <div className="min-w-7xl overflow-y-auto hide-scrollbar max-h-screen mx-auto py-4 px-5 my-5 bg-slate-100 rounded-xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading inventory...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex">
        <Sidebar />
        <div className="min-w-7xl overflow-y-auto hide-scrollbar max-h-screen mx-auto py-4 px-5 my-5 bg-slate-100 rounded-xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading inventory</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />
      <div className="min-w-7xl overflow-y-auto hide-scrollbar max-h-screen mx-auto py-4 px-5 my-5 bg-slate-100 rounded-xl">
        {/* Header */}
        <div className="mb-8 ">
          <div className="flex items-center justify-between mb-5 bg-white p-3 rounded-xl">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory</h1>
              <p className="text-gray-600">Manage your product inventory and stock levels</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-200 px-4 py-2 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Total Items: {totalItems}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          {/* Stock Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Low Stock</p>
                  <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Medium Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{mediumStockItems}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">{inStockItems}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
            />
          </div>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item.stock);
              const StatusIcon = stockStatus.icon;
              
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-b-4 ${getStockBorderColor(item.stock)} group hover:scale-105`}
                >
                  {/* Product Image */}
                  <div className="aspect-w-16 aspect-h-12 bg-gray-100 relative overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-48"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {/* Stock Status Badge */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color} flex items-center space-x-1`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{stockStatus.label}</span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className={`font-bold ${stockStatus.color}`}>
                          {item.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {products.length === 0 ? 'No products in inventory' : 'No products found'}
              </h3>
              <p className="text-gray-600">
                {products.length === 0 ? 'Add some products to get started' : 'Try adjusting your search terms'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}