import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Sobre nosotros',
  description: 'Conocé EEVA Studios: quiénes somos, envíos, cambios y devoluciones, y cómo contactarnos.',
  path: '/collections/aboutus',
});

export default function Layout({ children }) {
  return children;
}
