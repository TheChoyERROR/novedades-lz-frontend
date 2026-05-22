'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSiteStore } from '@/stores/site-store';
import { getCarouselSlides } from '@/lib/campaigns/campaign-config';
import { buttonClasses } from '@/components/ui';

const AUTOPLAY_DELAY_MS = 5200;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { carousel } = useSiteStore();

  const slides = getCarouselSlides(carousel);

  useEffect(() => {
    if (slides.length === 0) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const goToPreviousSlide = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative aspect-video">
        {slides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 z-10 pb-8 pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
              <Link
                href="/products"
                className={buttonClasses({
                  size: 'lg',
                  className: 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg',
                })}
              >
                Ver productos
              </Link>
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <div
            className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5"
            aria-label="Selector de imagenes"
          >
            {slides.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                aria-label={`Ir a imagen ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === activeIndex
                    ? 'w-5 bg-white'
                    : 'w-2 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={goToPreviousSlide}
              className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:flex"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Siguiente imagen"
              onClick={goToNextSlide}
              className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:flex"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
}