'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSiteStore } from '@/stores/site-store';
import { CAROUSEL_BASE_PATH, cybermomCarousel } from '@/lib/campaigns/campaign-config';
import { uploadToCloudinary } from '@/lib/utils/cloudinary-upload';
import { Card, CardContent, CardHeader, Button } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import type { CarouselConfig } from '@/lib/campaigns/campaign-config';

export function SiteSettings() {
  const { carousel, setCarousel, resetCarousel } = useSiteStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<CarouselConfig>(carousel);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleStartEdit = () => {
    setDraft(carousel);
    setIsEditing(true);
  };

  const handleSave = () => {
    setCarousel(draft);
    setIsEditing(false);
    setUploadError(null);
  };

  const handleCancel = () => {
    setDraft(carousel);
    setIsEditing(false);
    setUploadError(null);
  };

  const handleAddSlide = () => {
    setDraft({
      ...draft,
      slideCount: draft.slideCount + 1,
      alts: [...draft.alts, ''],
      srcs: [...draft.srcs, ''],
    });
  };

  const handleRemoveSlide = (index: number) => {
    setDraft({
      ...draft,
      slideCount: draft.slideCount - 1,
      alts: draft.alts.filter((_, i) => i !== index),
      srcs: draft.srcs.filter((_, i) => i !== index),
    });
  };

  const handleUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    setUploadError(null);

    try {
      const result = await uploadToCloudinary(file);
      const nextSrcs = [...draft.srcs];
      nextSrcs[index] = result.secure_url;
      setDraft({ ...draft, srcs: nextSrcs });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error al subir imagen');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleLoadCybermom = () => {
    setCarousel(cybermomCarousel);
    setDraft(cybermomCarousel);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Carousel del Inicio</h2>
          <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
            {carousel.slideCount} imagen{carousel.slideCount !== 1 ? 'es' : ''}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleStartEdit}>
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadCybermom}>
            Cargar slides Cybermom
          </Button>
          <Button variant="ghost" size="sm" onClick={resetCarousel}>
            Limpiar
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4 rounded-lg border border-gray-200 p-4">
            {draft.slideCount > 0 && (
              <div className="space-y-4">
                {Array.from({ length: draft.slideCount }, (_, i) => {
                  const isUploading = uploadingIndex === i;

                  return (
                    <div key={i} className="rounded-md border border-gray-200 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">Slide {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlide(i)}
                          className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100"
                        >
                          Quitar
                        </button>
                      </div>

                      <div className="relative aspect-[1916/821] max-h-[120px] overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        {draft.srcs[i] ? (
                          <Image
                            src={draft.srcs[i]}
                            alt={draft.alts[i] || `Slide ${i + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={draft.srcs[i].startsWith('https://')}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            Sin imagen — sube una o usa la ruta default
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                            <Spinner size="sm" />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUpload(i, file);
                              e.target.value = '';
                            }}
                            disabled={isUploading}
                          />
                          <span className={`inline-flex w-full items-center justify-center rounded-md border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isUploading ? 'Subiendo...' : 'Subir imagen'}
                          </span>
                        </label>
                      </div>

                      <input
                        type="text"
                        value={draft.srcs[i] || ''}
                        onChange={(e) => {
                          const next = [...draft.srcs];
                          next[i] = e.target.value;
                          setDraft({ ...draft, srcs: next });
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs"
                        placeholder={`${CAROUSEL_BASE_PATH}/slide-${i + 1}.webp`}
                      />

                      <input
                        type="text"
                        value={draft.alts[i] || ''}
                        onChange={(e) => {
                          const next = [...draft.alts];
                          next[i] = e.target.value;
                          setDraft({ ...draft, alts: next });
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs"
                        placeholder="Texto alternativo para la imagen"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}

            <button
              type="button"
              onClick={handleAddSlide}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
            >
              + Agregar slide
            </button>

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={handleSave}>Guardar</Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>Cancelar</Button>
            </div>
          </div>
        ) : carousel.slideCount > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array.from({ length: carousel.slideCount }, (_, i) => (
              <div key={i} className="relative aspect-[1916/821] overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                <Image
                  src={carousel.srcs[i] || `${CAROUSEL_BASE_PATH}/slide-${i + 1}.webp`}
                  alt={carousel.alts[i] || `Slide ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={carousel.srcs[i]?.startsWith('https://')}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin slides configurados. Edita para agregar imagenes al carousel.
          </p>
        )}
      </CardContent>
    </Card>
  );
}