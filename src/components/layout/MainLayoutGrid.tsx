import React from 'react';

interface MainLayoutGridProps {
  children: React.ReactNode;
}

const MainLayoutGrid: React.FC<MainLayoutGridProps> = ({ children }) => {
  return (
    <main 
      className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
      role="main"
      aria-label="Main content"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </main>
  );
};

export default MainLayoutGrid;