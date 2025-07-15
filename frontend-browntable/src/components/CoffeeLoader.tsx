import React, { useState, useEffect } from 'react';

interface CoffeeLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  minDisplayTime?: number; // Minimum time to show loader in milliseconds
}

const CoffeeLoader: React.FC<CoffeeLoaderProps> = ({ 
  size = 'md', 
  message = 'Loading...',
  minDisplayTime = 1500 // Default 1.5 seconds minimum display
}) => {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Ensure loader shows for minimum time
    const timer = setTimeout(() => {
      setShouldShow(false);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const containerClasses = {
    sm: 'space-y-3',
    md: 'space-y-6',
    lg: 'space-y-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]} animate-fade-in`}>
      {/* Coffee Cup SVG with enhanced styling */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center filter drop-shadow-lg`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cup shadow */}
          <ellipse
            cx="45"
            cy="88"
            rx="25"
            ry="4"
            fill="#000"
            opacity="0.1"
            className="animate-pulse"
          />

          {/* Cup outline with gradient */}
          <defs>
            <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2691E" />
              <stop offset="100%" stopColor="#8B4513" />
            </linearGradient>
            <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6F4E37" />
              <stop offset="100%" stopColor="#4A2C2A" />
            </linearGradient>
          </defs>
          
          <path
            d="M20 25 L20 75 Q20 85 30 85 L60 85 Q70 85 70 75 L70 25 Z"
            stroke="url(#cupGradient)"
            strokeWidth="2.5"
            fill="none"
            className="filter drop-shadow-sm"
          />
          
          {/* Cup handle with enhanced styling */}
          <path
            d="M70 35 Q80 35 80 45 Q80 55 70 55"
            stroke="url(#cupGradient)"
            strokeWidth="2.5"
            fill="none"
            className="filter drop-shadow-sm"
          />
          
          {/* Coffee filling animation with gradient */}
          <defs>
            <clipPath id="cupClip">
              <path d="M22 27 L22 75 Q22 83 28 83 L62 83 Q68 83 68 75 L68 27 Z" />
            </clipPath>
          </defs>
          
          <rect
            x="22"
            y="27"
            width="46"
            height="56"
            fill="url(#coffeeGradient)"
            clipPath="url(#cupClip)"
            className="animate-coffee-fill-enhanced"
          />
          
          {/* Enhanced coffee surface with shimmer */}
          <ellipse
            cx="45"
            cy="30"
            rx="23"
            ry="3"
            fill="#8B4513"
            className="animate-coffee-surface-enhanced"
          />
          
          {/* Shimmer effect on coffee surface */}
          <ellipse
            cx="45"
            cy="30"
            rx="20"
            ry="2"
            fill="url(#shimmerGradient)"
            opacity="0.3"
            className="animate-shimmer"
          />
          
          <defs>
            <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#FFF" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          
          {/* Enhanced steam lines with varying opacity */}
          <g className="animate-steam-enhanced">
            <path
              d="M35 20 Q37 15 35 10 Q33 5 35 0"
              stroke="#E6E6FA"
              strokeWidth="1.8"
              fill="none"
              opacity="0.8"
              className="animate-steam-line-1"
            />
            <path
              d="M45 20 Q47 15 45 10 Q43 5 45 0"
              stroke="#E6E6FA"
              strokeWidth="1.8"
              fill="none"
              opacity="0.9"
              className="animate-steam-line-2"
            />
            <path
              d="M55 20 Q57 15 55 10 Q53 5 55 0"
              stroke="#E6E6FA"
              strokeWidth="1.8"
              fill="none"
              opacity="0.7"
              className="animate-steam-line-3"
            />
          </g>
        </svg>
      </div>
      
      {/* Enhanced loading message with better typography */}
      <div className="text-center max-w-xs">
        <p className={`${textSizeClasses[size]} font-semibold text-coffee-900 animate-pulse-gentle font-serif`}>
          {message}
        </p>
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-coffee-600 rounded-full animate-bounce-1 shadow-sm"></div>
          <div className="w-2 h-2 bg-coffee-600 rounded-full animate-bounce-2 shadow-sm"></div>
          <div className="w-2 h-2 bg-coffee-600 rounded-full animate-bounce-3 shadow-sm"></div>
        </div>
        
        {/* Elegant progress indicator */}
        <div className="mt-6 w-32 h-1 bg-coffee-100 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-coffee-gradient rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeLoader; 