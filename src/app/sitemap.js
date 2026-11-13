import { SITE_URL, API_URL, API_CACHE } from '@/lib/site';
import { findInitiation } from '@/lib/initiation';

const STATIC_ROUTES = [
  { path: '/collections/slider', priority: 1, changeFrequency: 'weekly' },
  { path: '/collections/initiation', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/collections/topsm', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/collections/topw', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/collections/bottomm', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/collections/bottomw', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/collections/accessoriesm', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/collections/accessoriesg', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/collections/newyork', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/collections/aboutus', priority: 0.5, changeFrequency: 'yearly' },
];

export const revalidate = 3600;

export default async function sitemap() {
  const entries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  try {
    const res = await fetch(`${API_URL}/collections`, API_CACHE);
    const initiation = res.ok ? findInitiation(await res.json()) : null;
    for (const product of initiation?.products || []) {
      entries.push({
        url: `${SITE_URL}/collections/initiation/product/${product._id}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
        ...(product.imageUrl && { images: [product.imageUrl] }),
      });
    }
  } catch (err) {
    console.error('Error al generar sitemap de productos:', err);
  }

  return entries;
}
