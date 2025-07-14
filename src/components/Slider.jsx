'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const options = [
  {
    id: 3,
    name: 'Initiation',
    bgImage: '/initiationslider.jpg',
    mobileBgImage: '/initiation.jpg',
    estado: '25 | 06 | 25',
    estadoAccion: 'Shop',
    link: '/collections/initiation',
  },
];

export default function Slider() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const option = options[0];

  return (
    <div className="relative w-full h-[100vh] overflow-hidden bg-black">
      <Image
        src={isMobile ? option.mobileBgImage : option.bgImage}
        alt="Initiation slide"
        fill
        priority
        className="absolute inset-0 object-cover"
      />
      <div className="absolute top-[350px] md:top-[400px] left-0 right-0 flex items-center justify-center">
        <div className="w-[60%] xl:w-[20%] px-4 scale-110 z-10">
          <div className="flex h-full items-center justify-center">
            <div className="text-white rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold uppercase">{option.name}</h3>
              <p>{option.estado}</p>
              <Link href={option.link}>
                <p className='pt-[10px] text-[18px] font-bold xl:pt-[0px]'>{option.estadoAccion}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}