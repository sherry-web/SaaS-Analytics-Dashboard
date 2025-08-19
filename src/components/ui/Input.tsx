import React from 'react';

interface InputProps {
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'number';
  value?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: 'search' | 'email' | 'user';
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const IconComponent: React.FC<{ icon: InputProps['icon']; className?: string }> = ({ icon, className }) => {
  const iconClasses = `w-5 h-5 ${className}`;
  
  switch (icon) {
    case 'search':
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case 'email':
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      );
    case 'user':
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    default:
      return null;
  }
};

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  value,
  placeholder,
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  icon,
  onChange,
  onFocus,
  onBlur,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const baseInputClasses = `
    block w-full rounded-md border transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:cursor-not-allowed disabled:opacity-50
    placeholder:text-gray-400 dark:placeholder:text-gray-500
  `;

  const stateClasses = error
    ? `
        border-red-300 text-red-900 placeholder-red-300
        focus:border-red-500 focus:ring-red-500
        dark:border-red-500 dark:text-red-100
      `
    : `
        border-gray-300 text-gray-900
        focus:border-blue-500 focus:ring-blue-500
        dark:border-gray-600 dark:text-white dark:bg-gray-800
        hover:border-gray-400 dark:hover:border-gray-500
      `;

  const sizeClasses = icon ? 'pl-10 pr-3 py-2' : 'px-3 py-2';

  const widthClasses = fullWidth ? 'w-full' : '';

  const inputClasses = `
    ${baseInputClasses}
    ${stateClasses}
    ${sizeClasses}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const labelClasses = `
    block text-sm font-medium mb-1
    ${error ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'}
    ${required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}
  `;

  const containerClasses = fullWidth ? 'w-full' : '';

  const describedBy = [
    error ? errorId : undefined,
    helperText ? helperId : undefined,
    ariaDescribedBy
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconComponent
              icon={icon}
              className={error 
                ? 'text-red-400' 
                : 'text-gray-400 dark:text-gray-500'
              }
            />
          </div>
        )}
        
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : undefined}
        />
      </div>

      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {helperText && !error && (
        <p
          id={helperId}
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

// Demo Component
export default function InputDemo() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [formData, setFormData] = React.useState({
    search: '',
    email: '',
    password: '',
    username: '',
    errorField: 'invalid@',
  });

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Input Component Demo
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Basic Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Basic Inputs
              </h2>
              
              <Input
                label="Search"
                placeholder="Search dashboard..."
                icon="search"
                value={formData.search}
                onChange={handleInputChange('search')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="user@example.com"
                icon="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                helperText="We'll never share your email."
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                required
                value={formData.password}
                onChange={handleInputChange('password')}
              />

              <Input
                label="Username"
                placeholder="Choose a username"
                icon="user"
                value={formData.username}
                onChange={handleInputChange('username')}
                fullWidth
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                States & Variants
              </h2>

              <Input
                label="Error State"
                placeholder="Invalid input"
                value={formData.errorField}
                onChange={handleInputChange('errorField')}
                error="Please enter a valid email address."
              />

              <Input
                label="Disabled Input"
                placeholder="This field is disabled"
                disabled
                value="Read-only value"
              />

              <Input
                placeholder="Input without label"
                icon="search"
                value=""
                onChange={() => {}}
              />

              <Input
                label="Required Field"
                placeholder="This field is required"
                required
                helperText="Please fill out this field."
              />
            </div>
          </div>

          {/* Dashboard Context Examples */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Dashboard Context Examples
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search Panel */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Search & Filter
                </h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Search data..."
                    icon="search"
                    fullWidth
                  />
                  <Input
                    label="Date Range"
                    type="text"
                    placeholder="Select date range"
                    fullWidth
                  />
                </div>
              </div>

              {/* User Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  User Settings
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Display Name"
                    placeholder="Enter display name"
                    icon="user"
                    fullWidth
                  />
                  <Input
                    label="Email Notifications"
                    type="email"
                    placeholder="notifications@example.com"
                    icon="email"
                    fullWidth
                  />
                </div>
              </div>

              {/* Data Export */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Export Options
                </h3>
                <div className="space-y-4">
                  <Input
                    label="File Name"
                    placeholder="dashboard-export"
                    fullWidth
                  />
                  <Input
                    label="Max Records"
                    type="number"
                    placeholder="1000"
                    fullWidth
                    helperText="Leave empty for all records"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Accessibility Features
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Proper label association and ARIA attributes</li>
              <li>• Error announcement for screen readers</li>
              <li>• Focus indicators with proper contrast</li>
              <li>• Required field indicators</li>
              <li>• Helper text and error message support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}