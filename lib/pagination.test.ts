import { describe, expect, it } from 'vitest';
import { DEFAULT_PAGE_SIZE, normalizePageSize, toPageIndex } from './pagination';

describe('normalizePageSize', () => {
  it('acepta los tamanos ofrecidos en el selector', () => {
    expect(normalizePageSize(24)).toBe(24);
    expect(normalizePageSize('48')).toBe(48);
  });

  it('rechaza un tamano que no esta en la lista', () => {
    // Sin este tope, un ?mostrar=100000 pediria el catalogo entero de una vez.
    expect(normalizePageSize(100000)).toBe(DEFAULT_PAGE_SIZE);
    expect(normalizePageSize(7)).toBe(DEFAULT_PAGE_SIZE);
  });

  it('cae al valor por defecto ante basura', () => {
    expect(normalizePageSize('abc')).toBe(DEFAULT_PAGE_SIZE);
    expect(normalizePageSize(undefined)).toBe(DEFAULT_PAGE_SIZE);
    expect(normalizePageSize(-5)).toBe(DEFAULT_PAGE_SIZE);
  });
});

describe('toPageIndex', () => {
  it('traduce la pagina visible al indice del backend', () => {
    expect(toPageIndex(1)).toBe(0);
    expect(toPageIndex('3')).toBe(2);
  });

  it('protege de valores invalidos o negativos', () => {
    expect(toPageIndex(0)).toBe(0);
    expect(toPageIndex(-4)).toBe(0);
    expect(toPageIndex('hola')).toBe(0);
    expect(toPageIndex(undefined)).toBe(0);
  });
});
