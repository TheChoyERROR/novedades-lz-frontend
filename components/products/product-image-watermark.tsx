'use client';

import Image from 'next/image';

interface ProductImageWatermarkProps {
  size?: 'sm' | 'lg';
}

export function ProductImageWatermark({
  size = 'sm',
}: ProductImageWatermarkProps) {
  const sizeClasses =
    size === 'lg'
      ? 'w-32 sm:w-40 opacity-[0.18]'
      : 'w-20 sm:w-24 opacity-[0.15] group-hover:opacity-[0.2]';

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="rounded-full bg-white/18 p-4 backdrop-blur-[1px]">
        <Image
          src="/brand/logo.png"
          alt=""
          width={220}
          height={220}
          aria-hidden="true"
          className={`h-auto ${sizeClasses} drop-shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition-opacity duration-300`}
        />
      </div>
    </div>
  );
}
