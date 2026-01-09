import React, { useEffect, useRef, useState } from "react";

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ReportFormData) => void;
  title?: string;
  submitLabel?: string;
  children?: React.ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
}

export interface ReportFormData {
  name: string;
  dateRange: string;
  format: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Generate Report",
  submitLabel = "Generate",
  children,
  size = "medium",
  className = ""
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [formData, setFormData] = useState<ReportFormData>({
    name: "",
    dateRange: "last-30-days",
    format: "pdf"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
      
      // Trap focus within modal
      if (event.key === "Tab" && isOpen) {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Report name is required";
    }

    if (!formData.dateRange) {
      newErrors.dateRange = "Date range is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(formData);
      // Reset form on successful submission
      setFormData({
        name: "",
        dateRange: "last-30-days",
        format: "pdf"
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      dateRange: "last-30-days",
      format: "pdf"
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
      data-testid="modal-overlay"
    >
      <div
        ref={modalRef}
        className={`modal-content modal-${size}`}
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <header className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </header>

        <div className="modal-body">
          {children || (
            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-group">
                <label htmlFor="report-name" className="form-label">
                  Report Name *
                </label>
                <input
                  id="report-name"
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  aria-required="true"
                />
                {errors.name && (
                  <div id="name-error" className="error-message" role="alert" aria-live="polite">
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="date-range" className="form-label">
                  Date Range *
                </label>
                <select
                  id="date-range"
                  value={formData.dateRange}
                  onChange={e => handleInputChange("dateRange", e.target.value)}
                  className={`form-select ${errors.dateRange ? 'error' : ''}`}
                  aria-describedby={errors.dateRange ? "date-range-error" : undefined}
                >
                  <option value="last-7-days">Last 7 days</option>
                  <option value="last-30-days">Last 30 days</option>
                  <option value="last-90-days">Last 90 days</option>
                  <option value="custom">Custom range</option>
                </select>
                {errors.dateRange && (
                  <div id="date-range-error" className="error-message" role="alert">
                    {errors.dateRange}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="report-format" className="form-label">
                  Format
                </label>
                <select
                  id="report-format"
                  value={formData.format}
                  onChange={e => handleInputChange("format", e.target.value)}
                  className="form-select"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </form>
          )}
        </div>

        <footer className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
          >
            Reset
          </button>
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
            >
              {submitLabel}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ReportModal;