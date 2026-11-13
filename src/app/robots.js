import { SITE_URL } from '@/lib/site';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Páginas privadas o de checkout: no aportan al posicionamiento
      disallow: ['/cart', '/order', '/success', '/failure', '/pending'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
