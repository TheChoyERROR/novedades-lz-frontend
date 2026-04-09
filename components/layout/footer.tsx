import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--footer-background)] text-[var(--footer-foreground)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/brand/logo.png"
                alt="Logo de Novedades LZ"
                width={168}
                height={168}
                className="h-auto w-32 object-contain sm:w-36"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              Tu tienda de confianza para encontrar productos utiles, bonitos y con
              atencion cercana desde Casa Grande para todo el pais.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://www.facebook.com/novedadeslz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/72 transition-colors hover:border-primary-300 hover:bg-primary-500 hover:text-white"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://wa.me/51939662630"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/72 transition-colors hover:border-primary-300 hover:bg-primary-500 hover:text-white"
              >
                <span className="sr-only">WhatsApp</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
              Enlaces rapidos
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-white/66 transition-colors hover:text-primary-300"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-white/66 transition-colors hover:text-primary-300"
                >
                  Carrito
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-white/66 transition-colors hover:text-primary-300"
                >
                  Rastrear pedido
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-white/66">
              <li>Casa Grande</li>
              <li>+51 939 662 630</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/56">
            © {currentYear} Novedades LZ. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
