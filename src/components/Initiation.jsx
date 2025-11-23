'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';
import dynamic from 'next/dynamic';

// Currency formatter for Argentine Pesos (ARS)
const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const Footer = dynamic(() => import('./Footer'), { ssr: false });
const Loader = dynamic(() => import('./Loader'), { ssr: false });

const Initiation = ({ initialData }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState(initialData?.products || []);
  const [description, setDescription] = useState(initialData?.description || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [middleImages, setMiddleImages] = useState(initialData?.middleImages || []);
  const [footerImage, setFooterImage] = useState(initialData?.footerImage || '');
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const hasModalBeenClosed = useRef(false);
  const videoSource = isMobile ? '/initiationvertical.mp4' : '/initiation1.mp4';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!initialData) {
      const fetchInitiationCollection = async () => {
        try {
          const response = await Axios.get('https://eeva-api.vercel.app/api/v1/collections', {
            headers: { 'Cache-Control': 'public, max-age=3600' },
          });
          const initiationCollection = response.data.find(
            (collection) => collection.title.toUpperCase() === 'INITIATION'
          );

          if (initiationCollection) {
            const formattedProducts = initiationCollection.products.map((product) => {
              const price = Number(product.price);
              const discount = Number(product.discount) || 0;
              return {
                id: product._id,
                title: product.displayName || product.name || 'Producto sin título',
                subtitle: product.subtitle,
                image: `/static/${product.models.images.static}.webp`,
                gender: product.gender || 'unknown',
                price: isNaN(price) ? 'N/A' : price,
                discount: isNaN(discount) ? 0 : discount,
                createdAt: product.createdAt || product.date || product.updatedAt, // ← fecha original
              };
            });

            // ORDEN: MÁS NUEVO PRIMRE PRIMERO
            const sortedProducts = formattedProducts
              .map(p => ({
                ...p,
                date: new Date(p.createdAt || 0) // fallback si no hay fecha
              }))
              .sort((a, b) => b.date - a.date); // descendente = más nuevo arriba

            setProducts(sortedProducts);
            setDescription(initiationCollection.description || 'Descripción no disponible');
            setTitle(initiationCollection.title || 'Sin título');
            setSubtitle(initiationCollection.subtitle || 'Subtítulo no disponible');

            const formattedMiddleImages = initiationCollection.images.middle.map((image, index) => ({
              id: index + 1,
              image: `/${image}.webp`,
            }));
            setMiddleImages(formattedMiddleImages);
            setFooterImage(
              initiationCollection.images.footer
                ? `/${initiationCollection.images.footer}.webp`
                : '/footer_initiation.webp'
            );
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
    }

    const timer = setTimeout(() => {
      if (!hasModalBeenClosed.current) {
        setShowModal(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [initialData]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await Axios.post('https://eeva-api.vercel.app/api/v1/newsletters/create', {
        email,
      });
      setMessage('¡Suscripción exitosa! Te avisaremos cuando lancemos.');
      setEmail('');
      setTimeout(() => closeModal(), 2000);
    } catch (error) {
      setIsError(true);
      if (error.response?.status === 400) {
        setMessage('Este email ya está suscripto.');
      } else {
        setMessage('Ocurrió un error. Intenta más tarde.');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    hasModalBeenClosed.current = true;
    setEmail('');
    setMessage('');
    setIsError(false);
  };

  const productCards = useMemo(() => {
    return products.map((card) => {
      const discountedPrice = card.discount > 0 && card.price !== 'N/A'
        ? card.price - (card.price * card.discount / 100)
        : card.price;

      return (
        <Link
          key={card.id}
          href={`/collections/initiation/product/${card.id}`}
          className="group w-full h-auto relative flex flex-col"
          aria-label={`${card.title} - ${card.price !== 'N/A' ? priceFormatter.format(card.price) : 'Precio no disponible'}`}
        >
          <div className="h-[200px] md:h-[589px] xl:h-[509px] 2xl:h-[1000px] w-auto relative">
            <Image
              src={card.image}
              alt={card.title}
              fill
              priority
              className="object-contain 2xl:object-cover w-full h-auto"
            />
            {card.discount > 0 && (
              <div className="absolute top-1 md:top-10 right-1 md:right-4 inline-block px-2 py-1 rounded-[2px] bg-[#FCFDFD] text-[#232323] text-[8px] md:text-[10px]">
                {card.discount}% OFF
              </div>
            )}
          </div>
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]">
              SEE PRODUCT
            </span>
          </div>
          <div className="text-center mt-2 2xl:pt-[30px]">
            <h3 className="text-[#FFFFFF] text-[10px] md:text-[12px]">{card.title}</h3>
            {card.price !== 'N/A' ? (
              <div className="text-[#CCCCCC] text-[10px] md:text-[12px] mt-1 font-semibold">
                {card.discount > 0 ? (
                  <>
                    <p className="line-through">{priceFormatter.format(card.price)}</p>
                    <p>{priceFormatter.format(discountedPrice)}</p>
                  </>
                ) : (
                  <p>{priceFormatter.format(card.price)}</p>
                )}
              </div>
            ) : (
              <p className="text-[#CCCCCC] text-[10px] md:text-[12px] mt-1 font-semibold">
                Precio no disponible
              </p>
            )}
          </div>
        </Link>
      );
    });
  }, [products]);

  return (
    <>
      <Loader loading={loading} />
      {error ? (
        <div className="text-white text-center pt-[150px]">{error}</div>
      ) : (
        <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
          {/* <h1 className="text-white text-4xl font-bold pb-[20px] md:pb-[30px] uppercase">{title}</h1> */}
          <h1 className="text-white text-4xl font-bold pb-[20px] md:pb-[30px] uppercase">Concrete Summer </h1>

          <p className="text-white pl-[15px] pr-[15px] text-[10px] md:text-lg text-center max-w-2xl uppercase">
            {subtitle}
          </p>
          <p className="text-white pl-[15px] pr-[15px] text-[10px] md:text-lg text-center max-w-[1250px] mb-8 uppercase">
            {description}
          </p>

          <div className="relative w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/10]">
  <picture>
    {/* Móvil: hasta 768px */}
    <source
      media="(max-width: 767px)"
      srcSet="/portadaMobile.webp"
    />
    {/* Tablet y desktop */}
    <source
      media="(min-width: 768px)"
      srcSet="/portadaIni.webp"
    />
    {/* Fallback (por si el navegador no soporta <picture>) */}
    <Image
      src="/portadaIni.webp"
      alt="Portada Initiation"
      fill
      className="object-cover"
      priority
      sizes="100vw"
    />
  </picture>
</div>

          <div className="w-full max-w-[90%] mx-auto mt-[60px]">
            {/* Primer bloque de productos */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 2xl:gap-x-16">
              {productCards.slice(0, 8)}
            </div>

            {/* Sección videos middle */}
            <div className="mt-[60px] mb-[60px]">
              {/* Mobile */}
              <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {middleImages.map((item, index) => (
                  <div key={item.id} className="snap-center flex-shrink-0 w-[80%] max-w-[500px] mx-2">
                    <div className="relative">
                      <video
                        src={`/videos/middle/hero_middle_${index === 0 ? '11' : '22'}.MP4`}
                        poster={item.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-[400px] object-cover rounded-sm"
                      />
                      <Image src={item.image} alt={`Middle ${index + 1}`} fill className="object-cover rounded-sm -z-10" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="md:hidden max-w-[500px] w-full pl-[16px] flex justify-start">
                <p className="text-[#FFFFFF] pt-[20px] text-[12px]">INTENSO | FUERTE | AUDAZ W25</p>
              </div>

              {/* Desktop */}
              <div className="hidden md:grid md:grid-cols-2 md:gap-6">
                {middleImages.map((item, index) => (
                  <div key={item.id} className="flex flex-col items-center">
                    <div className="relative">
                      <video
                        src={`/videos/middle/hero_middle_${index === 0 ? '11' : '22'}.MP4`}
                        poster={item.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full max-w-[500px] md:max-w-[550px] xl:max-w-[560px] aspect-[4/5] object-cover rounded-sm"
                      />
                      <Image src={item.image} alt={`Middle ${index + 1}`} fill className="object-cover rounded-sm -z-10" />
                    </div>
                    {index === 0 && (
                      <div className="flex max-w-[500px] w-full md:max-w-[550px] xl:max-w-[560px] pl-[16px] justify-start">
                        <p className="text-[#FFFFFF] pt-[20px]">INTENSO | FUERTE | AUDAZ W25</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Segundo bloque (resto de productos) */}
            {products.length > 8 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 2xl:gap-x-16">
                {productCards.slice(8)}
              </div>
            )}
          </div>

          {footerImage && (
            <div className="relative h-[410px] md:h-[667px] w-full mt-[40px]">
              <Image src={'/footer_initiation.webp'} alt="Fondo Initiation" fill priority sizes="100vw" className="object-cover" />
              <div className="absolute top-[15px] md:top-[95px] right-0 p-4 text-white mr-[0px] md:mr-[40px] flex flex-col items-end">
                <h5 className="text-sm md:text-lg font-semibold">{title}</h5>
                <div className="text-[8px] md:text-[12px] w-[221px] md:w-[480px] text-right">
                  <p>Se buscó construir un universo que transmitiera una vision futurista y dramática. Se crea una sensacion de precisión, movimiento y poder generando una atmósfera única.</p>
                </div>
              </div>
            </div>
          )}

          <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
            <Footer />
          </div>

          {/* Modal newsletter */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
              <div className="bg-gray-500/40 border-[#f2f2f2] border-[0.5px] p-6 rounded-lg w-full max-w-md relative shadow-lg">
                <button onClick={closeModal} className="absolute top-2 right-2 text-white hover:text-gray-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-white text-lg font-semibold mb-4 text-center">Suscribite a nuestro Newsletter</h3>
                <p className="text-gray-300 text-sm mb-4 text-center">¡Sé el primero en enterarse!</p>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full bg-white bg-opacity-20 text-white placeholder-gray-300 px-4 text-sm focus:outline-none border border-[#DFDFDF]"
                    placeholder="Tu email"
                    required
                  />
                  <button type="submit" className="h-10 bg-[#DFDFDF] text-black text-sm hover:bg-[#cccccc] transition-colors">
                    Notificarme
                  </button>
                </form>
                {message && (
                  <p className={`text-sm text-center mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

/* ==============================================
   getServerSideProps – también ordenado por fecha
   ============================================== */
export async function getServerSideProps() {
  try {
    const response = await Axios.get('https://eeva-api.vercel.app/api/v1/collections');
    const initiationCollection = response.data.find(
      (collection) => collection.title.toUpperCase() === 'INITIATION'
    );

    if (!initiationCollection) {
      return { props: { initialData: null } };
    }

    const formattedProducts = initiationCollection.products.map((product) => {
      const price = Number(product.price);
      const discount = Number(product.discount) || 0;
      return {
        id: product._id,
        title: product.displayName || product.name || 'Producto sin título',
        subtitle: product.subtitle,
        image: `/static/${product.models.images.static}.webp`,
        gender: product.gender || 'unknown',
        price: isNaN(price) ? 'N/A' : price,
        discount: isNaN(discount) ? 0 : discount,
        createdAt: product.createdAt || product.date || product.updatedAt, // guardamos la fecha original
      };
    });

    // ORDEN: MÁS NUEVO PRIMERO (igual que en el cliente)
    const sortedProducts = formattedProducts
      .map(p => ({
        ...p,
        date: new Date(p.createdAt || 0)
      }))
      .sort((a, b) => b.date - a.date);

    return {
      props: {
        initialData: {
          products: sortedProducts,
          description: initiationCollection.description || 'Descripción no definida',
          title: initiationCollection.title || 'Sin título',
          subtitle: initiationCollection.subtitle || 'Subtítulo no definido',
          middleImages: initiationCollection.images.middle.map((image, index) => ({
            id: index + 1,
            image: `/${image}.webp`,
          })),
          footerImage: initiationCollection.images.footer
            ? `/${initiationCollection.images.footer}.webp`
            : '/evvaprevfooter.svg',
        },
      },
    };
  } catch (err) {
    console.error('Error en getServerSideProps:', err);
    return { props: { initialData: null } };
  }
}

export default Initiation;