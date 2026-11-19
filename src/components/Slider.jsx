import { getImageProps } from 'next/image';
import Link from 'next/link';

const options = [
  {
    id: 4,
    name: 'New Collection',
    // La foto de desktop ya trae el texto "NEW COLLECTION / Spring 2026".
    bgImage: '/spring2026-hero.webp',
    bgImageSize: { width: 4096, height: 1596 },
    mobileBgImage: '/spring2026-mobile.webp',
    mobileBgImageSize: { width: 1080, height: 1920 },
    estado: 'Spring 2026',
    detalle: 'Hombre y Mujer',
    fecha: '17 | 11 | 26',
    estadoAccion: 'Shop',
    link: '/collections/initiation',
  },
];

// Sin estado ni efectos: se renderiza en el servidor, así la imagen
// viene en el HTML inicial y el navegador elige desktop o mobile por CSS media query.
export default function Slider() {
  const option = options[0];
  const common = { alt: 'New Collection Spring 2026, Hombre y Mujer', sizes: '100vw', fetchPriority: 'high', loading: 'eager' };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, ...option.bgImageSize, src: option.bgImage });

  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, ...option.mobileBgImageSize, src: option.mobileBgImage });

  return (
    <Link href={option.link} aria-label={`${option.name} ${option.estado} ${option.detalle}: ${option.estadoAccion}`}
      className="relative block w-full h-[100vh] overflow-hidden bg-black">
      <picture>
        {/* Mismo corte que el breakpoint `md` de Tailwind (768px). */}
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes="100vw" />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...imgProps} className="absolute inset-0 w-full h-full object-cover" />
      </picture>

      {/* Mismo bloque de texto que tenía la portada de Initiation: en mobile
          arriba (sobre la pared) y en desktop centrado en el medio. */}
      <div className="absolute inset-x-0 top-[110px] md:top-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center px-4">
        <div className="text-white text-center md:scale-110 md:p-4 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
          {/* En desktop la foto ya trae "NEW COLLECTION / Spring 2026". */}
          <h3 className="text-lg font-semibold uppercase md:hidden">{option.name}</h3>
          <p className="md:hidden">{option.estado}</p>
          <p>{option.detalle}</p>
          <p>{option.fecha}</p>
          <p className="pt-[10px] text-[18px] font-bold">{option.estadoAccion}</p>
        </div>
      </div>
    </Link>
  );
}
