import React from 'react';

const LoadingSpinner = ({ message = "Loading" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      {/* Loading text with animated dots */}
      <div className="flex items-center gap-1">
        <span className="text-gray-600 font-medium">{message}</span>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
