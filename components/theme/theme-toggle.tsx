'use client';

import { cn } from '@/lib/utils/cn';
import { useTheme } from './theme-provider';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const { isReady, theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';
  const label = isDark ? 'Modo claro' : 'Modo oscuro';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground shadow-sm',
        'hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background',
        className
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isDark ? 'bg-primary-100 text-primary-700' : 'bg-surface-muted text-primary-600'
        )}
      >
        {isReady && isDark ? (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 3v2.25M12 18.75V21M4.97 4.97l1.59 1.59M17.44 17.44l1.59 1.59M3 12h2.25M18.75 12H21M4.97 19.03l1.59-1.59M17.44 6.56l1.59-1.59M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 12.79A9 9 0 1111.21 3c0 .32-.02.64-.05.96A7 7 0 0020.04 13c.32-.03.64-.05.96-.05z"
            />
          </svg>
        )}
      </span>
      {showLabel && <span>{label}</span>}
    </button>
  );
}
