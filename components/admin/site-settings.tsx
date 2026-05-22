'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSiteStore } from '@/stores/site-store';
import { CAROUSEL_BASE_PATH, cybermomCampaign, cybermomCarousel } from '@/lib/campaigns/campaign-config';
import { uploadToCloudinary } from '@/lib/utils/cloudinary-upload';
import { Card, CardContent, CardHeader, Button } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import type { CarouselConfig, CampaignConfig } from '@/lib/campaigns/campaign-config';

function CarouselSection() {
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

function CampaignSection() {
  const { campaign, setCampaign, setCampaignEnabled, resetCampaign } = useSiteStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<CampaignConfig>(campaign);

  const handleToggle = () => {
    setCampaignEnabled(!campaign.enabled);
  };

  const handleCybermomPreset = () => {
    setCampaign({ ...cybermomCampaign });
    setEditDraft({ ...cybermomCampaign });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditDraft(campaign);
    setIsEditing(true);
  };

  const handleSave = () => {
    setCampaign(editDraft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditDraft(campaign);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Campana Activa</h2>
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            campaign.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {campaign.enabled ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={campaign.enabled ? 'danger' : 'primary'}
            size="sm"
            onClick={handleToggle}
          >
            {campaign.enabled ? 'Desactivar' : 'Activar'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCybermomPreset}>
            Cargar preset Cybermom
          </Button>
          <Button variant="outline" size="sm" onClick={handleStartEdit}>
            Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={resetCampaign}>
            Limpiar
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-3 rounded-lg border border-gray-200 p-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={editDraft.name}
                onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ej: Cybermom"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Etiqueta de descuento</label>
              <input
                type="text"
                value={editDraft.discountLabel}
                onChange={(e) => setEditDraft({ ...editDraft, discountLabel: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ej: 30% OFF"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Badge en tarjeta</label>
              <input
                type="text"
                value={editDraft.cardBadge}
                onChange={(e) => setEditDraft({ ...editDraft, cardBadge: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ej: Cybermom -30%"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha / rango</label>
              <input
                type="text"
                value={editDraft.dateRange}
                onChange={(e) => setEditDraft({ ...editDraft, dateRange: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ej: Del 28 de abril al 10 de mayo"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Titulo</label>
              <input
                type="text"
                value={editDraft.headline}
                onChange={(e) => setEditDraft({ ...editDraft, headline: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ej: Cybermom: regalos para mama con 30% OFF"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitulo</label>
              <input
                type="text"
                value={editDraft.subheadline}
                onChange={(e) => setEditDraft({ ...editDraft, subheadline: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Texto descriptivo"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Intro catalogo</label>
              <input
                type="text"
                value={editDraft.catalogIntro}
                onChange={(e) => setEditDraft({ ...editDraft, catalogIntro: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Texto que aparece en la pagina de productos"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">URL WhatsApp</label>
              <input
                type="text"
                value={editDraft.whatsappUrl}
                onChange={(e) => setEditDraft({ ...editDraft, whatsappUrl: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://wa.me/..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={handleSave}>Guardar</Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>Cancelar</Button>
            </div>
          </div>
        ) : campaign.enabled ? (
          <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-muted-foreground">Nombre</span>
                <p className="font-medium">{campaign.name}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Descuento</span>
                <p className="font-medium">{campaign.discountLabel}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Badge</span>
                <p className="font-medium">{campaign.cardBadge}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Fecha</span>
                <p className="font-medium">{campaign.dateRange}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay campana activa. Activa una existente o carga un preset para comenzar.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function SiteSettings() {
  return (
    <div className="space-y-6">
      <CarouselSection />
      <CampaignSection />
    </div>
  );
}