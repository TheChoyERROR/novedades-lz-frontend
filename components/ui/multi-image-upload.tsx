'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IMAGE_CONSTRAINTS, formatFileSize, validateImageFile } from '@/lib/utils/image-validation';
import { Button } from './button';
import { cn } from '@/lib/utils/cn';

interface MultiImageUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  currentImageUrls?: string[];
  error?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  maxFiles?: number;
  className?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  currentImageUrls = [],
  error,
  disabled = false,
  label = 'Fotos del Producto',
  helperText,
  maxFiles = 3,
  className,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const previews = value.map((file) => URL.createObjectURL(file));
    setSelectedPreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [value]);

  const previewUrls = selectedPreviews.length > 0 ? selectedPreviews : currentImageUrls;
  const displayError = error || validationError;

  const validateFiles = (files: File[]) => {
    if (files.length === 0) {
      setValidationError(null);
      onChange([]);
      return;
    }

    if (files.length > maxFiles) {
      setValidationError(`Solo puedes subir hasta ${maxFiles} imagenes por producto`);
      onChange([]);
      return;
    }

    const validatedFiles: File[] = [];

    for (const file of files) {
      const validation = validateImageFile(file);

      if (!validation.isValid) {
        setValidationError(validation.error);
        onChange([]);
        return;
      }

      validatedFiles.push(validation.file);
    }

    setValidationError(null);
    onChange(validatedFiles);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    validateFiles(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(event.dataTransfer.files ?? []);
    validateFiles(files);
  };

  const handleRemoveSelection = () => {
    setValidationError(null);
    onChange([]);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveSelectedFile = (index: number) => {
    const nextFiles = value.filter((_, currentIndex) => currentIndex !== index);
    setValidationError(null);
    onChange(nextFiles);

    if (nextFiles.length === 0 && inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {helperText && <span className="ml-2 font-normal text-gray-500">{helperText}</span>}
      </label>

      <div
        className={cn(
          'rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragging && !disabled && 'border-indigo-500 bg-indigo-50',
          !isDragging && !displayError && 'border-gray-300 hover:border-indigo-400',
          displayError && 'border-red-300 bg-red-50',
          disabled && 'cursor-not-allowed bg-gray-50 opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={IMAGE_CONSTRAINTS.ALLOWED_TYPES.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {previewUrls.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previewUrls.map((previewUrl, index) => (
                <div key={`${previewUrl}-${index}`} className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <div className="relative aspect-square">
                    <Image
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {value.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedFile(index)}
                      className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-red-600 shadow"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              ))}
            </div>

            {value.length > 0 && (
              <div className="space-y-1 text-sm text-gray-600">
                {value.map((file) => (
                  <div key={`${file.name}-${file.size}`} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="truncate pr-4">{file.name}</span>
                    <span className="text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                {value.length > 0 ? 'Cambiar Fotos' : 'Reemplazar Galeria'}
              </Button>
              {value.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveSelection}
                  disabled={disabled}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Limpiar Seleccion
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                Seleccionar Fotos
              </Button>
              <p className="mt-2 text-sm text-gray-500">o arrastra varias imagenes aqui</p>
            </div>

            <div className="space-y-1 text-xs text-gray-500">
              <p>Hasta {maxFiles} fotos por producto</p>
              <p>Formatos: JPG, PNG, WEBP, GIF</p>
              <p>Tamano maximo por foto: {IMAGE_CONSTRAINTS.MAX_SIZE_MB}MB</p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p className="flex items-center gap-1 text-sm text-red-600">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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
