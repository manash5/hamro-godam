"use client"
import React, { useState } from 'react'
import Logo from './Logo' 
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  User, 
  Settings, 
  Receipt, 
  Calendar,
  ChevronLeft,
} from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Package, label: 'Inventory' },
    { icon: ShoppingCart, label: 'Products' },
    { icon: User, label: 'User' },
    { icon: Settings, label: 'Settings' },
    { icon: Receipt, label: 'Expenses' },
    { icon: Calendar, label: 'Calendar' },
  ];

  const handleItemClick = (label) => {
    if (activeItem === label) return;
    setActiveItem(label);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="p-4 h-screen bg-slate-200">
    <div className={`bg-[#011129] text-white h-full rounded-2xl transition-all duration-300 ease-in-out overflow-hidden shadow-xl ${
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      }`}>
      {/* Header with Logo and Toggle Button */}
      <div className="flex items-center justify-between my-10 px-5">
        <div className="logo flex items-center space-x-2">
          <Logo/>
          {isCollapsed? <h1 className="text-sm font-bold text-primary-500 opacity-0 display-none">Hamro Godam</h1> :<h1 className="text-xl font-bold text-primary-500">Hamro Godam</h1>}
          
        </div>
        
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 ease-in-out"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200" />
          </button>
        )}
      </div>

      {/* Collapse button when sidebar is collapsed */}
      {isCollapsed && (
        <div className="px-5 mb-6">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 ease-in-out rotate-180"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200" />
          </button>
        </div>
      )}

      <div className="bottom-6 left-0 right-0 px-4 mb-10">
          <div className={`flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">U</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">User Name</p>
                <p className="text-xs text-gray-400 truncate">user@example.com</p>
              </div>
            )}
          </div>
        </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(item.label)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 ease-in-out group relative ${
              activeItem === item.label
                ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/20 border border-blue-500/40 text-blue-300'
                : 'hover:bg-gray-800/50 text-gray-300 hover:text-white border border-transparent'
            }`}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${
              activeItem === item.label 
                ? 'text-blue-400' 
                : 'group-hover:text-blue-400'
            } transition-colors duration-300`} />
            
            <span className={`font-medium transition-all duration-300 ease-in-out whitespace-nowrap ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100'
            }`}>
              {item.label}
            </span>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>
    </div>
    </div>
  );
}

export default Sidebar;