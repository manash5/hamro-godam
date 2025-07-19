"use client"
import React, { useState, useEffect } from 'react'
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
  Store, 
  BookUser,
  Trello, 
  NotebookText,
  LogOut,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import LogoutManager from '@/utils/logout';
import TokenManager from '@/utils/tokenManager';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');

  // Get user info from localStorage (admin only)
  useEffect(() => {
    const updateUserInfo = () => {
      const name = localStorage.getItem('admin');
      const email = localStorage.getItem('adminEmail');
      if (name) {
        setUserName(name);
      }
      if (email) {
        setUserEmail(email);
      }
    };

    // Update immediately
    updateUserInfo();

    // Also listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'admin') {
        setUserName(e.newValue || 'User');
      }
      if (e.key === 'adminEmail') {
        setUserEmail(e.newValue || 'user@example.com');
      }
    };

    // Also check for user changes on focus (in case localStorage was updated in another tab)
    const handleFocus = () => {
      const name = localStorage.getItem('admin');
      const email = localStorage.getItem('adminEmail');
      if (name && name !== userName) {
        setUserName(name);
      }
      if (email && email !== userEmail) {
        setUserEmail(email);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userName, userEmail]);

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Store, label: 'Inventory', path: '/inventory' },
  { icon: Package, label: 'Orders', path: '/orders' },
  { icon: ShoppingCart, label: 'Products', path: '/products' },
  { icon: BookUser, label: 'Suppliers', path: '/suppliers' },
  { icon: User, label: 'User', path: '/users' },
  { icon: Receipt, label: 'Expenses', path: '/expenses' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },

  { icon: Trello, label: 'kanban', path: '/kanban' }, 
  {icon: NotebookText, label: 'Assign Task', path: '/task'},

  { icon: Settings, label: 'Settings', path: '/settings' },
];

  // Get the active item based on current pathname
  const getActiveItem = () => {
    const item = sidebarItems.find(item => item.path === pathname);
    return item ? item.label : 'Dashboard';
  };

  const handleItemClick = (label, path) => {
    router.push(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    LogoutManager.logoutFromCurrentPage();
  };

  return (
    <div className="p-4 h-screen bg-slate-100">
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

      {/* User Profile Section - Moved to top */}
      <div className="px-4 mb-6">
        <div className={`flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">{userName.charAt(0).toUpperCase()}</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{userEmail}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2 flex-1">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(item.label, item.path)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 ease-in-out group relative ${
              pathname === item.path
                ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/20 border border-blue-500/40 text-blue-300'
                : 'hover:bg-gray-800/50 text-gray-300 hover:text-white border border-transparent'
            }`}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${
              pathname === item.path 
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

      {/* Logout Button - At the bottom */}
      <div className="px-4 mb-6">
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 ease-in-out group hover:bg-red-600/20 text-gray-300 hover:text-red-300 border border-transparent hover:border-red-500/40 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:text-red-400 transition-colors duration-300" />
          
          <span className={`font-medium transition-all duration-300 ease-in-out whitespace-nowrap ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100'
          }`}>
            Logout
          </span>

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
    </div>
  );
}

export default Sidebar;