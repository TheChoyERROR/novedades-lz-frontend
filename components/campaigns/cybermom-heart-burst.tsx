'use client';

import { CSSProperties, useEffect, useState } from 'react';

const HEARTS = [
  { left: 5, topOffset: 28, size: 13, delay: 0, duration: 3600, midDrift: -4, lateDrift: 17, drift: 24, midRotate: 6, lateRotate: 16, rotate: 22, color: '#e25664' },
  { left: 11, topOffset: 72, size: 18, delay: 180, duration: 3900, midDrift: 5, lateDrift: -20, drift: -28, midRotate: -7, lateRotate: -20, rotate: -28, color: '#f48b97' },
  { left: 17, topOffset: 16, size: 11, delay: 520, duration: 3400, midDrift: -3, lateDrift: 13, drift: 18, midRotate: 5, lateRotate: 13, rotate: 18, color: '#ff9aa4' },
  { left: 23, topOffset: 96, size: 15, delay: 320, duration: 4100, midDrift: 3, lateDrift: -13, drift: -18, midRotate: -6, lateRotate: -17, rotate: -24, color: '#d95764' },
  { left: 30, topOffset: 38, size: 20, delay: 80, duration: 3800, midDrift: -6, lateDrift: 23, drift: 32, midRotate: 8, lateRotate: 22, rotate: 30, color: '#e25664' },
  { left: 37, topOffset: 120, size: 12, delay: 740, duration: 3500, midDrift: 4, lateDrift: -16, drift: -22, midRotate: -5, lateRotate: -13, rotate: -18, color: '#f48b97' },
  { left: 44, topOffset: 24, size: 16, delay: 430, duration: 4200, midDrift: -4, lateDrift: 14, drift: 20, midRotate: 7, lateRotate: 19, rotate: 26, color: '#d95764' },
  { left: 51, topOffset: 84, size: 13, delay: 620, duration: 3700, midDrift: 6, lateDrift: -24, drift: -34, midRotate: -8, lateRotate: -23, rotate: -32, color: '#ff9aa4' },
  { left: 58, topOffset: 44, size: 19, delay: 220, duration: 4000, midDrift: -5, lateDrift: 19, drift: 26, midRotate: 5, lateRotate: 14, rotate: 20, color: '#e25664' },
  { left: 65, topOffset: 108, size: 12, delay: 880, duration: 3550, midDrift: 3, lateDrift: -12, drift: -16, midRotate: -5, lateRotate: -14, rotate: -20, color: '#f48b97' },
  { left: 72, topOffset: 20, size: 15, delay: 560, duration: 3850, midDrift: -5, lateDrift: 22, drift: 30, midRotate: 7, lateRotate: 20, rotate: 28, color: '#d95764' },
  { left: 78, topOffset: 76, size: 21, delay: 120, duration: 4300, midDrift: 4, lateDrift: -17, drift: -24, midRotate: -8, lateRotate: -22, rotate: -30, color: '#e25664' },
  { left: 84, topOffset: 34, size: 12, delay: 690, duration: 3600, midDrift: -3, lateDrift: 13, drift: 18, midRotate: 4, lateRotate: 12, rotate: 16, color: '#ff9aa4' },
  { left: 91, topOffset: 112, size: 17, delay: 360, duration: 4050, midDrift: 5, lateDrift: -22, drift: -30, midRotate: -7, lateRotate: -19, rotate: -26, color: '#f48b97' },
  { left: 96, topOffset: 58, size: 14, delay: 940, duration: 3450, midDrift: -3, lateDrift: 10, drift: 14, midRotate: 6, lateRotate: 17, rotate: 24, color: '#e25664' },
];

export function CybermomHeartBurst() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, 5300);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {HEARTS.map((heart, index) => (
        <span
          key={index}
          className="cybermom-heart-burst absolute"
          style={
            {
              left: `${heart.left}%`,
              top: `-${heart.topOffset}px`,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              color: heart.color,
              '--heart-delay': `${heart.delay}ms`,
              '--heart-duration': `${heart.duration}ms`,
              '--heart-mid-drift': `${heart.midDrift}px`,
              '--heart-late-drift': `${heart.lateDrift}px`,
              '--heart-drift': `${heart.drift}px`,
              '--heart-mid-rotate': `${heart.midRotate}deg`,
              '--heart-late-rotate': `${heart.lateRotate}deg`,
              '--heart-rotate': `${heart.rotate}deg`,
            } as CSSProperties
          }
        >
          <svg className="h-full w-full drop-shadow-sm" viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 41.4 20.9 38.6C9.8 28.5 2.5 21.9 2.5 13.7 2.5 7 7.7 1.9 14.4 1.9c3.8 0 7.4 1.8 9.6 4.7 2.2-2.9 5.8-4.7 9.6-4.7C40.3 1.9 45.5 7 45.5 13.7c0 8.2-7.3 14.8-18.4 24.9L24 41.4Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
