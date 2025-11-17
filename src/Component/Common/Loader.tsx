import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large" | "xlarge";
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xlarge: "w-20 h-20",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>

        {/* Animated spinner */}
        <div className="absolute inset-0 border-4 border-transparent rounded-full border-t-orange-500 border-r-orange-500 animate-spin"></div>

        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/4 h-1/4 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
