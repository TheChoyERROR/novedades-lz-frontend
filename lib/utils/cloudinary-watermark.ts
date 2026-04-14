const watermarkPublicId = process.env.NEXT_PUBLIC_CLOUDINARY_WATERMARK_ID?.trim() ?? '';

function isCloudinaryImageUrl(url: string | null | undefined): url is string {
  return Boolean(url && url.includes('res.cloudinary.com') && url.includes('/image/upload/'));
}

function encodeOverlayPublicId(publicId: string): string {
  return encodeURIComponent(publicId.replaceAll('/', ':')).replaceAll('%3A', ':');
}

function getWatermarkWidth(variant: 'card' | 'detail' | 'thumb'): string {
  switch (variant) {
    case 'card':
      return '0.42';
    case 'thumb':
      return '0.58';
    case 'detail':
    default:
      return '0.48';
  }
}

export function hasCloudinaryWatermarkConfigured(): boolean {
  return watermarkPublicId.length > 0;
}

export function shouldUseOverlayWatermarkFallback(url: string | null | undefined): boolean {
  return !hasCloudinaryWatermarkConfigured() || !isCloudinaryImageUrl(url);
}

export function getProtectedCloudinaryImageUrl(
  url: string | null | undefined,
  variant: 'card' | 'detail' | 'thumb' = 'detail'
): string | null {
  if (!url) {
    return null;
  }

  if (!hasCloudinaryWatermarkConfigured() || !isCloudinaryImageUrl(url)) {
    return url;
  }

  const uploadMarker = '/image/upload/';
  const uploadIndex = url.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return url;
  }

  const prefix = url.slice(0, uploadIndex + uploadMarker.length);
  const suffix = url.slice(uploadIndex + uploadMarker.length);
  const overlayId = encodeOverlayPublicId(watermarkPublicId);
  const width = getWatermarkWidth(variant);
  const transformation = [
    'f_auto',
    'q_auto',
    `l_${overlayId},fl_relative,w_${width},o_24`,
    'fl_layer_apply,g_center',
  ].join('/');

  return `${prefix}${transformation}/${suffix}`;
}
