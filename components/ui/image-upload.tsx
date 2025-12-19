'use client';

import { useRef, useState, useEffect } from 'react';
import { validateImageFile, formatFileSize, IMAGE_CONSTRAINTS } from '@/lib/utils/image-validation';
import { Button } from './button';
import { cn } from '@/lib/utils/cn';

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  currentImageUrl?: string | null;
  error?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  currentImageUrl,
  error,
  disabled = false,
  label = 'Imagen del Producto',
  helperText,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Set initial preview from currentImageUrl
  useEffect(() => {
    if (currentImageUrl && !value) {
      setPreview(currentImageUrl);
    }
  }, [currentImageUrl, value]);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(null);
      setValidationError(null);
      onChange(null);
      return;
    }

    const validation = validateImageFile(file);

    if (!validation.isValid) {
      setValidationError(validation.error);
      setPreview(null);
      onChange(null);
      return;
    }

    setValidationError(null);
    setPreview(validation.preview);
    onChange(validation.file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setValidationError(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayError = error || validationError;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {helperText && <span className="text-gray-500 font-normal ml-2">{helperText}</span>}
      </label>

      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          isDragging && !disabled && 'border-indigo-500 bg-indigo-50',
          !isDragging && !displayError && 'border-gray-300 hover:border-indigo-400',
          displayError && 'border-red-300 bg-red-50',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_CONSTRAINTS.ALLOWED_TYPES.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {/* Preview or Upload UI */}
        {preview ? (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 rounded-lg shadow-md mx-auto"
              />
            </div>

            {/* File Info */}
            {value && (
              <div className="text-sm text-gray-600">
                <p className="font-medium">{value.name}</p>
                <p className="text-gray-500">{formatFileSize(value.size)}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                Cambiar Imagen
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Upload Icon */}
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Upload Text */}
            <div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                Seleccionar Imagen
              </Button>
              <p className="mt-2 text-sm text-gray-500">o arrastra y suelta aquí</p>
            </div>

            {/* Constraints Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Formatos: JPG, PNG, WEBP, GIF</p>
              <p>Tamaño máximo: {IMAGE_CONSTRAINTS.MAX_SIZE_MB}MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {displayError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {displayError}
        </p>
      )}
    </div>
  );
}
