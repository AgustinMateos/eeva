"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const PendingPage = () => {
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="min-h-[100vh] bg-gradient-to-r from-[#303F48] to-[#6D7276] w-full flex flex-col justify-center items-center pt-[150px] text-white">
     <div className="flex justify-center w-[390px] items-center flex-col flex-grow">
        
        <Link href="/collections/slider"  >
          <Image
            src={"/LogoFullEEVA.svg"}
            width={262}
            height={31}
            alt="logo"
            className=""
          />
        </Link> 
        <h2 className=" pt-[60px] font-ibm-mono text-[28px] leading-[64px] tracking-[-0.75px] uppercase mb-4">
        ¡Pago Pendiente!
      </h2>
      <div className="w-full pt-[60px] flex justify-center">
        <Link
          href="/collections/slider"
          className="text-white w-[90%] md:w-[250px] h-[40px] px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] hover:bg-[#2C2C2CE5] uppercase text-center flex items-center justify-center"
        >
          Volver a colecciones
        </Link>
      </div>
      </div>
    </div>
  );
};

export default PendingPage;