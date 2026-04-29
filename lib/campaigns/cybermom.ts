export const cybermomCampaign = {
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
  carouselSlides: [
    {
      src: '/campaigns/cybermom/carousel/cybermom-regalos-unicos.png',
      alt: 'Cybermom regalos unicos para mama con 30% de descuento',
    },
    {
      src: '/campaigns/cybermom/carousel/cybermom-bolsos-carteras.png',
      alt: 'Cybermom bolsos y carteras para consentir a mama',
    },
    {
      src: '/campaigns/cybermom/carousel/cybermom-detalles-especiales.png',
      alt: 'Cybermom detalles especiales que enamoran a mama',
    },
  ],
};

const CYBERMOM_START_AT = new Date('2026-04-28T00:00:00-05:00').getTime();
const CYBERMOM_END_AT = new Date('2026-05-11T00:00:00-05:00').getTime();

export function isCybermomCampaignActive(now = new Date()) {
  const currentTime = now.getTime();

  return currentTime >= CYBERMOM_START_AT && currentTime < CYBERMOM_END_AT;
}
