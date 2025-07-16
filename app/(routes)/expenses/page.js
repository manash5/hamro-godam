"use client"

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Download, TrendingDown, Package, Truck, Zap, CreditCard, Building } from 'lucide-react';
import Sidebar from '@/components/sidebar';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 430, category: 'Shopping', description: 'Inventory Purchase', date: '2025-02-17', icon: Package },
    { id: 2, amount: 670, category: 'Travel', description: 'Supplier Visit', date: '2025-02-13', icon: Truck },
    { id: 3, amount: 200, category: 'Electricity Bill', description: 'Warehouse Utilities', date: '2025-02-11', icon: Zap },
    { id: 4, amount: 600, category: 'Loan Repayment', description: 'Equipment Financing', date: '2025-02-10', icon: CreditCard },
    { id: 5, amount: 850, category: 'Warehouse Rent', description: 'Monthly Rent', date: '2025-01-12', icon: Building },
    { id: 6, amount: 320, category: 'Shopping', description: 'Office Supplies', date: '2025-01-14', icon: Package },
    { id: 7, amount: 180, category: 'Travel', description: 'Client Meeting', date: '2025-01-10', icon: Truck },
    { id: 8, amount: 720, category: 'Shopping', description: 'Raw Materials', date: '2025-01-11', icon: Package }
  ]);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Shopping',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    { name: 'Shopping', icon: Package },
    { name: 'Travel', icon: Truck },
    { name: 'Electricity Bill', icon: Zap },
    { name: 'Loan Repayment', icon: CreditCard },
    { name: 'Warehouse Rent', icon: Building }
  ];

  // Generate chart data dynamically from expenses
  const chartData = expenses.reduce((acc, expense) => {
    // Group by date (YYYY-MM-DD)
    const found = acc.find(item => item.date === expense.date);
    if (found) {
      found.amount += expense.amount;
    } else {
      acc.push({ date: expense.date, amount: expense.amount });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(item => ({
      // Format date for chart label (e.g., 2nd Jan)
      date: (() => {
        const dateObj = new Date(item.date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
        const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                      day === 2 || day === 22 ? 'nd' :
                      day === 3 || day === 23 ? 'rd' : 'th';
        return `${day}${suffix} ${month}`;
      })(),
      amount: item.amount
    }));

  const addExpense = () => {
    if (newExpense.amount && newExpense.description) {
      const categoryObj = categories.find(cat => cat.name === newExpense.category);
      const expense = {
        id: Date.now(),
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        description: newExpense.description,
        date: newExpense.date,
        icon: categoryObj.icon
      };

      setExpenses([expense, ...expenses]);
      setNewExpense({
        amount: '',
        category: 'Shopping',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                   day === 2 || day === 22 ? 'nd' : 
                   day === 3 || day === 23 ? 'rd' : 'th';
    
    return `${day}${suffix} ${month} ${year}`;
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 overflow-auto pt-5">
        
        {/* Expense Overview Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Expense Overview</h1>
              <p className="text-gray-600">Track your spending trends over time and gain insights into where your money goes.</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>

          {/* Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 1000]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value) => [`$${value}`, 'Amount']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  fill="url(#colorGradient)"
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Expenses Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">All Expenses</h2>
          </div>

          {/* Expenses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expenses.map(expense => {
              const IconComponent = expense.icon;
              return (
                <div key={expense.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{expense.category}</h3>
                      <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                      <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-red-600">
                    <span className="text-lg font-semibold">- ${expense.amount}</span>
                    <TrendingDown className="w-4 h-4 ml-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Add New Expense</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={addExpense}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Expense
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;