import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Tops y remeras de mujer',
  description: 'Tops, remeras, bandeaus y camperas de mujer de EEVA Studios. Diseño argentino con siluetas marcadas y telas de calidad.',
  path: '/collections/topw',
});

export default function Layout({ children }) {
  return children;
}
