'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Miniaturas de 400px de ancho (frames 1 y 7 del 360) en /public/360/thumbs.
// Los originales miden ~4500x6800 y pesan 1-2 MB: no sirven para tarjetas de 200px.
// Si se agrega un producto nuevo, generar sus miniaturas con:
//   cd public/360 && cwebp -q 78 -resize 400 0 <nombre>-360-1.webp -o thumbs/<nombre>-360-1.webp
//   (y lo mismo con -7)
const thumb = (gif360, frame) => `/360/thumbs/${gif360}-${frame}.webp`;
const original = (gif360, frame) => `/360/${gif360}-${frame}.webp`;

function MarqueeCard({ product, hidden }) {
  // Hover por tarjeta: solo cambia (y descarga) la foto de la tarjeta que está bajo el mouse.
  const [hovered, setHovered] = useState(false);
  // Si falta la miniatura, se usa el original para que no quede una imagen rota.
  const [useOriginal, setUseOriginal] = useState(false);

  const frame = hovered ? 1 : 7;
  const src = useOriginal ? original(product.gif360, frame) : thumb(product.gif360, frame);

  return (
    <Link
      href={`/collections/initiation/product/${product._id}`}
      className="flex-shrink-0 mx-4 flex flex-col items-center snap-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // La segunda copia es solo para que la animación sea continua.
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <Image
        src={src}
        alt={hidden ? '' : product.displayName}
        width={200}
        height={300}
        sizes="200px"
        className="object-cover rounded-lg"
        style={{ height: 'auto' }}
        onError={() => setUseOriginal(true)}
      />
      <p className="text-white text-[12px] uppercase mt-2 text-center">{product.displayName}</p>
    </Link>
  );
}

// Los productos llegan desde el servidor (page.jsx), así que no hay fetch en el navegador.
export default function Marquee({ products = [] }) {
  if (products.length === 0) return null;

  return (
    <div className="w-full overflow-hidden py-8 flex justify-center md:h-[500px]">
      <div className="w-full">
        <div className="text-white w-full flex justify-center font-normal text-base leading-[64px] tracking-[-4%] align-middle">
          <p className="w-[80%]">También te puede gustar</p>
        </div>
        <div className="marquee-wrapper w-full overflow-x-auto md:overflow-hidden snap-x snap-mandatory">
          {/* Cada tarjeta ocupa ~232px: ~6 s por tarjeta mantiene la velocidad en ~40px/s
              sin importar cuántos productos haya. */}
          <div className="marquee flex items-center" style={{ animationDuration: `${products.length * 6}s` }}>
            {products.map((product) => (
              <MarqueeCard key={product._id} product={product} />
            ))}
            {products.map((product) => (
              <MarqueeCard key={`${product._id}-copia`} product={product} hidden />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-wrapper { scrollbar-width: none; -ms-overflow-style: none; }
        .marquee-wrapper::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) {
          .marquee { width: max-content; animation-name: marquee; animation-timing-function: linear; animation-iteration-count: infinite; }
          .marquee:hover { animation-play-state: paused; }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee { animation: none; }
        }
        @keyframes marquee {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
