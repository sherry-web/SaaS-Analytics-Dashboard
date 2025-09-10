import React from 'react';

interface MainLayoutGridProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayoutGrid: React.FC<MainLayoutGridProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default MainLayoutGrid;