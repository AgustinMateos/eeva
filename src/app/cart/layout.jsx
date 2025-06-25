"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";

export default function CartLayout({ children }) {
 

 

  return (
    <div className="min-h-[100vh] w-full bg-gradient-to-r from-[#303F48] to-[#6D7276] transition-opacity duration-300">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80">
        <Navbar />
      </nav>
      <main>
        <div className="flex justify-center items-start pt-20 pb-10 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
