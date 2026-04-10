'use client';

import { cn } from '@/lib/utils/cn';
import { Button } from './button';
import { Spinner } from './spinner';

interface BackendStatusNoticeProps {
  variant?: 'warming' | 'error';
  title: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

const variantStyles = {
  warming: {
    container: 'border-primary-200 bg-primary-50/80 text-primary-950',
    iconWrapper: 'bg-white text-primary-600',
    body: 'text-primary-900/80',
  },
  error: {
    container: 'border-amber-200 bg-amber-50/90 text-amber-950',
    iconWrapper: 'bg-white text-amber-600',
    body: 'text-amber-900/80',
  },
} as const;

export function BackendStatusNotice({
  variant = 'warming',
  title,
  message,
  onRetry,
  className,
}: BackendStatusNoticeProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn('rounded-2xl border px-4 py-4 shadow-sm', styles.container, className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
              styles.iconWrapper
            )}
          >
            {variant === 'warming' ? (
              <Spinner size="sm" />
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm8.25-3.75a8.25 8.25 0 11-16.5 0 8.25 8.25 0 0116.5 0z"
                />
              </svg>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold sm:text-base">{title}</h3>
            <p className={cn('mt-1 text-sm leading-6', styles.body)}>{message}</p>
          </div>
        </div>

        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0 whitespace-nowrap"
          >
            Reintentar ahora
          </Button>
        ) : null}
      </div>
    </div>
  );
}
