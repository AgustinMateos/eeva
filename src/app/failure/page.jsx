"use client";

import React from 'react';
import Link from 'next/link';

const FailurePage = () => {
  return (
    <div className="min-h-[100vh] bg-gradient-to-r from-[#303F48] to-[#6D7276] w-full flex flex-col justify-center items-center pt-[150px] text-white">
      <h2 className="font-ibm-mono text-[28px] leading-[64px] tracking-[-0.75px] uppercase mb-4">
        Pago Rechazado
      </h2>
      <p className="text-sm mb-4">Lo sentimos, tu pago no pudo ser procesado. Por favor, intenta de nuevo o utiliza otro método de pago.</p>
      <div className="w-full pt-[60px] flex justify-center">
        <Link
          href="/cart"
          className="text-white w-[90%] md:w-[200px] h-[40px] px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] hover:bg-[#2C2C2CE5] uppercase text-center flex items-center justify-center"
        >
          Volver al Checkout
        </Link>
      </div>
    </div>
  );
};

export default FailurePage;