import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout';
import { ThemeProvider } from '@/components/theme/theme-provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
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
  },
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
