import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout';
import { ThemeProvider } from '@/components/theme/theme-provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

/**
 * Base para resolver las URLs relativas de metadata a absolutas. Sin esto, og:image y og:url
 * salen relativos y WhatsApp no muestra previsualizacion al compartir.
 *
 * El respaldo usa la variable que Vercel inyecta sola en cada despliegue. Antes era un dominio
 * escrito a mano que no existia, asi que si NEXT_PUBLIC_SITE_URL faltaba se generaba una
 * previsualizacion con una imagen rota, sin ningun error visible.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelDomain) {
    return `https://${vercelDomain}`;
  }

  return 'http://localhost:3000';
}

const siteUrl = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Novedades LZ - Tu tienda de confianza',
  description:
    'Encuentra los mejores productos con calidad garantizada y envio rapido a todo el pais.',
  keywords: ['tienda', 'ecommerce', 'productos', 'novedades', 'compras online'],
  authors: [{ name: 'Novedades LZ' }],
  openGraph: {
    title: 'Novedades LZ - Tu tienda de confianza',
    description:
      'Encuentra los mejores productos con calidad garantizada y envio rapido a todo el pais.',
    type: 'website',
    locale: 'es_PE',
    siteName: 'Novedades LZ',
    // Sin imagen, compartir el enlace de la tienda por WhatsApp mostraba solo texto plano.
    // Las paginas de producto sobrescriben esto con la foto del producto.
    images: [{ url: '/brand/logo.png', width: 1200, height: 630, alt: 'Novedades LZ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Novedades LZ - Tu tienda de confianza',
    description:
      'Encuentra los mejores productos con calidad garantizada y envio rapido a todo el pais.',
    images: ['/brand/logo.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#e4308c',
};

const themeScript = `
  (function () {
    try {
      var storageKey = 'novedades-theme';
      var storedTheme = localStorage.getItem(storageKey);
      var theme = storedTheme === 'dark' || storedTheme === 'light'
        ? storedTheme
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.style.colorScheme = 'light';
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
