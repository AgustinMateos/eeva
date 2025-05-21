"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

export default function CartLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  // Simula un tiempo de carga o puedes integrarlo con una lógica real
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Cambia el estado a false después de 2 segundos
    }, 2500); // Ajusta el tiempo según tus necesidades

    return () => clearTimeout(timer); // Limpieza del temporizador
  }, []);

  return (
    <div className="min-h-[100vh] w-full bg-gradient-to-r from-[#303F48] to-[#6D7276] transition-opacity duration-300">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80">
        <Navbar />
      </nav>
      <main>
        <div className="flex justify-center items-start pt-20 pb-20 w-full">
          {isLoading ? <Loader /> : children}
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full mb-4">
        <Footer />
      </div>
    </div>
  );
}
