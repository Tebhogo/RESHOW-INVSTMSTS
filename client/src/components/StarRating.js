import React from 'react';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }) => {
  const maxRating = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (newRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating) => {
    if (!readonly) {
      // Optional: Add hover effect
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        let starType = 'empty';
        
        if (starValue <= fullStars) {
          starType = 'full';
        } else if (starValue === fullStars + 1 && hasHalfStar) {
          starType = 'half';
        }

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform ${sizeClasses[size]}`}
          >
            {starType === 'full' ? (
              <svg className={`${sizeClasses[size]} text-yellow-400 fill-current`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ) : starType === 'half' ? (
              <svg className={`${sizeClasses[size]} text-yellow-400 fill-current`} viewBox="0 0 20 20">
                <defs>
                  <linearGradient id={`half-${index}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path fill={`url(#half-${index})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ) : (
              <svg className={`${sizeClasses[size]} text-gray-300 fill-current`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            )}
          </button>
        );
      })}
      {!readonly && (
        <span className="ml-2 text-sm font-dosis text-gray-600">
          {rating > 0 ? `${rating.toFixed(1)}` : 'Not rated'}
        </span>
      )}
    </div>
  );
};

export default StarRating;

