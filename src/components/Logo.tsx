
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/lovable-uploads/44e2c2dc-d4ed-416e-82cf-44595dade4c7.png"
        alt="Philos Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
};
