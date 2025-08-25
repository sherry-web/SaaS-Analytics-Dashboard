import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Home,
  TrendingUp,
  Warehouse
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: NavItem[];
}

const SidebarNavigation: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
  const [activeItem, setActiveItem] = useState('overview');
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const itemRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

  // Simplified navigation structure for enterprise/warehouse users
  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      children: [
        { id: 'overview', label: 'Overview', icon: BarChart3, href: '/dashboard' },
        { id: 'metrics', label: 'Key Metrics', icon: TrendingUp, href: '/dashboard/metrics' },
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      children: [
        { id: 'weekly', label: 'Weekly Reports', icon: FileText, href: '/reports/weekly' },
        { id: 'monthly', label: 'Monthly Reports', icon: FileText, href: '/reports/monthly' },
        { id: 'custom', label: 'Custom Reports', icon: FileText, href: '/reports/custom' },
      ]
    },
    {
      id: 'warehouses',
      label: 'Warehouses',
      icon: Warehouse,
      children: [
        { id: 'inventory', label: 'Inventory', icon: Warehouse, href: '/warehouses/inventory' },
        { id: 'shipments', label: 'Shipments', icon: TrendingUp, href: '/warehouses/shipments' },
        { id: 'capacity', label: 'Capacity', icon: BarChart3, href: '/warehouses/capacity' },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings'
    }
  ];

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, item: NavItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (item.children && item.children.length > 0) {
        toggleSection(item.id);
      } else {
        setActiveItem(item.id);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateToNextItem(item.id, 'down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateToNextItem(item.id, 'up');
    }
  };

  const navigateToNextItem = (currentId: string, direction: 'up' | 'down') => {
    // Flatten the navigation structure for keyboard navigation
    const flatItems: {id: string, level: number}[] = [];
    
    const flattenItems = (items: NavItem[], currentLevel: number) => {
      items.forEach(item => {
        flatItems.push({id: item.id, level: currentLevel});
        if (item.children && expandedSections.includes(item.id)) {
          flattenItems(item.children, currentLevel + 1);
        }
      });
    };
    
    flattenItems(navigationItems, 0);
    
    const currentIndex = flatItems.findIndex(item => item.id === currentId);
    if (currentIndex === -1) return;
    
    let nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = flatItems.length - 1;
    if (nextIndex >= flatItems.length) nextIndex = 0;
    
    const nextItem = flatItems[nextIndex];
    setFocusedItem(nextItem.id);
    itemRefs.current[nextItem.id]?.focus();
  };

  // Set focus when focusedItem changes
  useEffect(() => {
    if (focusedItem && itemRefs.current[focusedItem]) {
      itemRefs.current[focusedItem]?.focus();
    }
  }, [focusedItem]);

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedSections.includes(item.id);
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="mb-1">
        <button
          ref={(el: HTMLButtonElement | null) => {
            itemRefs.current[item.id] = el;
          }}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              setActiveItem(item.id);
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, item)}
          className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors duration-200 min-h-[44px] ${
            isActive 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          } ${level > 0 ? 'ml-4' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800`}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={isCollapsed ? item.label : undefined}
          aria-current={isActive ? 'page' : undefined}
          role="menuitem"
          tabIndex={focusedItem === item.id ? 0 : -1}
        >
          <item.icon size={18} className="mr-3 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {hasChildren && (
                <div className="ml-2">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              )}
            </>
          )}
        </button>

        {hasChildren && isExpanded && !isCollapsed && item.children && (
          <div className="mt-1 ml-4 space-y-1" role="menu">
            {item.children.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out fixed lg:static top-16 left-0 bottom-0 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      role="complementary"
      aria-label="Main navigation"
    >
      <div className="p-4 h-full overflow-y-auto">
        {/* Collapse Toggle */}
        <div className="hidden lg:flex justify-end mb-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 min-h-[44px]"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2" role="menubar" aria-label="Main navigation">
          {navigationItems.map(item => renderNavItem(item))}
        </nav>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Upgrade to Pro
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                Get advanced analytics and unlimited reports
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 dark:focus:ring-offset-blue-900 min-h-[44px]">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarNavigation;