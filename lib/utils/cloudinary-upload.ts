const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com') && url.includes('/image/upload/');
}

export function getOptimizedCarouselUrl(url: string): string {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const uploadMarker = '/image/upload/';
  const uploadIndex = url.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return url;
  }

  const prefix = url.slice(0, uploadIndex + uploadMarker.length);
  const suffix = url.slice(uploadIndex + uploadMarker.length);
  const transformation = 'f_auto,q_auto,c_fill,w_1920,h_760,g_auto';

  return `${prefix}${transformation}/${suffix}`;
}

export async function uploadToCloudinary(
  file: File,
  folder = 'novedades/carousel'
): Promise<CloudinaryUploadResult> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary no esta configurado. Agrega NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET a .env.local'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Error al subir imagen a Cloudinary (${response.status})`
    );
  }

  return response.json();
}