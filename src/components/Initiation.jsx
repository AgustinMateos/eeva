// import React, { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import Axios from 'axios';
// import Footer from './Footer';
// import Loader from './Loader';

// const Initiation = () => {
//   const videoRef = useRef(null);
//   const [isMuted, setIsMuted] = useState(true);
//   const [products, setProducts] = useState([]);
//   const [description, setDescription] = useState('');
//   const [title, setTitle] = useState('');
//   const [subtitle, setSubtitle] = useState('');
//   const [middleImages, setMiddleImages] = useState([]);
//   const [footerImage, setFooterImage] = useState(''); // Initialize with fallback
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInitiationCollection = async () => {
//       try {
//         const response = await Axios.get('https://eeva-api.vercel.app/api/v1/collections');
//         const initiationCollection = response.data.find(
//           (collection) => collection.title.toUpperCase() === 'INITIATION'
//         );
//         if (initiationCollection) {
//           const formattedProducts = initiationCollection.products.map((product) => ({
//             id: product._id,
//             title: product.displayName || product.name || 'Producto sin título',
//             subtitle: product.subtitle,
//             image: `/static/${product.models.images.static}.webp`,
//             gender: product.gender || 'unknown',
//           }));

//           const sortedProducts = [];
//           const maleProducts = formattedProducts.filter((p) => p.gender.toLowerCase() === 'male');
//           const femaleProducts = formattedProducts.filter((p) => p.gender.toLowerCase() === 'female');
//           const maxLength = Math.max(maleProducts.length, femaleProducts.length);

//           for (let i = 0; i < maxLength; i++) {
//             if (i < maleProducts.length) {
//               sortedProducts.push(maleProducts[i]);
//             }
//             if (i < femaleProducts.length) {
//               sortedProducts.push(femaleProducts[i]);
//             }
//           }

//           const otherProducts = formattedProducts.filter(
//             (p) => p.gender.toLowerCase() !== 'male' && p.gender.toLowerCase() !== 'female'
//           );
//           sortedProducts.push(...otherProducts);

//           setProducts(sortedProducts);
//           setDescription(initiationCollection.description || 'Descripción no disponible');
//           setTitle(initiationCollection.title || 'Sin título');
//           setSubtitle(initiationCollection.subtitle || 'Subtítulo no disponible');
//           const formattedMiddleImages = initiationCollection.images.middle.map((image, index) => ({
//             id: index + 1,
//             image: `/${image}.webp`,
//           }));
//           setMiddleImages(formattedMiddleImages);
//           setFooterImage(initiationCollection.images.footer ? `/${initiationCollection.images.footer}.webp` : '/evvaprevfooter.svg');
//         } else {
//           setError('Colección INITIATION no encontrada');
//         }
//         setLoading(false);
//       } catch (err) {
//         setError('Error al obtener la colección');
//         setLoading(false);
//       }
//     };

//     fetchInitiationCollection();
//   }, []);

//   const toggleSound = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !videoRef.current.muted;
//       setIsMuted(videoRef.current.muted);
//     }
//   };

//   return (
//     <>
//       <Loader loading={loading} />
//       {error ? (
//         <div className="text-white text-center pt-[150px]">{error}</div>
//       ) : (
//         <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
//           <h1 className="text-white text-4xl font-bold pb-[20px] md:pb-[30px] uppercase">
//             {title}
//           </h1>
//           <p className="text-white pl-[15px] pr-[15px] text-[10px] md:text-lg text-center max-w-2xl uppercase">
//             {subtitle}
//           </p>
//           <p className="text-white pl-[15px] pr-[15px] text-[10px] md:text-lg text-center max-w-[1250px] mb-8 uppercase">
//             {description}
//           </p>

//           <div className="relative h-[610px] w-full">
//             <video
//               ref={videoRef}
//               src="/initiation.mp4"
//               autoPlay
//               loop
//               muted={isMuted}
//               playsInline
//               className="w-full h-full object-cover"
//             />
//             <button
//               onClick={toggleSound}
//               className="absolute bottom-4 flex justify-center items-center left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded-md text-sm"
//             >
//               {isMuted ? 'ALLOW SOUND' : 'DENY SOUND'}
//               <Image 
//               src="/sound.svg"  alt="Control de Sonido" width={32} height={32} />
//             </button>
//           </div>

//           <div className="w-full max-w-[90%] mx-auto mt-[60px]">
//             {/* Primer grid de tarjetas de productos (primeros 8) */}
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {products.slice(0, 8).map((card) => (
//                 <Link
//                   key={card.id}
//                   href={`/collections/initiation/product/${card.id}`}
//                   className="group w-full h-auto relative flex flex-col"
//                 >
//                   <div className='h-[315px] md:h-[589px] xl:h-[549px] 2xl:h-[650px] w-[139px] md:w-[289px]'>
//                     <Image
//                       src={card.image}
//                       alt={card.title}
//                       fill
//                       loading="eager"
//                       className="object-contain w-full h-auto"
//                     /></div>

//                   <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                     <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
//                       SEE PRODUCT
//                     </span>
//                   </div>
//                   <h3 className="text-[#FFFFFF] text-[10px] md:text-[12px] text-center mt-2">
//                     {card.title}
//                   </h3>
//                 </Link>
//               ))}
//             </div>

//             {/* Segundo grid con imágenes centradas (slider en móvil) */}
//             {/* Segundo grid con imágenes centradas (slider en móvil) */}
//             {/* Segundo grid con imágenes centradas (slider en móvil) */}
//             <div className="mt-[60px] mb-[60px]">
//               {/* Mobile slider */}
//               <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
//                 {middleImages.map((card) => (
//                   <div
//                     key={card.id}
//                     className="snap-center flex-shrink-0 w-[80%] max-w-[500px] mx-2"
//                   >
//                     <Image
//                       src={card.image}
//                       alt={`Imagen central ${card.id}`}
//                       width={500}
//                       height={900}
//                       loading="eager"
//                       className="object-cover w-full h-[400px] md:h-auto"
//                     />
//                   </div>
//                 ))}
//               </div>
//               {/* Mobile text */}
//               <div className='md:hidden max-w-[500px] w-full md:max-w-[550px] xl:max-w-[560px] pl-[16px] flex justify-start'>
//                         <p className="text-[#FFFFFF]  pt-[20px] text-center text-[12px]">
//                           INTENSO | FUERTE | AUDAZ W25
//                         </p></div>
//               {/* Desktop grid */}
//               <div className="hidden md:grid md:grid-cols-2 md:gap-6">
//                 {middleImages.map((card, index) => (
//                   <div key={card.id} className="flex flex-col  items-center h-auto">
//                     <Image
//                       src={card.image}
//                       alt={`Imagen central ${card.id}`}
//                       width={500}
//                       height={625}
//                       loading="eager"
//                       className="object-contain w-full max-w-[500px] md:max-w-[550px] xl:max-w-[560px] aspect-[4/5]"
//                     />
//                     {/* Render the text below the first image only */}
//                     {index === 0 && (
//                       <div className='flex max-w-[500px] w-full md:max-w-[550px] xl:max-w-[560px] pl-[16px] justify-start'>
//                         <p className="text-[#FFFFFF]  pt-[20px] text-center">
//                           INTENSO | FUERTE | AUDAZ W25
//                         </p></div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Segundo grid de tarjetas (resto de productos) */}
//             {products.length > 8 && (
//               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {products.slice(8).map((card) => (
//                   <Link
//                     key={card.id}
//                     href={`/collections/initiation/product/${card.id}`}
//                     className="group w-full h-auto relative flex flex-col"
//                   >
//                     <div className='h-[315px] md:h-[589px] xl:h-[549px] 2xl:h-[650px] w-[139px] md:w-[289px]'>
//                       <Image
//                         src={card.image}
//                         alt={card.title}
//                         fill
//                         loading="eager"
//                         className="object-contain w-full h-auto"
//                       /></div>
//                     <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                       <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
//                         SEE PRODUCT
//                       </span>
//                     </div>
//                     <h3 className="text-[#FFFFFF] text-[10px] md:text-[12px] text-center mt-2">
//                       {card.title}
//                     </h3>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer image section */}
//           {footerImage && (
//             <div className="relative h-[410px] md:h-[667px] w-full mt-[40px]">
//               <Image
//                 src={footerImage}
//                 alt="Fondo Initiation"
//                 fill
//                 loading="eager"
//                 className="object-cover"
//                 priority
//               />
//               <div className="absolute top-[15px] flex flex-col justify-end md:top-[95px] right-0 p-4 text-white mr-[0px] md:mr-[40px]">
//                 <h5 className="text-sm md:text-lg font-semibold flex justify-end">{title}</h5>
//                 <div className="text-[8px] text-end md:text-[12px] w-[100%] flex justify-end md:w-[480px]">
//                   <p className="w-[221px] md:w-[480px]">
//                     Lorem ipsum dolor sit amet consectetur, adipiscing elit curae mi tincidunt nec, nulla
//                     eleifend nullam mattis. Sapien erat curae pellentesque parturient porta vel tempor
//                     hendrerit.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
//             <Footer />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Initiation;