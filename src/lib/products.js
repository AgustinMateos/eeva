import { API_URL, API_CACHE } from './site';

export const PRODUCTS_URL = `${API_URL}/products`;

// Se queda solo con los productos de la categoría y con los campos que usan los listados
export function filterCategory(products, type, gender) {
  return products
    .filter((product) => product.type === type && product.gender === gender)
    .map((product) => ({
      _id: product._id,
      displayName: product.displayName,
      models: { images: { static: product.models?.images?.static } },
    }));
}

// Se pide en el servidor y se cachea (ver API_CACHE): la API tarda ~4s, así nadie espera esa respuesta.
// Next deduplica el fetch, así que las 6 categorías comparten la misma respuesta cacheada.
export async function getCategoryProducts(type, gender) {
  try {
    const res = await fetch(PRODUCTS_URL, API_CACHE);
    if (!res.ok) return null;
    return filterCategory(await res.json(), type, gender);
  } catch (err) {
    console.error(`Error al obtener productos ${type} ${gender}:`, err);
    return null;
  }
}
