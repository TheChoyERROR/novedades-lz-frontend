'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cybermomCampaign } from '@/lib/campaigns/cybermom';
import { buttonClasses } from '@/components/ui';

const AUTOPLAY_DELAY_MS = 5200;

export function CybermomCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = cybermomCampaign.carouselSlides;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  const goToPreviousSlide = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className="border-b border-[#f5c4cc] bg-[#ffe7eb] py-4 text-[#3b211b] sm:py-6 dark:border-[#4c222b] dark:bg-[#17090d] dark:text-[#fff1f3]">
      <div className="mx-auto max-w-[1540px] px-3 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/58 px-4 py-3 text-sm font-semibold shadow-[0_12px_34px_rgba(205,76,91,0.12)] backdrop-blur sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#211015]/86 dark:shadow-[0_12px_34px_rgba(0,0,0,0.24)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#e25664] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white dark:bg-[#ff6f7a] dark:text-[#19090d]">
              {cybermomCampaign.name}
            </span>
            <span className="text-[#8e3340] dark:text-[#ffc6cc]">
              {cybermomCampaign.discountLabel} en todos los productos
            </span>
          </div>
          <span className="text-[#6f4540] dark:text-[#f4b6bd]">
            {cybermomCampaign.dateRange}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-[#f9d7db] shadow-[0_24px_54px_rgba(198,68,85,0.18)] dark:border-white/10 dark:bg-[#211015] dark:shadow-[0_24px_54px_rgba(0,0,0,0.34)]">
          <Link
            href="/products"
            aria-label="Ver ofertas Cybermom"
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
          </Link>

          <div
            className="absolute bottom-[1.7%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-[#ffecef]/95 px-4 py-2 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#2a1318]/92"
            aria-label="Selector de imagenes Cybermom"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Ir a imagen ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-[background-color,width] duration-200 ${
                  index === activeIndex
                    ? 'w-7 bg-[#d95764] dark:bg-[#ff7a86]'
                    : 'w-2.5 bg-white shadow-[inset_0_0_0_1px_rgba(217,87,100,0.35)] hover:bg-[#ffd3d8] dark:bg-white/42 dark:hover:bg-white/68'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Imagen anterior"
            onClick={goToPreviousSlide}
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/72 text-[#4a2a22] shadow-sm backdrop-blur transition-colors hover:bg-white sm:flex dark:border-white/15 dark:bg-[#2a1318]/76 dark:text-[#fff1f3] dark:hover:bg-[#3a1a20]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Siguiente imagen"
            onClick={goToNextSlide}
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/72 text-[#4a2a22] shadow-sm backdrop-blur transition-colors hover:bg-white sm:flex dark:border-white/15 dark:bg-[#2a1318]/76 dark:text-[#fff1f3] dark:hover:bg-[#3a1a20]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className={buttonClasses({
              size: 'lg',
              className:
                'bg-[#3b211b] text-white hover:bg-[#2a1713] focus:ring-[#e25664] shadow-[0_12px_26px_rgba(59,33,27,0.2)] dark:bg-[#ff7a86] dark:text-[#19090d] dark:hover:bg-[#ff98a1] dark:shadow-[0_12px_26px_rgba(0,0,0,0.24)]',
            })}
          >
            Ver ofertas
          </Link>
          <a
            href={cybermomCampaign.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({
              size: 'lg',
              variant: 'outline',
              className:
                'border-[#eeb4bc] bg-white/70 text-[#8e3340] hover:border-[#e25664] hover:bg-white hover:text-[#6f2730] dark:border-white/12 dark:bg-[#211015]/70 dark:text-[#ffc6cc] dark:hover:border-[#ff7a86] dark:hover:bg-[#2a1318] dark:hover:text-white',
            })}
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
