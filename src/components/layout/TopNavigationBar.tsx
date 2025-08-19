import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User } from 'lucide-react';

interface TopNavigationBarProps {
  notificationCount?: number;
  userName?: string;
  onSearch?: (query: string) => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  notificationCount = 3,
  userName = "John Doe",
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <nav 
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3"
      role="navigation"
      aria-label="Top navigation"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DS</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
              DataSight Pro
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-4 md:mx-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search dashboards, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         placeholder-gray-500 dark:placeholder-gray-400"
                aria-label="Search"
              />
            </div>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} new)` : ''}`}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 
                         flex items-center justify-center font-medium"
                aria-label={`${notificationCount} unread notifications`}
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 
                       hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 
                       rounded-lg transition-colors"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden md:block text-sm font-medium">{userName}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 
                         dark:border-gray-700 rounded-lg shadow-lg z-50"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                    Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                    Settings
                  </a>
                  <hr className="border-gray-200 dark:border-gray-600" />
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigationBar;