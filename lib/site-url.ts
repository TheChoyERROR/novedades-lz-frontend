/**
 * URL publica del sitio, resuelta en el servidor.
 *
 * <p>Se usa para los metadatos de Open Graph, para el catalogo en PDF y para los enlaces que la
 * clienta comparte. Vive aqui porque la logica estaba repetida en tres lugares y cualquier
 * divergencia produce enlaces rotos que nadie nota hasta que alguien los abre.
 *
 * <p>El respaldo usa la variable que Vercel inyecta sola en cada despliegue; nunca un dominio
 * escrito a mano, que es como llegamos a publicar una previsualizacion con la imagen rota.
 */
export function resolveSiteUrl(): string {
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

export function buildProductUrl(productId: number): string {
  return `${resolveSiteUrl()}/products/${productId}`;
}
