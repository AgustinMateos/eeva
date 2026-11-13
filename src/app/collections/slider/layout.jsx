import { SITE_NAME, SITE_DESCRIPTION, pageMetadata } from '@/lib/site';

// Portada del sitio: "/" redirige acá
export const metadata = {
  ...pageMetadata({
    title: `${SITE_NAME} | Ropa de diseño argentina`,
    description: SITE_DESCRIPTION,
    path: '/collections/slider',
  }),
  title: { absolute: `${SITE_NAME} | Ropa de diseño argentina` },
};

export default function Layout({ children }) {
  return children;
}
