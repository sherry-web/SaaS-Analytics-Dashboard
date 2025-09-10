import React, { useState, useRef, useEffect } from 'react';
import { Settings, Download, Image, Copy, Trash2 } from 'lucide-react';
import { Input } from '../../ui/Input';
import type { WidgetSettings } from './WidgetSettings';

/**
 * Props for the WidgetSettingsMenu component
 */
interface WidgetSettingsMenuProps {
  /** Type of widget this menu controls */
  widgetType: string;
  /** Current settings object */
  currentSettings: WidgetSettings;
  /** Callback when settings are changed */
  onSettingsChange: (settings: WidgetSettings) => void;
  /** Callback when export is requested */
  onExport: (format: 'csv' | 'png') => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Configuration for individual setting controls
 */
interface SettingConfig {
  key: keyof WidgetSettings;
  label: string;
  type: 'select' | 'number' | 'checkbox';
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Widget settings menu with export options and configuration controls
 * Provides accessible settings management for dashboard widgets
 */
const WidgetSettingsMenu: React.FC<WidgetSettingsMenuProps> = ({
  widgetType,
  onSettingsChange,
  onExport,
  currentSettings,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (): void => {
    setIsOpen(!isOpen);
  };

  const handleClose = (): void => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleSettingChange = (key: keyof WidgetSettings, value: unknown): void => {
    if (typeof onSettingsChange !== 'function') return;

    // Validate numeric inputs
    if (key === 'refreshInterval' || key === 'pageSize') {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) return;
    }

    onSettingsChange({
      ...currentSettings,
      [key]: value
    });
  };

  const handleExportClick = (format: 'csv' | 'png'): void => {
    if (typeof onExport === 'function') {
      onExport(format);
    }
    handleClose();
  };

  const handleDuplicate = (): void => {
    console.log(`Duplicating ${widgetType} widget`);
    handleClose();
  };

  const handleDelete = (): void => {
    console.log(`Deleting ${widgetType} widget`);
    handleClose();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus first menu item when opened
      setTimeout(() => firstMenuItemRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Focus trap for menu items
  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const focusableElements = menuRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
          }
        }
      }
    }
  };

  const getAvailableSettings = (): SettingConfig[] => {
    const baseSettings: SettingConfig[] = [
      {
        key: 'refreshInterval',
        label: 'Refresh Interval (seconds)',
        type: 'number',
        min: 5,
        max: 3600,
        step: 5
      },
      {
        key: 'colorScheme',
        label: 'Color Scheme',
        type: 'select',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' },
          { label: 'Purple', value: 'purple' }
        ]
      }
    ];

    switch (widgetType) {
      case 'kpi':
        return [
          ...baseSettings,
          {
            key: 'displayMode',
            label: 'Display Mode',
            type: 'select',
            options: [
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Compact', value: 'compact' }
            ]
          }
        ];

      case 'table':
        return [
          ...baseSettings,
          {
            key: 'density',
            label: 'Density',
            type: 'select',
            options: [
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Compact', value: 'compact' }
            ]
          },
          {
            key: 'pageSize',
            label: 'Page Size',
            type: 'number',
            min: 5,
            max: 100,
            step: 5
          }
        ];

      case 'linechart':
        return [
          ...baseSettings,
          {
            key: 'chartType',
            label: 'Chart Type',
            type: 'select',
            options: [
              { label: 'Standard', value: 'standard' },
              { label: 'Smooth', value: 'smooth' }
            ]
          }
        ];

      case 'barchart':
        return [
          ...baseSettings,
          {
            key: 'chartType',
            label: 'Chart Type',
            type: 'select',
            options: [
              { label: 'Standard', value: 'standard' },
              { label: 'Stacked', value: 'stacked' }
            ]
          }
        ];

      default:
        return baseSettings;
    }
  };

  const renderSettingInput = (setting: SettingConfig) => {
    const value = currentSettings[setting.key];
    
    switch (setting.type) {
      case 'select':
        return (
          <select
            value={String(value || '')}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label={setting.label}
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={String(value || '')}
            onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value) || 0)}
            min={setting.min}
            max={setting.max}
            step={setting.step}
            className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label={setting.label}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={setting.label}
            aria-checked={Boolean(value)}
          />
        );

      default:
        return null;
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      handleClose();
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
        className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 min-h-[44px] min-w-[44px]"
        aria-label="Widget settings"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="widget-settings-menu"
      >
        <Settings className="w-4 h-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          id="widget-settings-menu"
          className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-labelledby="widget-settings-trigger"
          onKeyDown={handleMenuKeyDown}
          tabIndex={-1}
        >
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Widget Settings
              </h3>
              
              <div className="space-y-3">
                {getAvailableSettings().map((setting, index) => (
                  <div key={setting.key}>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {setting.label}
                    </label>
                    {renderSettingInput(setting)}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Actions
              </h3>
              
              <div className="space-y-1">
                <button
                  ref={firstMenuItemRef}
                  onClick={() => handleExportClick('csv')}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                  role="menuitem"
                  tabIndex={0}
                >
                  <Download size={16} className="mr-3" aria-hidden="true" />
                  Export as CSV
                </button>
                
                <button
                  onClick={() => handleExportClick('png')}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                  role="menuitem"
                  tabIndex={0}
                >
                  <Image size={16} className="mr-3" aria-hidden="true" />
                  Export as PNG
                </button>
                
                <button
                  onClick={handleDuplicate}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                  role="menuitem"
                  tabIndex={0}
                >
                  <Copy size={16} className="mr-3" aria-hidden="true" />
                  Duplicate Widget
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                  role="menuitem"
                  tabIndex={0}
                >
                  <Trash2 size={16} className="mr-3" aria-hidden="true" />
                  Delete Widget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetSettingsMenu;