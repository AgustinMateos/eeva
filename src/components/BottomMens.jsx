'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';
import Footer from './Footer';

// Inline Loader Component
const Loader = ({ loading, imageLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let interval;
    if (loading || !imageLoaded) {
      // Simulate progress based on both data loading and image loading
      interval = setInterval(() => {
        setProgress((prev) => {
          // Calculate progress: 50% for data, 50% for image
          const dataProgress = loading ? prev / 2 : 50; // Data contributes 50%
          const imageProgress = imageLoaded ? 50 : prev / 2; // Image contributes 50%
          const totalProgress = Math.min(dataProgress + imageProgress, 100);

          if (totalProgress >= 100) {
            // Delay hiding the loader for smooth transition
            setTimeout(() => {
              setIsVisible(false);
            }, 500); // 500ms delay after reaching 100%
            return 100;
          }
          return prev + 1; // Increment progress (adjust for smoother animation)
        });
      }, 30); // Update every 30ms
    } else {
      // When both are complete, set to 100% and hide
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }

    return () => clearInterval(interval);
  }, [loading, imageLoaded]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-50 bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[30ms] ease-linear"
        style={{
          backgroundImage: 'url(/lineasCodigo.svg)',
          clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
        }}
      ></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
        <span
          className="font-medium text-2xl leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          Initiating SYSTEM
        </span>
        <div className="w-[305px] md:w-[405px] h-7 rounded-[2px] border border-[#F2F2F2] p-2 bg-[#FFFFFF1A] overflow-hidden">
          <div
            className="h-full bg-[#D9D9D9] transition-all duration-[30ms] ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span
          className="font-light text-lg leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          {Math.floor(progress)}%
        </span>
      </div>
    </div>
  );
};

export default function BottomMens() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Preload the background image
    const img = new window.Image();
    img.src = '/lineasCodigo.svg';
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load background image');
      setImageLoaded(true); // Proceed even if image fails to load
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await Axios.get('https://eeva-api.vercel.app/api/v1/products');
        const filteredProducts = response.data.filter(
          (product) => product.type === 'BOTTOM' && product.gender === 'MALE'
        );
        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading || !imageLoaded) {
    return <Loader loading={loading} imageLoaded={imageLoaded} />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      <p className="text-white text-lg w-full max-w-[20rem] sm:max-w-[75rem] 2xl:max-w-[95rem] border-b border-[#AEAEAE] uppercase">
        BOTTOM - MEN
      </p>

      <div className="w-full max-w-[90%] mx-auto mt-[40px]">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product._id}
                href={`/collections/initiation/product/${product._id}`}
                className="group w-full max-w-[289px] mx-auto h-auto relative flex flex-col"
              >
                <div className="h-[315px] md:h-[589px] xl:h-[500px] 2xl:h-[540px] w-[139px] md:w-[289px]">
                  <Image
                    src={`/static/${product.models.images.static}.webp`}
                    alt={product.displayName}
                    fill
                    priority
                    className="object-contain w-full h-auto"
                  />
                </div>
                <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
                    SEE PRODUCT
                  </span>
                </div>
                <h3 className="text-[#FFFFFF] text-center mt-2">{product.displayName}</h3>
              </Link>
            ))
          ) : (
            <p className="text-white text-center col-span-4">No men's ACCESSORIES found</p>
          )}
        </div>
      </div>

      <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
            <Footer />
          </div>
    </div>
  );
}
// 'use client';

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import Axios from 'axios';
// import Footer from './Footer';

// // Inline Loader Component
// const Loader = ({ loading }) => {
//   const [progress, setProgress] = useState(0);
//   const [isVisible, setIsVisible] = useState(true); // Control loader visibility

//   useEffect(() => {
//     if (loading) {
//       // Increment progress while loading
//       const interval = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 100) {
//             // Delay hiding the loader to ensure rendering
//             setTimeout(() => {
//               setIsVisible(false);
//             }, 200); // 200ms delay after reaching 100%
//             return 100; // Cap at 100%
//           }
//           return prev + 0.3333; // Increment: 100% over 3000ms (3000ms / 100 * 0.3333 ≈ 30ms per step)
//         });
//       }, 30); // 3s animation: 3000ms / 100 steps = 30ms per step

//       return () => clearInterval(interval);
//     } else {
//       // When loading is false, set progress to 100% immediately
//       setProgress(100);
//       // Delay hiding the loader
//       setTimeout(() => {
//         setIsVisible(false);
//       }, 200); // 200ms delay for smooth transition
//     }
//   }, [loading]);

//   // Hide loader when not visible
//   if (!isVisible) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 w-full h-full overflow-hidden z-50 bg-gradient-to-r from-[#303F48] to-[#6D7276]">
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-all duration-[30ms] ease-linear"
//         style={{
//           backgroundImage: 'url(/lineasCodigo.svg)',
//           clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
//         }}
//       ></div>
//       <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
//         <span
//           className="font-medium text-2xl leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
//           style={{ fontFamily: 'IBM Plex Mono' }}
//         >
//           Initiating SYSTEM
//         </span>
//         <div
//           className="w-[305px] md:w-[405px] h-7 rounded-[2px] border border-[#F2F2F2] p-2 bg-[#FFFFFF1A] overflow-hidden"
//         >
//           <div
//             className="h-full bg-[#D9D9D9] transition-all duration-[30ms] ease-linear"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//         <span
//           className="font-light text-lg leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
//           style={{ fontFamily: 'IBM Plex Mono' }}
//         >
//           {Math.floor(progress)}%
//         </span>
//       </div>
//     </div>
//   );
// };

// export default function Topg() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await Axios.get('https://eeva-api.vercel.app/api/v1/products');
//         // Filter products for type: "ACCESSORIES" and gender: "FEMALE"
//         const filteredProducts = response.data.filter(
//           (product) => product.type === 'ACCESSORIES' && product.gender === 'MALE'
//         );
//         setProducts(filteredProducts);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch products');
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return <Loader loading={loading} />;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
//       <p className="text-white text-lg w-full max-w-[20rem] sm:max-w-[75rem] 2xl:max-w-[95rem]  border-b border-[#AEAEAE] uppercase">
//       ACCESSORIES - MEN
//       </p>

//       <div className="w-full max-w-[90%] mx-auto mt-[40px]">
//         {/* Grid de cards */}
//         <div className="grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <Link
//                 key={product._id}
//                 href={`/collections/initiation/product/${product._id}`}
//                 className="group w-full max-w-[289px] mx-auto h-auto relative flex flex-col"
//               >
               
//                 <div className='h-[315px] md:h-[589px] xl:h-[500px] 2xl:h-[540px] w-[139px] md:w-[289px]'>
//                                       <Image
//                                          src={`/static/${product.models.images.static}.webp`} // Adjust image path as per your setup
//                                          alt={product.displayName}
//                                         fill
//                                         priority
//                                         className="object-contain w-full h-auto"
//                                       /></div>
//                 <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                   <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
//                     SEE PRODUCT
//                   </span>
//                 </div>
//                 <h3 className="text-[#FFFFFF] text-center mt-2">{product.displayName}</h3>
//               </Link>
//             ))
//           ) : (
//             <p className="text-white text-center col-span-4">No men's ACCESSORIES found</p>
//           )}
//         </div>
//       </div>

//       <div className="h-[315px] flex md:min-w-[1315px]">
//         <Footer />
//       </div>
//     </div>
//   );
// }