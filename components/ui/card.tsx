'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-xl shadow-md overflow-hidden',
          'border border-gray-100',
          'transition-shadow hover:shadow-lg',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-b border-gray-100', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4', className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50', className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
