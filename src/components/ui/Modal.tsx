import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Handle escape key and focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store the element that was focused before modal opened
    previousActiveElementRef.current = document.activeElement;

    // Focus the modal when it opens
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 100);

    // Handle escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      
      // Restore focus to the previous element
      if (previousActiveElementRef.current instanceof HTMLElement) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Handle focus trapping
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
      aria-describedby={ariaDescribedBy}
    >
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden
          bg-white dark:bg-gray-800 rounded-lg shadow-xl
          animate-in zoom-in-95 duration-200
          focus:outline-none
          ${className}
        `}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Demo Component
export default function ModalDemo() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [modals, setModals] = React.useState({
    basic: false,
    withForm: false,
    large: false,
    confirmation: false,
    noHeader: false,
  });

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const openModal = (type: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [type]: false }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    closeModal('withForm');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Modal Component</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Accessible modal dialogs with focus management and keyboard navigation
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Modal Triggers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Modal Variations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => openModal('basic')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Basic Modal
              </button>
              
              <button
                onClick={() => openModal('withForm')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Modal with Form
              </button>
              
              <button
                onClick={() => openModal('large')}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Large Modal
              </button>
              
              <button
                onClick={() => openModal('confirmation')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Confirmation Dialog
              </button>
              
              <button
                onClick={() => openModal('noHeader')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                No Header Modal
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Keyboard navigation (Tab, Shift+Tab)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Focus trapping within modal</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Escape key to close</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Click overlay to close</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>ARIA compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Smooth animations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Modal */}
        <Modal
          isOpen={modals.basic}
          onClose={() => closeModal('basic')}
          title="Welcome!"
          aria-describedby="basic-modal-desc"
        >
          <div id="basic-modal-desc">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This is a basic modal dialog with a title and close button. You can close it by:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-1">
              <li>Clicking the X button</li>
              <li>Pressing the Escape key</li>
              <li>Clicking outside the modal</li>
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => closeModal('basic')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Got it!
              </button>
            </div>
          </div>
        </Modal>

        {/* Form Modal */}
        <Modal
          isOpen={modals.withForm}
          onClose={() => closeModal('withForm')}
          title="Contact Us"
          size="lg"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => closeModal('withForm')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Send Message
              </button>
            </div>
          </form>
        </Modal>

        {/* Large Modal */}
        <Modal
          isOpen={modals.large}
          onClose={() => closeModal('large')}
          title="Large Modal"
          size="xl"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              This is a large modal that demonstrates how the modal component handles larger content.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Column 1</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Column 2</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Additional Content</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                The modal automatically handles scrolling when content exceeds the viewport height.
              </p>
              
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="mb-2 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  <strong className="text-gray-900 dark:text-white">Item {i + 1}:</strong>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    Sample content item to demonstrate scrolling behavior.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          isOpen={modals.confirmation}
          onClose={() => closeModal('confirmation')}
          title="Confirm Action"
          size="sm"
          closeOnOverlayClick={false}
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => closeModal('confirmation')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Item deleted');
                  closeModal('confirmation');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* No Header Modal */}
        <Modal
          isOpen={modals.noHeader}
          onClose={() => closeModal('noHeader')}
          showCloseButton={false}
          aria-label="Custom modal without header"
        >
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Custom Modal
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This modal has no header or close button. You can still close it with the Escape key or by clicking outside.
            </p>
            <button
              onClick={() => closeModal('noHeader')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close Modal
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}