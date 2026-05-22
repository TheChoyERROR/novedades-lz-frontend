import { getOptimizedCarouselUrl } from '@/lib/utils/cloudinary-upload';

export interface CarouselSlide {
  src: string;
  alt: string;
}

export interface CarouselConfig {
  slideCount: number;
  alts: string[];
  srcs: string[];
}

export interface CampaignConfig {
  enabled: boolean;
  name: string;
  discountLabel: string;
  cardBadge: string;
  dateRange: string;
  headline: string;
  subheadline: string;
  catalogIntro: string;
  whatsappUrl: string;
}

export const CAROUSEL_BASE_PATH = '/campaigns/carousel';

export function getCarouselSlides(config: CarouselConfig): CarouselSlide[] {
  const slides: CarouselSlide[] = [];
  for (let i = 0; i < config.slideCount; i++) {
    const rawSrc = config.srcs[i] || `${CAROUSEL_BASE_PATH}/slide-${i + 1}.webp`;
    slides.push({
      src: getOptimizedCarouselUrl(rawSrc),
      alt: config.alts[i] || `Imagen ${i + 1} del carousel`,
    });
  }
  return slides;
}

export const defaultCarousel: CarouselConfig = {
  slideCount: 0,
  alts: [],
  srcs: [],
};

export const defaultCampaign: CampaignConfig = {
  enabled: false,
  name: '',
  discountLabel: '',
  cardBadge: '',
  dateRange: '',
  headline: '',
  subheadline: '',
  catalogIntro: '',
  whatsappUrl: '',
};

export const cybermomCampaign: CampaignConfig = {
  enabled: true,
  name: 'Cybermom',
  discountLabel: '30% OFF',
  cardBadge: 'Cybermom -30%',
  dateRange: 'Del 28 de abril al 10 de mayo',
  headline: 'Cybermom: regalos para mama con 30% OFF',
  subheadline:
    'Sorprende a mama con detalles bonitos, utiles y con entrega rapida desde Novedades LZ.',
  catalogIntro:
    'Todos los productos participan en la campana. Elige tus favoritos y confirma disponibilidad por WhatsApp.',
  whatsappUrl:
    'https://wa.me/51939662630?text=Hola%2C%20quiero%20consultar%20por%20las%20promos%20Cybermom%20con%2030%25%20OFF.',
};

export const cybermomCarousel: CarouselConfig = {
  slideCount: 5,
  alts: [
    'Fragancias y detalles para mama con 30% de descuento',
    'Perfumes y sets que enamoran a mama',
    'Regalos especiales para consentir a mama',
    'Bolsos y carteras para consentir a mama',
    'Detalles especiales que enamoran a mama',
  ],
  srcs: [
    '/campaigns/carousel/slide-1.png',
    '/campaigns/carousel/slide-2.png',
    '/campaigns/carousel/slide-3.png',
    '/campaigns/carousel/slide-4.png',
    '/campaigns/carousel/slide-5.png',
  ],
};