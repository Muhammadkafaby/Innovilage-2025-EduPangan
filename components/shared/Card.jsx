import React from 'react';

/**
 * Reusable Card Component
 * Komponen card untuk container konten
 */
const Card = ({
  children,
  title,
  subtitle,
  icon,
  className = '',
  padding = 'md',
  shadow = 'md',
  onClick,
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl ${shadowClasses[shadow]}
        ${paddingClasses[padding]}
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
        ${className}
      `.trim()}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && <span className="text-2xl">{icon}</span>}
            <div>
              {title && <h3 className="font-bold text-gray-800">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
