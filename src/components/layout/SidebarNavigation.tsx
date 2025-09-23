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
import "../Dashboard/styles/Sidebar.css";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: NavItem[];
}

interface SidebarNavigationProps {
  /** Callback when sidebar is closed on mobile */
  onMobileClose?: () => void;
  /** Whether the sidebar is collapsed (desktop) */
  isCollapsed?: boolean;
  /** Callback when collapse toggle is requested */
  onToggleCollapse?: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  onMobileClose,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
  const [activeItem, setActiveItem] = useState('overview');
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const itemRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

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

  const handleKeyDown = (e: React.KeyboardEvent, item: NavItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (item.children && item.children.length > 0) {
        toggleSection(item.id);
      } else {
        setActiveItem(item.id);
        onMobileClose?.();
        setIsMobileOpen(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateToNextItem(item.id, 'down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateToNextItem(item.id, 'up');
    } else if (e.key === 'Escape') {
      onMobileClose?.();
      setIsMobileOpen(false);
    }
  };

  const navigateToNextItem = (currentId: string, direction: 'up' | 'down') => {
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
      <div key={item.id} className="sidebar-nav-item">
        <button
          ref={(el: HTMLButtonElement | null) => {
            itemRefs.current[item.id] = el;
          }}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              setActiveItem(item.id);
              onMobileClose?.();
              setIsMobileOpen(false);
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, item)}
          className={`sidebar-nav-button ${isActive ? 'sidebar-nav-button--active' : ''} sidebar-nav-button--level-${level}`}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={isCollapsed ? item.label : undefined}
          aria-current={isActive ? 'page' : undefined}
          role="menuitem"
          tabIndex={focusedItem === item.id ? 0 : -1}
        >
          <item.icon size={18} className="sidebar-nav-icon" aria-hidden="true" />
          {!isCollapsed && (
            <>
              <span className="sidebar-nav-label">{item.label}</span>
              {hasChildren && (
                <div className="sidebar-nav-chevron" aria-hidden="true">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              )}
            </>
          )}
        </button>

        {hasChildren && isExpanded && !isCollapsed && item.children && (
          <div className="sidebar-nav-children" role="menu">
            {item.children.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`sidebar-overlay ${isMobileOpen ? 'sidebar-overlay--visible' : ''}`} 
           onClick={() => {
             setIsMobileOpen(false);
             onMobileClose?.();
           }}
           aria-hidden="true"
      />
      
      <aside
        className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''} ${isMobileOpen ? 'sidebar--mobile-open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">DS</div>
              {!isCollapsed && (
                <span className="sidebar-logo-text">DataSight Pro</span>
              )}
            </div>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="sidebar-toggle"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!isCollapsed}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>

          <nav className="sidebar-nav" role="menubar" aria-label="Main navigation">
            {navigationItems.map(item => renderNavItem(item))}
          </nav>

          {!isCollapsed && (
            <div className="sidebar-footer">
              <div className="sidebar-upgrade">
                <h4 className="sidebar-upgrade-title">Upgrade to Pro</h4>
                <p className="sidebar-upgrade-description">
                  Get advanced analytics and unlimited reports
                </p>
                <button className="sidebar-upgrade-button">
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SidebarNavigation;