'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';
import Footer from './Footer';

export default function NewYork() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [products, setProducts] = useState([]);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [middleImages, setMiddleImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlurred, setIsBlurred] = useState(true);
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const fetchInitiationCollection = async () => {
      try {
        const response = await Axios.get('https://eeva-api.vercel.app/api/v1/collections');
        const initiationCollection = response.data.find(
          (collection) => collection.title.toUpperCase() === 'INITIATION'
        );
        if (initiationCollection) {
          const formattedProducts = initiationCollection.products.map((product) => ({
            id: product._id,
            title: product.displayName || product.name || 'Producto sin título',
            subtitle: product.subtitle,
            image: `/${product.models.images.static}.svg`,
          }));
          setProducts(formattedProducts);
          setDescription(initiationCollection.description || 'Descripción no disponible');
          setTitle(initiationCollection.title || 'Sin título');
          setSubtitle(initiationCollection.subtitle || 'Subtítulo no disponible');

          const formattedMiddleImages = initiationCollection.images.middle.map((image, index) => ({
            id: index + 1,
            image: `/${image}.svg`,
          }));
          setMiddleImages(formattedMiddleImages);

          // Compare releaseDate with current date
          const releaseDate = new Date(initiationCollection.releaseDate);
          const currentDate = new Date();
          if (currentDate >= releaseDate) {
            setIsBlurred(false);
          }
        } else {
          setError('Colección INITIATION no encontrada');
        }
        setLoading(false);
      } catch (err) {
        setError('Error al obtener la colección');
        setLoading(false);
      }
    };

    fetchInitiationCollection();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const releaseDate = new Date('2025-07-15T00:00:00.000Z');
    const updateCountdown = () => {
      const currentDate = new Date();
      const timeDifference = releaseDate - currentDate;

      if (timeDifference <= 0) {
        setIsBlurred(false);
        setCountdown({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        });
        return;
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  if (error) {
    return <div className="text-white text-center pt-[150px]">{error}</div>;
  }

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      <h1 className="text-white text-4xl font-bold pb-[20px] md:pb-[30px] uppercase">
        {title}
      </h1>
      <p className="text-white pl-[15px] pr-[15px] text-[10px] md:text-lg text-center max-w-2xl uppercase">
        {subtitle}
      </p>
      <p className="text-white pl-[15px] pr-[15px] text-[10px] md:text-lg text-center max-w-[1250px] mb-8 uppercase">
        {description}
      </p>

      <div className="relative h-[610px] w-full">
        <video
          ref={videoRef}
          src="/initiation.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className={`w-full h-full object-cover ${isBlurred ? 'filter blur-md' : ''}`}
        />
        {isBlurred && (
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-50">
            <div className="w-[80%] md:w-[580px] flex flex-col text-[#F9F9F9] justify-around items-center space-y-6 md:space-y-8">
              <p className="font-ibm font-medium text-[38px] leading-[100%] tracking-[-0.02em] text-center uppercase text-[#F9F9F9]">
                {`${countdown.days}:${countdown.hours}:${countdown.minutes}:${countdown.seconds}`}
              </p>
              <p className="text-sm md:text-base mt-2 uppercase">Próximamente</p>
              <p className="text-sm md:text-base text-center">
                BE THE FIRST TO KNOW WHEN WE GO LIVE
              </p>
              <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="text"
                  className="h-12 rounded-l-md rounded-r-md sm:rounded-r-none w-full sm:w-4/5 bg-white bg-opacity-20 text-white placeholder-gray-300 backdrop-blur-md px-4 text-sm md:text-base focus:outline-none border border-[#DFDFDF]"
                  placeholder="Enter your email address"
                />
                <button className="h-12 w-full sm:w-1/5 bg-[#DFDFDF] rounded-r-md rounded-l-md sm:rounded-l-none text-black text-sm md:text-base">
                  Notify me
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={toggleSound}
          className={`absolute bottom-4 flex justify-center items-center left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded-md text-sm ${isBlurred ? 'filter blur-md pointer-events-none' : ''}`}
        >
          {isMuted ? 'ALLOW SOUND' : 'DENY SOUND'}
          <Image src="/sound.svg" alt="Control de Sonido" width={32} height={32} />
        </button>
      </div>

      <div className="w-full max-w-[90%] mx-auto mt-[60px]">
        {/* First product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((card) => (
            <div key={card.id} className={isBlurred ? 'pointer-events-none' : ''}>
              <Link
                href={isBlurred ? '#' : `/collections/initiation/product/${card.id}`}
                className="group w-full h-auto relative flex flex-col"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  width={289}
                  height={415}
                  className={`object-cover w-full h-auto ${isBlurred ? 'filter blur-md' : ''}`}
                />
                {!isBlurred && (
                  <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
                      SEE PRODUCT
                    </span>
                  </div>
                )}
                <h3 className="text-[#FFFFFF] text-[10px] md:text-[12px] text-center mt-2">
                  {card.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>

        {/* Middle images (slider on mobile) */}
        <div className="mt-[60px] mb-[60px]">
          <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {middleImages.map((card) => (
              <div
                key={card.id}
                className="snap-center flex-shrink-0 w-[80%] max-w-[500px] mx-2"
              >
                <Image
                  src={card.image}
                  alt={`Imagen central ${card.id}`}
                  width={500}
                  height={900}
                  className={`object-cover w-full h-auto ${isBlurred ? 'filter blur-md' : ''}`}
                />
              </div>
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            {middleImages.map((card) => (
              <div key={card.id} className="flex justify-center items-center h-auto">
                <Image
                  src={card.image}
                  alt={`Imagen central ${card.id}`}
                  width={500}
                  height={900}
                  className={`object-cover w-full max-w-[500px] h-auto ${isBlurred ? 'filter blur-md' : ''}`}
                />
              </div>
            ))}
          </div>
          <p className={`text-[#FFFFFF] pl-[10px] md:pl-[68px] pt-[20px] ${isBlurred ? 'filter blur-md' : ''}`}>
            INTENSO | FUERTE | AUDAZ I25
          </p>
        </div>

        {/* Second product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {products.map((card) => (
            <div key={card.id} className={isBlurred ? 'pointer-events-none' : ''}>
              <Link
                href={isBlurred ? '#' : `/products/${card.id}`}
                className="group w-full h-auto relative flex flex-col"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  width={289}
                  height={415}
                  className={`object-cover w-full h-auto ${isBlurred ? 'filter blur-md' : ''}`}
                />
                {!isBlurred && (
                  <div className="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
                      VER PRODUCTO
                    </span>
                  </div>
                )}
                <h3 className="text-[#FFFFFF] text-[10px] md:text-[12px] text-center mt-2">
                  {card.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-[410px] md:h-[667px] w-full mt-[40px]">
        <Image
          src="/evvaprevfooter.svg"
          alt="Fondo Initiation"
          fill
          className={`object-cover ${isBlurred ? 'filter blur-md' : ''}`}
        />
        <div className={`absolute top-[95px] right-0 p-4 text-white mr-[0px] md:mr-[40px] ${isBlurred ? 'filter blur-md' : ''}`}>
          <h5 className="text-sm md:text-lg font-semibold flex justify-end">{title}</h5>
          <div className="text-[8px] text-end md:text-[12px] w-[100%] flex justify-end md:w-[480px]">
            <p className="w-[281px] md:w-[480px]">
              Lorem ipsum dolor sit amet consectetur, adipiscing elit curae mi tincidunt nec, nulla
              eleifend nullam mattis. Sapien erat curae pellentesque parturient porta vel tempor
              hendrerit.
            </p>
          </div>
        </div>
      </div>

      <div className="h-[315px] md:h-[415px] flex md:min-w-[1315px]">
        <Footer />
      </div>
    </div>
  );
}