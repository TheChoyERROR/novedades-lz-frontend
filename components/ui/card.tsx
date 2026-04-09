'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_16px_36px_rgba(89,11,49,0.08)] backdrop-blur-sm',
        'transition-shadow hover:shadow-[0_18px_42px_rgba(89,11,49,0.12)]',
        className
      )}
      {...props}
    />
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('border-b border-border px-6 py-4', className)}
      {...props}
    />
  );
});

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('px-6 py-4', className)} {...props} />;
});

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('border-t border-border bg-surface-muted px-6 py-4', className)}
      {...props}
    />
  );
});

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
