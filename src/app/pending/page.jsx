"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const PendingPage = () => {
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px] text-white">
      <h2 className="font-ibm-mono text-[28px] leading-[64px] tracking-[-0.75px] uppercase mb-4">
        Pago Pendiente
      </h2>
    </div>
  );
};

export default PendingPage;