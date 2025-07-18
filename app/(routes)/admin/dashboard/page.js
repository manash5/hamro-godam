import React from 'react'
import Sidebar from '../../../../components/sidebar'
import { Search, ShoppingBag, Users, Package, TrendingUp, RefreshCw, CheckCircle, Tag, Sparkles, FileText } from 'lucide-react'

const page = () => {

  const products = [
    {
      id: 1,
      name: "Yew Plum Pine",
      price: "$197.27",
      rating: 4,
      sold: "98k",
      image: "👟", // Using emoji as placeholder
      color: "blue"
    },
    {
      id: 2,
      name: "Yew Plum Pine",
      price: "$177.20",
      rating: 3,
      sold: "90k",
      image: "👟",
      color: "black"
    },
    {
      id: 3,
      name: "Yew Plum Pine",
      price: "$168.72",
      rating: 4,
      sold: "88k",
      image: "👟",
      color: "red"
    },
    {
      id: 4,
      name: "Yew Plum Pine",
      price: "$154.26",
      rating: 3,
      sold: "76k",
      image: "👟",
      color: "black"
    },
    {
      id: 5,
      name: "Yew Plum Pine",
      price: "$127.27",
      rating: 3,
      sold: "70k",
      image: "👟",
      color: "purple"
    },
    {
      id: 6,
      name: "Yew Plum Pine",
      price: "$105.79",
      rating: 4,
      sold: "65k",
      image: "👟",
      color: "black"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  // Budget vs Expenses data
  const budgetExpensesData = [
    { month: 'Oct-15', budget: 65, expenses: 45, line: 75 },
    { month: 'Nov-15', budget: 75, expenses: 65, line: 85 },
    { month: 'Dec-15', budget: 35, expenses: 25, line: 75 },
    { month: 'Jan-16', budget: 30, expenses: 25, line: 55 },
    { month: 'Feb-16', budget: 25, expenses: 20, line: 40 },
    { month: 'Mar-16', budget: 70, expenses: 55, line: 75 },
    { month: 'Apr-16', budget: 45, expenses: 35, line: 65 },
    { month: 'May-16', budget: 75, expenses: 30, line: 55 }
  ];

  // Earnings data (heights as percentages)
  const earningsData = [70, 85, 75, 90, 100];

  // Create SVG path for the red line
  const createLinePath = (data) => {
    const width = 100;
    const height = 100;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - d;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const lineValues = budgetExpensesData.map(d => d.line);
  const linePath = createLinePath(lineValues);
  const chartData = [
    { month: 'Jan', blue: 115, yellow: 180, green: 50 },
    { month: 'Feb', blue: 280, yellow: 200, green: 140 },
    { month: 'Mar', blue: 310, yellow: 280, green: 190 },
    { month: 'Apr', blue: 220, yellow: 150, green: 45 },
    { month: 'May', blue: 240, yellow: 190, green: 115 },
    { month: 'Jun', blue: 150, yellow: 200, green: 75 },
    { month: 'Jul', blue: 95, yellow: 210, green: 95 }
  ];

  const maxValue = 350;

  return (
    <>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto max-h-screen hide-scrollbar">
          <div className="max-w-[1800px] mx-auto space-y-6 pb-6">
            {/* Welcome Section (unchanged from your second file) */}    
            <div className="relative my-5 flex justify-between items-center">
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-4"></div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                    Welcome back, User!
                  </h1>
                </div>
                <p className="text-gray-500 ml-6 text-lg font-medium">Here's what's happening with your store today.</p>
              </div>
              <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center space-x-2">
                  <FileText className="w-4 h-4 group-hover:rotate-3 transition-transform duration-300" />
                  <span>Generate Report</span>
                  <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                </div>
              </button>
            </div>

            {/* Upper Section - Now with exact design from first file */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Side - Popular Products (from first file) */}
              <div className="col-span-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Products</h2>
                  
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{product.image}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-blue-600 font-bold text-sm">
                                {product.price}
                              </span>
                              <div className="flex">
                                {renderStars(product.rating)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            📦
                          </div>
                          <span className="text-sm font-medium text-gray-900">{product.sold}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side (from first file) */}
              <div className="col-span-8">
                {/* Stats Cards (from first file) */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {/* Customers */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-cyan-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">30,567</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Customers</span>
                      <span className="text-red-500 text-sm font-medium">-5%</span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">3,037</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Products</span>
                      <span className="text-green-500 text-sm font-medium">+18%</span>
                    </div>
                  </div>

                  {/* Sales */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">205,09</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Sales</span>
                      <span className="text-green-500 text-sm font-medium">+33%</span>
                    </div>
                  </div>

                  {/* Refunds */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">21,647</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Refunds</span>
                      <span className="text-red-500 text-sm font-medium">-12%</span>
                    </div>
                  </div>
                </div>

                {/* Charts Section (from first file) */}
                <div className="space-y-6">
                {/* Two Cards Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dues & Pending Orders */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Dues & Pending Orders</h3>
                      </div>
                      <span className="text-xs text-gray-400">22 - 29 nov</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Dues</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">230.0</span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                              <path d="M6 2l4 4H7v4H5V6H2l4-4z"/>
                            </svg>
                            <span className="text-sm text-green-500">+124%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Pending Orders</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">102</span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 12 12">
                              <path d="M6 10L2 6h3V2h2v4h3l-4 4z"/>
                            </svg>
                            <span className="text-sm text-red-500">-56%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sales & Discount */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Tag className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Sales & Discount</h3>
                      </div>
                      <span className="text-xs text-gray-400">22 - 29 nov 2025</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Sales</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">1000.0</span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                              <path d="M6 2l4 4H7v4H5V6H2l4-4z"/>
                            </svg>
                            <span className="text-sm text-green-500">+24%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Discount</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">210.00</span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 12 12">
                              <path d="M6 10L2 6h3V2h2v4h3l-4 4z"/>
                            </svg>
                            <span className="text-sm text-red-500">-12%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Below */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Units sold</h3>
                  
                  {/* Chart */}
                  <div className="relative h-80">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 text-xs text-gray-400">350</div>
                    <div className="absolute left-0 top-1/4 text-xs text-gray-400">300</div>
                    <div className="absolute left-0 top-2/4 text-xs text-gray-400">250</div>
                    <div className="absolute left-0 top-3/4 text-xs text-gray-400">200</div>
                    <div className="absolute left-0 bottom-8 text-xs text-gray-400">150</div>
                    <div className="absolute left-0 bottom-4 text-xs text-gray-400">100</div>
                    <div className="absolute left-0 bottom-0 text-xs text-gray-400">50</div>
                    <div className="absolute left-0 -bottom-4 text-xs text-gray-400">0</div>

                    {/* Chart area */}
                    <div className="ml-8 mr-4 h-72 relative">
                      <svg className="w-full h-full" viewBox="0 0 400 280">
                        {/* Grid lines */}
                        <defs>
                          <pattern id="grid" width="57" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 57 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Blue line */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          points="0,165 57,120 114,90 171,140 228,125 285,165 342,195"
                        />
                        
                        {/* Yellow line */}
                        <polyline
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          points="0,100 57,80 114,56 171,130 228,90 285,80 342,70"
                        />
                        
                        {/* Green line */}
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          points="0,230 57,140 114,91 171,235 228,165 285,205 342,185"
                        />
                        
                        {/* Data points */}
                        {chartData.map((point, index) => (
                          <g key={index}>
                            <circle cx={index * 57} cy={280 - (point.blue * 280 / maxValue)} r="4" fill="#3b82f6" />
                            <circle cx={index * 57} cy={280 - (point.yellow * 280 / maxValue)} r="4" fill="#fbbf24" />
                            <circle cx={index * 57} cy={280 - (point.green * 280 / maxValue)} r="4" fill="#10b981" />
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 ml-8 mr-4">
                      {chartData.map((point, index) => (
                        <span key={index} className="text-xs text-gray-400">{point.month}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </>
  )
}

export default page
