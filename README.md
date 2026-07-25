# Novedades LZ — Frontend

Tienda en Next.js 16 (App Router), desplegada en Vercel contra el backend Spring Boot en Render.

## Variables de entorno

Configurarlas en Vercel (Project Settings → Environment Variables) y en `.env.local` para desarrollo.

| Variable | Obligatoria | Para que sirve |
| --- | --- | --- |
| `API_BASE_URL` | Si | URL **absoluta** del backend, usada al renderizar en el servidor. Ej: `https://tu-servicio.onrender.com/api` |
| `NEXT_PUBLIC_API_BASE_URL` | Si | La misma URL, usada desde el navegador |
| `NEXT_PUBLIC_SITE_URL` | Si | URL publica del sitio. Sin ella, `og:image` y `og:url` salen relativos y WhatsApp no muestra previsualizacion |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | Subida de imagenes del carrusel desde el panel admin |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | No | Preset sin firma para esa subida |
| `NEXT_PUBLIC_CLOUDINARY_WATERMARK_ID` | No | `public_id` de la marca de agua sobre las fotos de producto |
| `NEXT_PUBLIC_YAPE_RECIPIENT_PHONE` | No | Numero de Yape que se muestra al cliente |

`API_BASE_URL` tiene que ser absoluta porque el `/api` relativo solo funciona en el navegador: en el
servidor no hay origen contra el cual resolverlo, y las paginas de producto se renderizan ahi.

## Previsualizacion al compartir

Las paginas de producto se renderizan en el servidor y publican metadatos Open Graph con el nombre,
el precio y la foto. Asi, compartir un enlace por WhatsApp muestra la tarjeta con imagen en vez de
solo la URL. Las imagenes de Cloudinary se sirven en 1200x630 con relleno, para que no se recorte el
producto.

Para que funcione en produccion hacen falta dos cosas:

- `NEXT_PUBLIC_SITE_URL` configurada
- Cloudinary configurado en el backend, para que las fotos tengan URL `https` publica

Si el backend guarda las imagenes en disco local, las URLs no son accesibles desde fuera y la
previsualizacion se queda sin imagen.

## Desarrollo

```bash
npm install
npm run dev
```

Con el backend corriendo en `http://localhost:8080`, el `rewrite` de `next.config.ts` redirige
`/api/*` hacia el, asi que en local no hace falta configurar `NEXT_PUBLIC_API_BASE_URL`. Para
renderizado en servidor si hace falta `API_BASE_URL=http://localhost:8080/api`.

## Comandos

```bash
npm run build   # build de produccion
npm run lint    # eslint
npx tsc --noEmit  # typecheck
```
