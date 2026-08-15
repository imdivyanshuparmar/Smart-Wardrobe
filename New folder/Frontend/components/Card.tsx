
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = false }) => {
  return (
    <div className={`rounded-3xl bg-white p-6 shadow-xl shadow-gray-200/50 ${glass ? 'glass' : ''} ${className}`}>
      {children}
    </div>
  );
};
