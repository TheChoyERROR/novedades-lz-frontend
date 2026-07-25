/**
 * La tienda vende en Peru y en soles. Con el locale en-US, Intl imprimia "PEN 25.90" en vez de
 * "S/ 25.90" en cada precio del sitio, y las fechas salian en ingles.
 */
const LOCALE = 'es-PE';

export const formatPrice = (price: number, currency: string = 'PEN'): string => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
  }).format(price);
};

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) {
    return '-';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (Number.isNaN(dateObj.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) {
    return '-';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (Number.isNaN(dateObj.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
