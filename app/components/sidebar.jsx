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
    <div className={`bg-[#011129] text-white min-h-full transition-all duration-300 ease-in-out overflow-hidden ${
      isCollapsed ? 'w-[80px]' : 'w-[20%]'
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
  );
}

export default Sidebar;