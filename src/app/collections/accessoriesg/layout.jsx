import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Accesorios',
  description: 'Guantes y accesorios de EEVA Studios para completar tu look. Diseño de autor argentino.',
  path: '/collections/accessoriesg',
});

export default function Layout({ children }) {
  return children;
}
