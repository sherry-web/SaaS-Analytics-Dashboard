import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    relative overflow-hidden
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 hover:bg-blue-700 text-white shadow-sm
      focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600
      active:scale-95 transform
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-sm border border-gray-300
      focus:ring-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 
      dark:text-gray-100 dark:border-gray-600
      active:scale-95 transform
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 text-gray-700 
      focus:ring-gray-500 dark:hover:bg-gray-800 dark:text-gray-300
      hover:shadow-sm active:scale-95 transform
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

// Demo Component
export default function ButtonDemo() {
  const [loading, setLoading] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Button Component Demo
            </h1>
            <Button
              variant="ghost"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
          </div>

          {/* Variants Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Button Variants
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </div>

            {/* Sizes Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Button Sizes
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>

            {/* States Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Button States
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Normal</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button 
                  variant="primary" 
                  loading={loading}
                  onClick={handleLoadingDemo}
                >
                  {loading ? 'Loading...' : 'Click for Loading'}
                </Button>
              </div>
            </div>

            {/* Full Width Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Full Width Button
              </h2>
              <div className="max-w-md">
                <Button variant="primary" fullWidth>
                  Full Width Button
                </Button>
              </div>
            </div>

            {/* Real Usage Examples */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Dashboard Context Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Export Actions
                  </h3>
                  <div className="space-y-2">
                    <Button variant="primary" size="sm" fullWidth>
                      Export CSV
                    </Button>
                    <Button variant="secondary" size="sm" fullWidth>
                      Export PDF
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Filter Controls
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Apply</Button>
                    <Button variant="ghost" size="sm">Reset</Button>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Data Actions
                  </h3>
                  <div className="space-y-2">
                    <Button variant="primary" size="sm" fullWidth>
                      Refresh Data
                    </Button>
                    <Button variant="secondary" size="sm" fullWidth>
                      View Details
                    </Button>
                  </div>
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
              <li>• Keyboard navigation support (Tab, Enter, Space)</li>
              <li>• Focus indicators with proper contrast</li>
              <li>• ARIA attributes for screen readers</li>
              <li>• Loading state announcements</li>
              <li>• Disabled state handling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}