'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProductGrid } from '@/components/products';
import { Button } from '@/components/ui';
import { productService } from '@/services/product.service';
import { Product } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts({ page: 0, size: 8 });
        setProducts(response.content);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-600 to-primary-400 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_36%)]" />
        <div className="absolute -left-20 top-16 h-56 w-56 rounded-full bg-white/12 blur-3xl" />
        <div className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-primary-200/18 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
              <Image
                src="/brand/logo.png"
                alt="Logo de Novedades LZ"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                priority
              />
              <span className="text-sm font-medium text-white/90">
                Casa Grande | Envios rapidos | Atencion por WhatsApp
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Tu tienda con personalidad,
              <span className="block text-primary-100">
                novedades y entregas rapidas
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-primary-100 sm:text-2xl">
              Descubre productos utiles y bonitos con una experiencia mas cercana,
              simple y pensada para comprar sin vueltas.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/40 text-white hover:border-white hover:bg-white/12 hover:text-white sm:w-auto"
                >
                  Ver productos
                </Button>
              </Link>
              <Link href="/track-order">
                <Button
                  size="lg"
                  variant="white"
                  className="w-full sm:w-auto"
                >
                  Rastrear pedido
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Calidad garantizada',
                description:
                  'Cada producto se revisa para que llegue con buena presentacion y funcione como esperas.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                ),
              },
              {
                title: 'Envio rapido',
                description:
                  'Despachamos con agilidad para que recibas tus compras sin procesos pesados ni demoras innecesarias.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                ),
              },
              {
                title: 'Soporte cercano',
                description:
                  'Si tienes dudas o necesitas seguimiento, te respondemos por WhatsApp con atencion humana.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-surface px-6 py-8 text-center shadow-[0_16px_32px_rgba(89,11,49,0.06)]"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <svg
                    className="h-8 w-8 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-flex rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary-700">
              Favoritos de la tienda
            </span>
            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Productos destacados
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Una seleccion de novedades para que encuentres rapido lo mas pedido.
            </p>
          </div>

          <ProductGrid products={products} isLoading={isLoading} />

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg">Ver todos los productos</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-primary-200/50 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 px-8 py-12 text-center text-white shadow-[0_24px_60px_rgba(89,11,49,0.18)]">
            <h2 className="text-3xl font-bold">¿Tienes alguna pregunta?</h2>
            <p className="mt-4 text-xl text-primary-100">
              Escribenos por WhatsApp y te ayudamos al instante.
            </p>
            <a
              href="https://wa.me/51939662630"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block"
            >
              <Button
                size="lg"
                variant="white"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chatea con nosotros
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
