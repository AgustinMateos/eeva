'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';
import Footer from './Footer';

const Initiation = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [products, setProducts] = useState([]);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState(''); // Nuevo estado para subtitle
  const [middleImages, setMiddleImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener la colección INITIATION al montar el componente
  useEffect(() => {
    const fetchInitiationCollection = async () => {
      try {
        const response = await Axios.get('https://eeva-api.vercel.app/api/v1/collections');
        // Buscar la colección
        const initiationCollection = response.data.find(
          (collection) => collection.title.toUpperCase() === 'INITIATION'
        );
        if (initiationCollection) {
          // Formatear productos
          const formattedProducts = initiationCollection.products.map((product) => ({
            id: product._id,
            title: product.displayName || product.name || 'Producto sin título',
            subtitle: product.subtitle,
            image: `/static/${product.models.images.static}.webp`,
          }));
          setProducts(formattedProducts);
          setDescription(initiationCollection.description || 'Descripción no disponible');
          setTitle(initiationCollection.title || 'Sin título');
          setSubtitle(initiationCollection.subtitle || 'Subtítulo no disponible'); // Guardar el subtitle
          // Formatear imágenes middle
          const formattedMiddleImages = initiationCollection.images.middle.map((image, index) => ({
            id: index + 1,
            image: `/${image}.svg`,
          }));
          setMiddleImages(formattedMiddleImages);
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

  // Alternar el sonido del video
  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Si hay un error, mostrar el mensaje de error
  if (error) {
    return <div className="text-white text-center pt-[150px]">{error}</div>;
  }

  // Si está cargando, no renderizar nada
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
      {/* Descripción obtenida del endpoint */}
      <p className="text-white pl-[15px] pr-[15px] text-[10px] md:text-lg text-center max-w-[1250px] mb-8 uppercase">
        {description}
      </p>

      {/* Resto del JSX sin cambios */}
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
          {isMuted ? 'ALLOW SOUND' : 'DENY SOUND'}
          <Image src="/sound.svg" alt="Control de Sonido" width={32} height={32} />
        </button>
      </div>

      <div className="w-full max-w-[90%] mx-auto mt-[60px]">
        {/* Primer grid de tarjetas de productos */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((card) => (
            <Link
              key={card.id}
              href={`/collections/initiation/product/${card.id}`}
              className="group w-full h-auto relative flex flex-col"
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
              <h3 className="text-[#FFFFFF] text-[10px] md:text-[12px] text-center mt-2">
                {card.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Segundo grid con imágenes centradas (slider en móvil) */}
        <div className="mt-[60px] mb-[60px]">
          {/* Slider para móvil */}
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
                  className="object-cover w-full h-auto"
                />
              </div>
            ))}
          </div>
          {/* Grid para escritorio */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            {middleImages.map((card) => (
              <div key={card.id} className="flex justify-center items-center h-auto">
                <Image
                  src={card.image}
                  alt={`Imagen central ${card.id}`}
                  width={500}
                  height={900}
                  className="object-cover w-full max-w-[500px] h-auto"
                />
              </div>
            ))}
          </div>
          <p className="text-[#FFFFFF] pl-[10px] md:pl-[68px] pt-[20px]">
            INTENSO | FUERTE | AUDAZ I25
          </p>
        </div>

        {/* Segundo grid de tarjetas (mismos productos) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {products.map((card) => (
            <Link
              key={card.id}
              href={`/products/${card.id}`}
              className="group w-full h-auto relative flex flex-col"
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
                  VER PRODUCTO
                </span>
              </div>
              <h3 className="text-[#FFFFFF] text-[10px] md:text-[12px] text-center mt-2">
                {card.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Imagen con texto en la esquina superior derecha */}
      <div className="relative h-[410px] md:h-[667px] w-full mt-[40px]">
        <Image
          src="/evvaprevfooter.svg"
          alt="Fondo Initiation"
          fill
          className="object-cover"
        />
        <div className="absolute top-[95px] right-0 p-4 text-white mr-[0px] md:mr-[40px]">
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
};

export default Initiation;