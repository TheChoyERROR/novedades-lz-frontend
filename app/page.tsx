import { redirect } from 'next/navigation';

// La tienda arranca directo en el catalogo para simplificar el flujo de compra
export default function Home() {
  redirect('/products');
}
