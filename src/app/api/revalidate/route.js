import { revalidateTag } from 'next/cache';
import { PRODUCTS_TAG } from '@/lib/site';

/**
 * Actualiza al instante todo lo que viene de la API (categorías, Initiation, detalle de productos).
 *
 * La API tiene que llamarlo cada vez que se crea, edita o borra un producto/colección:
 *
 *   POST https://www.eevast.com/api/revalidate
 *   Header: x-revalidate-secret: <REVALIDATE_SECRET>
 *
 * REVALIDATE_SECRET se define como variable de entorno en Vercel (mismo valor en la web y en la API).
 * Si nadie llama a este endpoint, los datos igual se refrescan solos cada API_REVALIDATE_SECONDS.
 */
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ revalidated: false, message: 'REVALIDATE_SECRET no configurado' }, { status: 500 });
  }
  if (request.headers.get('x-revalidate-secret') !== secret) {
    return Response.json({ revalidated: false, message: 'Secreto inválido' }, { status: 401 });
  }

  // expire: 0 → el próximo visitante ya ve los datos nuevos (no la versión anterior)
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}
