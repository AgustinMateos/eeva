import { getImageProps } from 'next/image';
import Link from 'next/link';

const options = [
  {
    id: 3,
    name: 'Concrete summer',
    bgImage: '/summer-hero.webp',
    bgImageSize: { width: 2400, height: 1350 },
    mobileBgImage: '/summerMobile.webp',
    mobileBgImageSize: { width: 1001, height: 1334 },
    estado: '22 | 11 | 25',
    estadoAccion: 'Shop',
    link: '/collections/initiation',
  },
];

// Sin estado ni efectos: se renderiza en el servidor, así la imagen
// viene en el HTML inicial y el navegador elige desktop o mobile por CSS media query.
export default function Slider() {
  const option = options[0];
  const common = { alt: 'Initiation slide', sizes: '100vw', fetchPriority: 'high', loading: 'eager' };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, ...option.bgImageSize, src: option.bgImage });

  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, ...option.mobileBgImageSize, src: option.mobileBgImage });

  return (
    <div className="relative w-full min-h-[100vh] md:h-[100vh] overflow-hidden bg-black">
      <picture>
        <source media="(min-width: 769px)" srcSet={desktopSrcSet} sizes="100vw" />
        <source media="(max-width: 768px)" srcSet={mobileSrcSet} sizes="100vw" />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...imgProps} className="absolute inset-0 w-full h-full object-cover" />
      </picture>
      <div className="absolute top-[350px] md:top-[400px] left-0 right-0 flex items-center justify-center">
        <div className="w-[60%] xl:w-[20%] px-4 scale-110 z-10">
          <div className="flex h-full items-center justify-center">
            <div className="text-white rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold uppercase">{option.name}</h3>
              <p>{option.estado}</p>
              <Link href={option.link}>
                <p className="pt-[10px] text-[18px] font-bold xl:pt-[0px]">{option.estadoAccion}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
