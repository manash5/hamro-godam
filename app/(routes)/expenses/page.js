"use client"

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Download, TrendingDown, Package, Truck, Zap, CreditCard, Building } from 'lucide-react';
import Sidebar from '@/components/sidebar';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showAddForm, setShowAddForm] = useState(false);

  // Remove the categories array since we're using free text input now

  // Fetch expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please log in to view expenses');
          setLoading(false);
          return;
        }

        // First, automatically generate salary expenses
        try {
          const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          };

          const salaryRes = await fetch('/api/expense', {
            method: 'PUT',
            headers,
          });

          if (salaryRes.ok) {
            console.log('Salary expenses generated automatically');
          } else {
            console.log('No salary expenses to generate or error occurred');
          }
        } catch (salaryErr) {
          console.log('Error generating salary expenses:', salaryErr);
        }
        
        // Then fetch all expenses (including newly generated ones)
        const res = await fetch('/api/expense', {
          method: 'GET',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) {
          setExpenses(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch expenses');
        }
      } catch (err) {
        setError('Failed to fetch expenses');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Map backend fields to UI fields
  const mapExpenseToUI = (expense) => {
    // Use a default icon for all categories since we don't have predefined categories anymore
    const getIconForCategory = (category) => {
      const categoryLower = category.toLowerCase();
      if (categoryLower.includes('travel') || categoryLower.includes('transport')) return Truck;
      if (categoryLower.includes('electricity') || categoryLower.includes('power')) return Zap;
      if (categoryLower.includes('loan') || categoryLower.includes('credit')) return CreditCard;
      if (categoryLower.includes('rent') || categoryLower.includes('warehouse')) return Building;
      if (categoryLower.includes('shopping') || categoryLower.includes('purchase')) return Package;
      return Package; // Default icon
    };

    return {
      id: expense._id || expense.id || Math.random().toString(36).substr(2, 9), // Fallback to random string if no ID
      amount: expense.amount,
      category: expense.type,
      description: expense.description,
      date: expense.date,
      icon: getIconForCategory(expense.type)
    };
  };

  // Generate chart data dynamically from expenses
  const chartData = expenses
    .map(mapExpenseToUI)
    .reduce((acc, expense) => {
      // Normalize date to YYYY-MM-DD format for consistent comparison
      const dateStr = new Date(expense.date).toISOString().split('T')[0];
      console.log('Processing expense:', { date: expense.date, normalizedDate: dateStr, amount: expense.amount });
      
      const found = acc.find(item => item.date === dateStr);
      if (found) {
        found.amount += expense.amount;
        console.log('Added to existing date:', dateStr, 'New total:', found.amount);
      } else {
        acc.push({ date: dateStr, amount: expense.amount });
        console.log('Created new date entry:', dateStr, 'Amount:', expense.amount);
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date))
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

  console.log('Final chart data:', chartData);

  // Calculate dynamic Y-axis domain
  const maxAmount = chartData.length > 0 ? Math.max(...chartData.map(item => item.amount)) : 1000;
  const yAxisDomain = [0, Math.ceil(maxAmount * 1.2)]; // Add 20% padding

  // Add expense via API
  const addExpense = async () => {
    if (!newExpense.amount || !newExpense.description || !newExpense.category) {
      alert('Please fill in all required fields: Amount, Category, and Description');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in first to add expenses');
      return;
    }
      
      const expensePayload = {
        type: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        date: newExpense.date,
        createdBy: 'admin' 
      };
      try {
        console.log('Token from localStorage:', token);
        
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
        console.log('Request headers:', headers);
        
        const res = await fetch('/api/expense', {
          method: 'POST',
          headers,
          body: JSON.stringify(expensePayload)
        });
        
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        let data;
        try {
          const responseText = await res.text();
          console.log('Response text:', responseText);
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          alert('Server returned invalid response. Check console for details.');
          return;
        }
        
        if (res.ok) {
          // Add the new expense to the list
          setExpenses([data.data, ...expenses]);
          setNewExpense({
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0]
          });
          setShowAddForm(false);
        } else {
          alert(data.message || data.error || 'Failed to add expense');
        }
      } catch (err) {
        console.error('Error adding expense:', err);
        alert('Failed to add expense: ' + err.message);
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
            {chartData.length > 0 ? (
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
                    domain={yAxisDomain}
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">No expenses yet</p>
                  <p className="text-sm">Add your first expense to see the chart</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* All Expenses Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">All Expenses</h2>
          </div>
          {/* Expenses Grid */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading expenses...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {expenses.map((expense, index) => {
                const mapped = mapExpenseToUI(expense);
                const IconComponent = mapped.icon;
                return (
                  <div key={mapped.id || `expense-${index}`} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{mapped.category}</h3>
                        <p className="text-sm text-gray-500">{formatDate(mapped.date)}</p>
                        <p className="text-sm text-gray-600 mt-1">{mapped.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-red-600">
                      <span className="text-lg font-semibold">- ${mapped.amount}</span>
                      <TrendingDown className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                  <input
                    type="text"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter category"
                  />
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