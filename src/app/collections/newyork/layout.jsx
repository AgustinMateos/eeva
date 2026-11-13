import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Colección New York',
  description: 'Colección New York de EEVA Studios: prendas de diseño argentino inspiradas en la ciudad.',
  path: '/collections/newyork',
});

export default function Layout({ children }) {
  return children;
}
