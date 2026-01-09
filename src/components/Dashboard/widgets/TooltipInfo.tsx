import React, { useState, useRef, useEffect } from "react";

export interface TooltipInfoProps {
  content: string;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export const TooltipInfo: React.FC<TooltipInfoProps> = ({
  content,
  children,
  position = "top",
  delay = 200,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setIsMounted(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
    // Delay unmount for fade-out animation
    setTimeout(() => setIsMounted(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Use a wrapper span/div instead of cloning
  return (
    <span className={`tooltip-info ${className}`}>
      <span
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        tabIndex={0}
        aria-describedby={content ? `tooltip-${content.replace(/\s+/g, '-')}` : undefined}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>
      
      {isMounted && (
        <div
          ref={tooltipRef}
          id={`tooltip-${content.replace(/\s+/g, '-')}`}
          role="tooltip"
          className={`
            tooltip-content 
            tooltip-${position}
            ${isVisible ? 'tooltip-visible' : 'tooltip-hidden'}
          `}
          aria-live="polite"
        >
          {content}
          <div className="tooltip-arrow" />
        </div>
      )}
    </span>
  );
};

export default TooltipInfo;