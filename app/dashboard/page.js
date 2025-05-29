import React from 'react'
import Sidebar from '../components/sidebar'
import {Search, ShoppingBag, Users, Package, TrendingUp, RefreshCw,  CheckCircle, Tag } from 'lucide-react'

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
  return (
    <>
    <div className="main w-full min-h-screen bg-slate-900 flex text-black">
        <Sidebar />
        <div className="right-side w-full min-h-screen bg-slate-200 flex flex-col items-center justify-between" >
          {/* <div className="search-bar w-[90%] flex mt-10 mb-5 justtify-between items-center  rounded-xl p-2 bg-white ">
            <Search className='text-black'/>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full p-2 focus:border-none text-black px-4"
            />
          </div> */}
          <div className="middle-section text-black flex ">
              <div className="min-w-xl mx-auto p-5 bg-slate-200">
                <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Products</h2>
                  
                  <div className="space-y-4 overflow-y-auto max-h-[55vh]">
                    {products.map((product, index) => (
                      <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Product Image Placeholder */}
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                              {product.image}
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                {product.name}
                              </h3>
                              <div className="flex items-center space-x-3">
                                <span className="text-xl font-bold text-blue-500">
                                  {product.price}
                                </span>
                                <div className="flex items-center">
                                  {renderStars(product.rating)}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Sales Info */}
                          <div className="flex items-center space-x-2 text-gray-600">
                            <div className="bg-blue-200 p-2 rounded-full">
                              <ShoppingBag className="w-6 h-6 " />
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{product.sold}</div>
                              <div className="text-sm text-gray-500">Sold</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            <div className="p-4 bg-gray-200 h-auto">
              <div className="max-w-6xl mx-auto">
                
                {/* Stats Cards Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {/* Customers */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm ">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">30,567</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Customers</span>
                      <span className="text-red-500 text-sm font-medium">-5%</span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">3,037</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Products</span>
                      <span className="text-green-500 text-sm font-medium">+18%</span>
                    </div>
                  </div>

                  {/* Sales */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">205,09</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Sales</span>
                      <span className="text-green-500 text-sm font-medium">+33%</span>
                    </div>
                  </div>

                  {/* Refunds */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <RefreshCw className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">21,647</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Refunds</span>
                      <span className="text-red-500 text-sm font-medium">-12%</span>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-2 gap-6">
                  
                  {/* Left Side - Budget vs Expenses Chart */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div>
                        <span className="text-sm font-medium text-gray-700">Budget</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                        <span className="text-sm font-medium text-gray-700">Expenses</span>
                      </div>
                    </div>
                    
                    {/* Custom Bar Chart */}
                    <div className="relative h-80">
                      <div className="absolute right-0 top-0 text-xs text-gray-400">0.8M</div>
                      <div className="absolute right-0 top-1/2 text-xs text-gray-400">0.6M</div>
                      
                      <div className="flex items-end justify-between h-full pt-8 pb-8 relative">
                        {budgetExpensesData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center w-8">
                            <div className="relative flex flex-col items-center justify-end" style={{ height: '240px' }}>
                              {/* Budget Bar */}
                              <div 
                                className="w-6 bg-cyan-500 mb-1"
                                style={{ height: `${data.budget}%` }}
                              ></div>
                              {/* Expenses Bar */}
                              <div 
                                className="w-6 bg-gray-700"
                                style={{ height: `${data.expenses}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                              {data.month}
                            </span>
                          </div>
                        ))}
                        
                        {/* Red trend line overlay */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '32px', height: '240px' }}>
                          <path
                            d={linePath}
                            stroke="#ef4444"
                            strokeWidth="3"
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                          />
                          {lineValues.map((value, index) => (
                            <circle
                              key={index}
                              cx={`${(index / (lineValues.length - 1)) * 100}%`}
                              cy={`${100 - value}%`}
                              r="4"
                              fill="#ef4444"
                            />
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="space-y-6">
                    
                    {/* Earnings Chart */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-semibold text-teal-800 mb-1">Earnings</h3>
                          <p className="text-sm text-teal-600">Monthly revenue</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-teal-900">$50,922</div>
                        </div>
                      </div>
                      
                      {/* Custom Earnings Bar Chart */}
                      <div className="flex items-end justify-between h-32 space-x-2">
                        {earningsData.map((height, index) => (
                          <div
                            key={index}
                            className="bg-teal-600 rounded-t-lg flex-1"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Yearly Sales with Pie Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-gray-900 mb-1">$239,228</div>
                          <p className="text-sm text-gray-600">Yearly sales</p>
                        </div>
                        
                        {/* Custom Donut Chart */}
                        <div className="relative w-24 h-24">
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="36"
                              stroke="#3b82f6"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray="56.5 226"
                              strokeDashoffset="0"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="36"
                              stroke="#ec4899"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray="45.2 226"
                              strokeDashoffset="-56.5"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="36"
                              stroke="#f59e0b"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray="33.9 226"
                              strokeDashoffset="-101.7"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="36"
                              stroke="#10b981"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray="33.9 226"
                              strokeDashoffset="-135.6"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="36"
                              stroke="#374151"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray="56.5 226"
                              strokeDashoffset="-169.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
         <div className="p-6 bg-gray-200">
          <div className="min-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              
              {/* Customer & Expenses Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-start gap-5 ">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Customer & Expenses</h3>
                </div>
                <div className="flex justify-end px-10">
                <span className="text-xs text-gray-400 mb-5 ">22 - 29 nov 2025</span>
                </div>

                <div className="space-y-6 my-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <span className="text-gray-700 font-medium">Customer Growth</span>
                      <span className="text-lg font-semibold text-gray-900">175.00</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 2l4 4H7v4H5V6H2l4-4z"/>
                      </svg>
                      <span className="text-sm font-medium text-green-500">+124%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <span className="text-gray-700 font-medium">Expenses</span>
                      <span className="text-lg font-semibold text-gray-900">10.00</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 10L2 6h3V2h2v4h3l-4 4z"/>
                      </svg>
                      <span className="text-sm font-medium text-red-500">-56%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dues & Pending Orders Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-start gap-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Dues & Pending Orders</h3>
                </div>
                <div className="flex justify-end px-10">
                  <span className="text-xs text-gray-400 mb-5 ">22 - 29 nov 2025</span>
                </div>

                <div className="space-y-6 my-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <span className="text-gray-700 font-medium">Dues</span>
                      <span className="text-lg font-semibold text-gray-900">230.00</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 2l4 4H7v4H5V6H2l4-4z"/>
                      </svg>
                      <span className="text-sm font-medium text-green-500">+124%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <span className="text-gray-700 font-medium">Pending Orders</span>
                      <span className="text-lg font-semibold text-gray-900">102</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 10L2 6h3V2h2v4h3l-4 4z"/>
                      </svg>
                      <span className="text-sm font-medium text-red-500">-56%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales & Discount Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-start gap-5 ">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Tag className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Sales & Discount</h3>
                </div>
                <div className="flex justify-end px-10">
                  <span className="text-xs text-gray-400 mb-5 ">22 - 29 nov 2025</span>
                </div>

                <div className="space-y-6 my-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <span className="text-gray-700 font-medium">Sales</span>
                      <span className="text-lg font-semibold text-gray-900">1000.00</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 2l4 4H7v4H5V6H2l4-4z"/>
                      </svg>
                      <span className="text-sm font-medium text-green-500">+24%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <span className="text-gray-700 font-medium">Discount</span>
                      <span className="text-lg font-semibold text-gray-900">210.00</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 10L2 6h3V2h2v4h3l-4 4z"/>
                      </svg>
                      <span className="text-sm font-medium text-red-500">-12%</span>
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
