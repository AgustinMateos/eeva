// Datos globales del sitio para SEO. Definí NEXT_PUBLIC_SITE_URL en Vercel si el dominio cambia.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eevast.com').replace(/\/$/, '');
export const SITE_NAME = 'EEVA Studios';
export const SITE_DESCRIPTION =
  'EEVA Studios: marca de ropa de diseño argentina. Colección Concrete Summer con tops, pantalones, camperas, accesorios y ropa interior para hombre y mujer. Comprá online.';
export const INSTAGRAM_URL = 'https://www.instagram.com/eevastudios';
export const CONTACT_EMAIL = 'contacto@eevastudios.com';
export const API_URL = 'https://eeva-api.vercel.app/api/v1';

// Cache de los datos de la API (productos, colecciones, detalle de producto).
// Todo lo que viene de la API lleva el tag PRODUCTS_TAG: llamando a /api/revalidate se actualiza al instante.
// Si nadie avisa, igual se refresca solo cada API_REVALIDATE_SECONDS.
export const PRODUCTS_TAG = 'products';
export const API_REVALIDATE_SECONDS = 60;
export const API_CACHE = { next: { revalidate: API_REVALIDATE_SECONDS, tags: [PRODUCTS_TAG] } };

export const DEFAULT_OG_IMAGE = { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EEVA Studios - Concrete Summer' };

// Metadata de una página: título, descripción, canonical y Open Graph coherentes.
// Next reemplaza openGraph/twitter enteros (no los combina con el layout), por eso se repiten acá.
export function pageMetadata({ title, description, path, images = [DEFAULT_OG_IMAGE] }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'es_AR', siteName: SITE_NAME, title, description, url: path, images },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  };
}
