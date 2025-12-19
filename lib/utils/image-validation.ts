/**
 * Cloudinary Image Validation Utilities
 * Validates image files before upload according to backend constraints
 */

// Cloudinary constraints from backend
export const IMAGE_CONSTRAINTS = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

export interface ImageValidationError {
  isValid: false;
  error: string;
}

export interface ImageValidationSuccess {
  isValid: true;
  file: File;
  preview: string;
}

export type ImageValidationResult = ImageValidationError | ImageValidationSuccess;

/**
 * Validate image file before upload
 * @param file - File to validate
 * @returns Validation result with preview URL if valid
 */
export function validateImageFile(file: File | null | undefined): ImageValidationResult {
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      error: 'No se seleccionó ningún archivo',
    };
  }

  // Check file type
  if (!IMAGE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Solo se aceptan: ${IMAGE_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size (5MB max)
  if (file.size > IMAGE_CONSTRAINTS.MAX_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `El archivo es muy grande (${sizeMB}MB). Tamaño máximo: ${IMAGE_CONSTRAINTS.MAX_SIZE_MB}MB`,
    };
  }

  // Create preview URL
  const preview = URL.createObjectURL(file);

  return {
    isValid: true,
    file,
    preview,
  };
}

/**
 * Format file size to human readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file extension is allowed
 * @param filename - File name
 * @returns true if extension is allowed
 */
export function isAllowedExtension(filename: string): boolean {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return IMAGE_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(ext);
}
