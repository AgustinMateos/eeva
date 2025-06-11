import React from 'react';
import Image from 'next/image';

const Footer = () => {
  // URLs de las redes sociales (reemplaza con las URLs reales)
  const socialLinks = {
    instagram: 'https://www.instagram.com/eevastudios?igsh=bzA3YXhwaWdiNjBm&utm_source=qr', // Cambia por la URL real
    tiktok: 'https://www.tiktok.com/@eeva.studios?_t=ZM-8vl83zKp6UJ&_r=1', // Cambia por la URL real
    facebook: 'https://www.facebook.com/Eevastudios', // Cambia por la URL real
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 space-y-6 md:space-y-8">
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
  );
};

export default Footer;