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
  const { carousel, campaign } = useSiteStore();

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

  const showCampaignBar = campaign.enabled && campaign.name && campaign.discountLabel;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1540px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {showCampaignBar && (
          <div className="mb-4 flex flex-col gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-600 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
                {campaign.name}
              </span>
              <span className="text-foreground">
                {campaign.discountLabel} en todos los productos
              </span>
            </div>
            <span className="text-muted-foreground">
              {campaign.dateRange}
            </span>
          </div>
        )}

        <div className="relative overflow-hidden rounded-2xl bg-gray-900">
          <Link
            href="/products"
            aria-label="Ver productos"
            className="relative block aspect-[1916/821] w-full"
          >
            {slides.map((slide, index) => (
              <Image
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1540px) 1540px, 100vw"
                className={`object-cover transition-opacity duration-700 ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </Link>

          {slides.length > 1 && (
            <div
              className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm"
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
                      ? 'w-6 bg-white'
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
                className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:flex"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Siguiente imagen"
                onClick={goToNextSlide}
                className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:flex"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className={buttonClasses({ size: 'lg' })}
          >
            Ver productos
          </Link>
          {showCampaignBar && campaign.whatsappUrl && (
            <a
              href={campaign.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ size: 'lg', variant: 'outline' })}
            >
              Consultar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  );
}