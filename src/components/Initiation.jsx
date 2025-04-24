'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from './Footer';

const cardData1 = [
  { id: 1, title: 'Native Iron Tunk', image: '/NativeIronTunk.svg' },
  { id: 2, title: 'Century Dashe', image: '/CenturyDashe.svg' },
  { id: 3, title: 'Native Dark Jean', image: '/NativeDarkJean.svg' },
  { id: 4, title: 'Paola Wood Shirt', image: '/PaolaWoodShirt.svg' },
  { id: 5, title: 'Native Iron Tunk', image: '/NativeIronTunk2.svg' },
  { id: 6, title: 'Century Dashe', image: '/CenturyDashe2.svg' },
  { id: 7, title: 'Native Dark Jean', image: '/NativeDarkJean2.svg' },
  { id: 8, title: 'Paola Wood Shirt', image: '/PaolaWoodShirt2.svg' },
];

const cardData2 = [...cardData1];

const ImgMiddle = [
  { id: 1, image: '/InitiationMiddle.svg' },
  { id: 2, image: '/InitiationMiddle2.svg' },
];

const Initiation = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      <h1 className="text-white text-4xl font-bold pb-[30px]">INITIATION</h1>
      <p className="text-white text-lg text-center max-w-2xl uppercase">
        “INITIATION” Winter 2025 reinterpreta el futuro.
      </p>
      <p className="text-white text-lg text-center max-w-[1250px] mb-8 uppercase">
        Más allá de diseños extravagantes, apuesta por lo puro, lo simple y lo intencional. Líneas limpias, caídas estructuradas y monocromía absoluta dan forma a prendas pensadas para transmitir fuerza, identidad y cohesión.
      </p>

      {/* Contenedor del video */}
      <div className="relative h-[610px] w-full">
        <video
          ref={videoRef}
          src="/initiation.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />
        <button
          onClick={toggleSound}
          className="absolute bottom-4 flex justify-center items-center left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded-md text-sm"
        >
          {isMuted ? 'Allow Sound' : 'Deny Sound'}
          <Image src="/sound.svg" alt="Sound Toggle" width={32} height={32} />
        </button>
      </div>

      <div className="w-full max-w-[90%] mx-auto mt-[60px]">
        {/* Primer grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cardData1.map((card) => (
            <Link
              key={card.id}
              href={`/products/${card.id}`}
              className="group w-full max-w-[289px] mx-auto h-auto relative flex flex-col"
            >
              <Image
                src={card.image}
                alt={card.title}
                width={289}
                height={415}
                className="object-cover w-full h-auto"
              />
              <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
                  SEE PRODUCT
                </span>
              </div>
              <h3 className="text-[#FFFFFF] text-center mt-2">{card.title}</h3>
            </Link>
          ))}
        </div>

        {/* Segundo grid con las imágenes centradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[60px] mb-[60px]">
          {ImgMiddle.map((card) => (
            <div key={card.id} className="flex justify-center items-center h-auto">
              <Image
                src={card.image}
                alt={`Middle image ${card.id}`}
                width={500}
                height={900}
                className="object-cover w-full max-w-[500px] h-auto"
              />
            </div>
          ))}
        </div>

        {/* Tercer grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {cardData2.map((card) => (
            <Link
              key={card.id}
              href={`/products/${card.id}`}
              className="group w-full max-w-[289px] mx-auto h-auto relative flex flex-col"
            >
              <Image
                src={card.image}
                alt={card.title}
                width={289}
                height={415}
                className="object-cover w-full h-auto"
              />
              <div className="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
                  SEE PRODUCT
                </span>
              </div>
              <h3 className="text-[#FFFFFF] text-center mt-2">{card.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative h-[410px] md:h-[667px] w-full mt-[40px]">
        <Image
          src="/evvaprevfooter.svg"
          alt="Initiation Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="h-[315px] flex md:min-w-[1315px]">
        <Footer />
      </div>
    </div>
  );
};

export default Initiation;
