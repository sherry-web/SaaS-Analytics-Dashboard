import React, { useState } from 'react';
import { LayoutDashboard, FileText, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface SidebarNavigationProps {
  activeRoute?: string;
  onNavigate?: (route: string) => void;
  className?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    href: '/reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings'
  }
];

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeRoute = 'dashboard',
  onNavigate,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavClick = (item: NavigationItem) => {
    onNavigate?.(item.id);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} 
                 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Navigation
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 
                   dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 
                   transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2" role="menubar">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left 
                         transition-colors duration-200 group ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
              role="menuitem"
              aria-current={isActive ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon 
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                }`}
                aria-hidden="true"
              />
              {!isCollapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div 
                  className="absolute left-0 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer (optional) */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            DataSight Pro v1.0
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarNavigation;