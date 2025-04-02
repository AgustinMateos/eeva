'use client'
import React, { useState, useRef } from 'react';
import Image from 'next/image';
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
  { id: 2, image: '/InitiationMiddle2.svg' }
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
      <h3 className="text-white text-lg text-center max-w-2xl mb-8">
        “INITIATION” Winter 2025 reinterpreta el futuro. Más allá de diseños extravagantes, apuesta por lo puro, lo simple y lo intencional. Líneas limpias, caídas estructuradas y monocromía absoluta dan forma a prendas pensadas para transmitir fuerza, identidad y cohesión.
      </h3>

      {/* Contenedor del video */}
      <div className="relative h-[410px] w-full">
        <video
          ref={videoRef}
          src="/initiation.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Botón para controlar el sonido */}
        <button
          onClick={toggleSound}
          className="absolute bottom-4 flex justify-center items-center left-1/2 transform -translate-x-1/2  text-white px-4 py-2 rounded-md text-sm "
        >
          {isMuted ? 'Allow Sound' : 'Deny Sound'}
          <Image
            src="/sound.svg"
            alt="Sound Toggle"
            width={32}
            height={32}
          />
        </button>
       
      </div>

      <div className="w-[80%] mt-[60px]">
        {/* Primer grid de cards */}
        <div className="grid grid-cols-4 gap-6">
          {cardData1.map((card) => (
            <div key={card.id} className="group h-[457px] w-[289px] relative flex flex-col">
              <Image
                src={card.image}
                alt={card.title}
                width={289}
                height={415}
                className="object-cover"
              />
              <div className="absolute inset-0 flex justify-center items-center  bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-md font-semibold">SEE PRODUCT</span>
              </div>
              <h3 className="text-[#FFFFFF] text-center mt-2">{card.title}</h3>
            </div>
          ))}
        </div>

        {/* Segundo grid con las imágenes centradas */}
        <div className="grid grid-cols-2 gap-6 mt-[60px] mb-[60px]">
          {ImgMiddle.map((card) => (
            <div key={card.id} className="flex justify-center items-center h-[942px]">
              <Image
                src={card.image}
                alt={`Middle image ${card.id}`}
                width={500}
                height={900}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Tercer grid de cards */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          {cardData2.map((card) => (
            <div key={card.id} className="group h-[457px] w-[289px] relative flex flex-col">
              <Image
                src={card.image}
                alt={card.title}
                width={289}
                height={415}
                className="object-cover"
              />
              <div className="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-md font-semibold">SEE PRODUCT</span>
              </div>
              <h3 className="text-[#FFFFFF] text-center mt-2">{card.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-[410px] w-full mt-[40px]">
        <Image
          src="/evvaprevfooter.svg"
          alt="Initiation Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="h-[315px] flex min-w-[1315px]">
        <Footer />
      </div>
    </div>
  );
};

export default Initiation;
