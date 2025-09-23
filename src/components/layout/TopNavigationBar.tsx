import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, Sun, Moon, X } from 'lucide-react';
import "../Dashboard/styles/TopNav.css";

interface UserMenuOption {
  label: string;
  href: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const TopNavigationBar: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const userMenuOptions: UserMenuOption[] = [
    { label: 'Profile', href: '#profile', icon: <User size={16} /> },
    { label: 'Settings', href: '#settings', icon: <User size={16} /> },
    { label: 'Sign out', href: '#logout', icon: <User size={16} /> }
  ];

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('datasight-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDarkMode(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('datasight-theme', newDarkMode ? 'dark' : 'light');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) &&
          mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key for menus
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isUserMenuOpen) {
          setIsUserMenuOpen(false);
          userMenuRef.current?.querySelector('button')?.focus();
        }
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          mobileMenuButtonRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isUserMenuOpen, isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // Implement search functionality
  };

  const handleUserMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsUserMenuOpen(!isUserMenuOpen);
    } else if (e.key === 'ArrowDown' && isUserMenuOpen) {
      e.preventDefault();
      const firstMenuItem = userMenuRef.current?.querySelector('a') as HTMLElement;
      firstMenuItem?.focus();
    }
  };

  const handleMobileMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  return (
    <header className="top-navigation-bar">
      <nav className="top-nav-container" aria-label="Main navigation">
        {/* Left: Logo and Mobile Menu Button */}
        <div className="top-nav-section top-nav-left">
          <button
            ref={mobileMenuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onKeyDown={handleMobileMenuKeyDown}
            className="top-nav-mobile-menu-button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="top-nav-logo">
            <div className="top-nav-logo-icon">DS</div>
            <span className="top-nav-logo-text">DataSight Pro</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="top-nav-section top-nav-center">
          <form onSubmit={handleSearch} className="top-nav-search-form">
            <div className="top-nav-search-container">
              <Search className="top-nav-search-icon" size={16} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search analytics, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="top-nav-search-input"
                aria-label="Search dashboard"
              />
            </div>
          </form>
        </div>

        {/* Right: Actions and User Menu */}
        <div className="top-nav-section top-nav-right">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="top-nav-button"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button
            className="top-nav-button top-nav-notification-button"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="top-nav-notification-badge">3</span>
          </button>

          {/* User Menu */}
          <div className="top-nav-user-menu-container" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              onKeyDown={handleUserMenuKeyDown}
              className="top-nav-user-button"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <div className="top-nav-user-avatar">
                <User size={16} />
              </div>
              <span className="top-nav-user-name">John Doe</span>
            </button>

            {isUserMenuOpen && (
              <div 
                className="top-nav-user-dropdown"
                role="menu"
                aria-label="User options"
              >
                {userMenuOptions.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    className="top-nav-user-menu-item"
                    role="menuitem"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      option.onClick?.();
                      setIsUserMenuOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        option.onClick?.();
                        setIsUserMenuOpen(false);
                      }
                    }}
                  >
                    {option.icon && (
                      <span className="top-nav-menu-item-icon" aria-hidden="true">
                        {option.icon}
                      </span>
                    )}
                    {option.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="top-nav-mobile-menu"
          role="menu"
          aria-label="Mobile navigation"
        >
          <div className="top-nav-mobile-search">
            <Search className="top-nav-mobile-search-icon" size={16} />
            <input
              type="search"
              placeholder="Search analytics, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="top-nav-mobile-search-input"
              aria-label="Search"
            />
          </div>
          
          <div className="top-nav-mobile-actions">
            {userMenuOptions.map((option) => (
              <a
                key={option.label}
                href={option.href}
                className="top-nav-mobile-menu-item"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  option.onClick?.();
                  setIsMobileMenuOpen(false);
                }}
              >
                {option.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNavigationBar;