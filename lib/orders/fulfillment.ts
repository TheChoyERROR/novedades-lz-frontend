/**
 * La tienda atiende de dos formas y cada una necesita datos distintos del cliente.
 *
 * El campo se sigue llamando `paymentMethod` en el backend, pero en la practica define tambien
 * como recibe el pedido: quien paga por Yape recibe envio, y quien paga en efectivo pasa por el
 * local a recogerlo. Pedirle la direccion a quien va a venir caminando solo agrega pasos.
 */

export const YAPE = 'yape';
export const PICKUP = 'cash';

export const WHATSAPP_URL = 'https://wa.me/51939662630';

export const fulfillmentOptions: { value: string; label: string }[] = [
  { value: YAPE, label: 'Yape - te lo enviamos' },
  { value: PICKUP, label: 'Recojo en tienda - pagas al recoger' },
];

/** Solo los pedidos con envio necesitan direccion. */
export function requiresShippingAddress(paymentMethod: string | null | undefined): boolean {
  return paymentMethod !== PICKUP;
}

export function isPickupOrder(paymentMethod: string | null | undefined): boolean {
  return paymentMethod === PICKUP;
}

export function fulfillmentLabel(paymentMethod: string | null | undefined): string {
  return isPickupOrder(paymentMethod) ? 'Recojo en tienda' : 'Envio a domicilio';
}
