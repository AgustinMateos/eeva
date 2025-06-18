'use client'; // Ensure this is a Client Component in Next.js

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';


export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const socialLinks = {
    instagram: 'https://www.instagram.com/eevastudios?igsh=bzA3YXhwaWdiNjBm&utm_source=qr', // Cambia por la URL real
    tiktok: 'https://www.tiktok.com/@eeva.studios?_t=ZM-8vl83zKp6UJ&_r=1', // Cambia por la URL real
    facebook: 'https://www.facebook.com/Eevastudios', // Cambia por la URL real
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await axios.post('https://eeva-api.vercel.app/api/v1/newsletters/create', {
        email,
      });
      setMessage('Successfully subscribed! You will be notified when we go live.');
      setEmail(''); // Clear the input
    } catch (error) {
      setIsError(true);
      if (error.response?.status === 400) {
        setMessage('This email is already subscribed.');
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div
        className="w-full h-[100vh] bg-cover bg-no-repeat flex items-center bg-center md:bg-top bg-pos-mobile"
        style={{ backgroundImage: "url('/bgHome.png')" }}
      >
        <div className="flex flex-col items-center justify-between w-full h-full py-6 md:py-12">
          {/* Logo superior */}
          <div className="w-full flex justify-center h-16 md:h-20">
            <Image
              src="/LogoFullEEVA.svg"
              width={262}
              height={31}
              alt="logoEEva"
              className="w-64 h-auto"
            />
          </div>

          {/* Sección central (Coming Soon) */}
          <div className="flex items-center w-full max-w-md px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <div className="w-full flex flex-col text-[#F9F9F9] justify-around items-center space-y-6 md:space-y-8">
              <h3 className="text-xl md:text-3xl font-bold">COMING SOON</h3>
              <p className="text-lg md:text-2xl">25 | 06 | 25</p>
              <p className="text-sm md:text-base text-center">
                BE THE FIRST TO KNOW WHEN WE GO LIVE
              </p>
              <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-l-md rounded-r-md sm:rounded-r-none w-full sm:w-4/5 bg-white bg-opacity-20 text-white placeholder-gray-300 backdrop-blur-md px-4 text-sm md:text-base focus:outline-none border border-[#DFDFDF]"
                  placeholder="Enter your email address"
                  required
                />
                <button
                  type="submit"
                  className="h-12 w-full sm:w-1/5 bg-[#DFDFDF] rounded-r-md rounded-l-md sm:rounded-l-none text-black text-sm md:text-base"
                >
                  Notify me
                </button>
              </form>
              {message && (
                <p className={`text-sm md:text-base text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>

          <div className="w-[90%] h-[215px] md:h-[315px] flex md:min-w-[1315px]">
            <div className="w-full flex flex-col items-center justify-end px-4 space-y-6 md:space-y-8">
              {/* Sección de logos y redes sociales (desktop y móvil) */}
              <div className="w-full max-w-5xl md:max-w-[72rem] 2xl:max-w-[92rem]  flex flex-col md:flex-row justify-between items-center text-[#F9F9F9] space-y-4 md:space-y-0">
                {/* Logos (e2.svg) */}
                <div className="justify-center order-2 md:order-1 md:w-[260px] xl:w-[250px]  md:block hidden">
                  <Image
                    src="/e2.svg"
                    width={143}
                    height={89}
                    alt="eevaLogo"
                    className="w-auto h-12 md:h-16 "
                  />
                </div>

                {/* Redes sociales */}
                <div className="flex flex-wrap justify-end md:justify-around w-full md:w-auto gap-4 md:gap-8 text-sm md:text-base order-1 md:order-2">
                  {/* Instagram */}
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <p className="pr-[40px] block md:hidden">IG</p>
                    <p className="pr-[40px] hidden md:block">INSTAGRAM</p>
                    <Image src="/x.svg" width={11} height={18} alt="cross" />
                  </a>
                  {/* TikTok */}
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <p className="pr-[40px] block md:hidden">TIKTOK</p>
                    <p className="pr-[40px] hidden md:block">TIKTOK</p>
                    <Image src="/x.svg" width={11} height={18} alt="cross" />
                  </a>
                  {/* Fabebook */}
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <p className="pr-[40px] block md:hidden">FB</p>
                    <p className="pr-[40px] hidden md:block">FACEBOOK</p>

                  </a>
                </div>

                {/* Copyright */}
                <div className="text-center md:text-right order-3 md:order-3 md:block hidden">
                  <p className="text-sm md:text-base">© 2025 EEVA STUDIOS</p>
                </div>
              </div>

              {/* Políticas y términos */}
              <div className="w-full flex justify-center">
                <div className="flex flex-col md:flex-row justify-center w-full max-w-md md:max-w-lg lg:max-w-2xl gap-4 md:gap-8 text-[#F9F9F9] text-sm md:text-base">
                  <p>Políticas de Privacidad</p>
                  <p>Términos de Servicio</p>
                  <p>Cookie Settings</p>
                </div>
              </div>

              {/* Sección adicional solo para móvil: e2.svg y © 2025 EEVA STUDIOS debajo de políticas */}
              <div className="block md:hidden w-full justify-center">
                <div className="flex flex-row items-center justify-between w-full max-w-md gap-4 text-[#F9F9F9] text-sm">
                  <p>© 2025 EEVA STUDIOS</p>
                  <Image
                    src="/e2.svg"
                    width={143}
                    height={89}
                    alt="eevaLogo"
                    className="w-auto h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}