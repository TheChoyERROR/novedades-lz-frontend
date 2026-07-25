/**
 * El backend ya no acepta el id del pedido como unica credencial: exige el `publicToken` que
 * devuelve al crear o al rastrear el pedido. Aqui se guardan esos tokens para que el cliente
 * pueda volver a su pedido despues de recargar o cerrar la pestana, sin necesidad de cuenta.
 */

const STORAGE_KEY = 'order-access-tokens';

/** Cota para que el almacenamiento no crezca indefinidamente en el navegador del cliente. */
const MAX_STORED_TOKENS = 30;

type TokenMap = Record<string, string>;

function readTokenMap(): TokenMap {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return parsed as TokenMap;
  } catch {
    return {};
  }
}

export function rememberOrderToken(orderId: number, token?: string | null) {
  if (typeof window === 'undefined' || !token) {
    return;
  }

  try {
    const tokens = readTokenMap();
    tokens[String(orderId)] = token;

    // Las claves mas recientes quedan al final; se descartan las mas antiguas.
    const entries = Object.entries(tokens).slice(-MAX_STORED_TOKENS);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // Modo privado o cuota llena: el token de la URL sigue funcionando para esta sesion.
  }
}

export function getRememberedOrderToken(orderId: number): string | null {
  if (!Number.isFinite(orderId)) {
    return null;
  }

  return readTokenMap()[String(orderId)] ?? null;
}

/**
 * Prioriza el token de la URL (recien llegado del checkout o del rastreo) y cae al guardado.
 */
export function resolveOrderToken(orderId: number, tokenFromUrl?: string | null): string | null {
  if (tokenFromUrl) {
    return tokenFromUrl;
  }

  return getRememberedOrderToken(orderId);
}
